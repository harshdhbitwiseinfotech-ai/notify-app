import mongoose from "mongoose";
import Product from "../models/Product.js";
import Subscriber from "../models/Subscriber.js";
import Notification from "../models/Notification.js";
import { getOrders, getProducts as getShopifyProducts } from "../config/shopify.js";

const mapOrderDistribution = (orders) => {
  const countryCounts = orders.reduce((acc, order) => {
    const country = order.shippingAddress?.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const total = orders.length || 1;
  return Object.entries(countryCounts)
    .map(([country, count]) => ({
      country,
      flag: "🌐",
      visits: `${count * 10}k`,
      percentage: Number(((count / total) * 100).toFixed(1)),
    }))
    .slice(0, 5);
};

const getDashboardStats = async (req, res) => {
  try {
    const [storeProducts, pendingSubscribers] = await Promise.all([
      getShopifyProducts(50),
      Subscriber.countDocuments({ status: "pending" }),
    ]);

    const totalProducts = storeProducts.length;
    const inStock = storeProducts.filter((product) => product.variants.nodes[0]?.inventoryQuantity > 0).length;
    const outOfStock = totalProducts - inStock;

    res.json({
      success: true,
      stats: {
        totalProducts,
        inStock,
        outOfStock,
        pendingSubscribers,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Unable to fetch dashboard stats" });
  }
};

const getRecentSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      subscribers: subscribers.map((s) => ({
        id: s._id.toString(),
        email: s.email,
        productId: s.productId,
        productName: s.productName,
        productImage: s.productImage,
        productPrice: s.productPrice,
        status: s.status,
        createdAt: s.createdAt,
      })),
    });
  } catch (error) {
    console.error("Recent Subscribers Error:", error);
    res.status(500).json({ success: false, message: "Unable to fetch recent subscribers" });
  }
};

const getRecentNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ sentAt: -1 }).limit(10);

    res.json({
      success: true,
      notifications: notifications.map((notification) => ({
        id: notification._id.toString(),
        productId: notification.productId,
        productName: notification.productName,
        productImage: notification.productImage,
        productPrice: notification.productPrice,
        email: notification.email,
        status: notification.status,
        sentAt: notification.sentAt,
        subject: notification.subject,
      })),
    });
  } catch (error) {
    console.error("Recent Notifications Error:", error);
    res.status(500).json({ success: false, message: "Unable to fetch recent notifications" });
  }
};

const getDashboardProducts = async (req, res) => {
  try {
    const [storeProducts, pendingSubscribers] = await Promise.all([
      getShopifyProducts(50),
      Subscriber.find({ status: "pending" }),
    ]);

    const subscribersByProduct = pendingSubscribers.reduce((acc, subscriber) => {
      const key = subscriber.productId;
      if (!acc[key]) acc[key] = [];
      acc[key].push({
        id: subscriber._id.toString(),
        email: subscriber.email,
        status: subscriber.status,
      });
      return acc;
    }, {});

    const mappedProducts = storeProducts.map((product) => {
      const variant = product.variants.nodes[0] || {};
      return {
        id: product.id,
        shopifyProductId: product.id,
        variantId: variant.id,
        title: product.title,
        image: product.featuredImage?.url || "",
        price: Number(variant.price) || 0,
        inventory: variant.inventoryQuantity || 0,
        status: variant.inventoryQuantity > 0 ? "in_stock" : "out_of_stock",
        inStock: variant.inventoryQuantity > 0,
        notifyCount: subscribersByProduct[product.id]?.length || 0,
        subscribers: subscribersByProduct[product.id] || [],
        qtySold: 0,
        unitPrice: Number(variant.price) || 0,
        dateAdded: new Date(product.createdAt),
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.createdAt),
      };
    });

    res.json({ success: true, products: mappedProducts });
  } catch (error) {
    console.error("Dashboard Products Error:", error);
    res.status(500).json({ success: false, message: "Unable to fetch dashboard products" });
  }
};

const getDashboardAnalytics = async (req, res) => {
  try {
    const [orders, storeProducts] = await Promise.all([
      getOrders(50),
      getShopifyProducts(50),
    ]);

    const grossTotal = orders.reduce((sum, order) => {
      const amount = Number(order.totalPriceSet?.shopMoney?.amount || 0);
      return sum + amount;
    }, 0);

    const salesByProduct = {};
    orders.forEach((order) => {
      order.lineItems.edges.forEach(({ node }) => {
        const productId = node.variant?.product?.id || "unknown";
        const title = node.variant?.product?.title || "Unknown product";
        const quantity = node.quantity || 0;
        const price = Number(node.variant?.price || 0);
        if (!salesByProduct[productId]) {
          salesByProduct[productId] = {
            productId,
            productName: title,
            qtySold: 0,
            unitPrice: price,
            revenue: 0,
          };
        }
        salesByProduct[productId].qtySold += quantity;
        salesByProduct[productId].revenue += quantity * price;
      });
    });

    const distribution = mapOrderDistribution(orders);
    const mappedProducts = storeProducts.map((product, idx) => {
      const variant = product.variants.nodes[0] || {};
      const sales = salesByProduct[product.id] || {};
      return {
        id: product.id,
        productName: product.title,
        status: variant.inventoryQuantity > 0 ? "In Stock" : "Sold out",
        qtySold: sales.qtySold || 0,
        unitPrice: Number(variant.price) || 0,
        dateAdded: new Date(product.createdAt).toLocaleDateString(),
        image: product.featuredImage?.url || "",
        color: ["#3b82f6", "#d946ef", "#06b6d4", "#10b981", "#f59e0b"][idx % 5],
      };
    });

    res.json({
      success: true,
      stats: {
        grossProfit: {
          total: `$${grossTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          percentage: "+21.2%",
          subText: "+Real store revenue this month",
          isPositive: true,
        },
        netProfit: {
          total: `$${(grossTotal * 0.3).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          percentage: "+16.4%",
          subText: "+Estimated net profit",
          isPositive: true,
        },
        ordersCompleted: {
          total: `${orders.length}`,
          percentage: "+62%",
          subText: "Real completed orders",
          isPositive: true,
        },
        storeVisits: {
          total: `${Math.max(100, orders.length * 150)}k`,
          percentage: "-11.2%",
          subText: "Traffic estimated from orders",
          isPositive: false,
        },
      },
      distribution,
      products: mappedProducts,
    });
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);
    res.status(500).json({ success: false, message: "Unable to fetch analytics" });
  }
};

const simulateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const condition = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { shopifyProductId: id }] }
      : { shopifyProductId: id };

    const updated = await Product.findOneAndUpdate(
      condition,
      { $inc: { qtySold: 15 } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Sale simulated",
      product: {
        id: updated._id.toString(),
        qtySold: updated.qtySold,
        title: updated.title,
      },
    });
  } catch (error) {
    console.error("Simulate Sale Error:", error);
    res.status(500).json({ success: false, message: "Unable to simulate sale" });
  }
};

export {
  getDashboardStats,
  getRecentSubscribers,
  getRecentNotifications,
  getDashboardProducts,
  getDashboardAnalytics,
  simulateSale,
};
