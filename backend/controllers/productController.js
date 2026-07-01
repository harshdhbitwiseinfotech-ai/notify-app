import Product from "../models/Product.js";
import Subscriber from "../models/Subscriber.js";
import {
  getProductById,
  updateInventoryStatus
} from "../config/shopify.js";

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    const productIds = products.map((product) => product._id.toString());
    const pendingSubscribers = await Subscriber.find({ status: "pending" });

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

    const mappedProducts = products.map((product) => ({
      id: product._id.toString(),
      shopifyProductId: product.shopifyProductId,
      variantId: product.variantId,
      title: product.title,
      image: product.image,
      price: product.price,
      inventory: product.inventoryQuantity,
      status: product.status,
      inStock: product.status === "in_stock",
      notifyCount: subscribersByProduct[product._id.toString()]?.length || 0,
      subscribers: subscribersByProduct[product._id.toString()] || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    res.json({ success: true, products: mappedProducts });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ success: false, message: "Unable to fetch products" });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      product: {
        id: product._id.toString(),
        shopifyProductId: product.shopifyProductId,
        variantId: product.variantId,
        title: product.title,
        image: product.image,
        price: product.price,
        inventory: product.inventoryQuantity,
        status: product.status,
        inStock: product.status === "in_stock",
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ success: false, message: "Unable to fetch product" });
  }
};

const syncProductFromShopify = async (req, res) => {
  try {
    const { productId } = req.body;
    const productResponse = await getProductById(productId);
    const variant = productResponse?.variants?.nodes?.[0];

    if (!productResponse || !variant) {
      return res.status(400).json({ success: false, message: "Invalid Shopify product payload" });
    }

    await Product.findOneAndUpdate(
      { shopifyProductId: productResponse.id },
      {
        shopifyProductId: productResponse.id,
        variantId: variant.id,
        title: productResponse.title,
        image: productResponse.featuredImage?.url || "",
        price: Number(variant.price) || 0,
        inventoryQuantity: variant.inventoryQuantity || 0,
        status: variant.inventoryQuantity > 0 ? "in_stock" : "out_of_stock",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, message: "Product synced successfully" });
  } catch (error) {
    console.error("Sync Product Error:", error);
    res.status(500).json({ success: false, message: "Product sync failed" });
  }
};

const updateProductInventory = async (req, res) => {
  try {
    const { variantId } = req.body;
    const inventory = await updateInventoryStatus(variantId);
    const status = inventory > 0 ? "in_stock" : "out_of_stock";

    const updatedProduct = await Product.findOneAndUpdate(
      { variantId },
      { inventoryQuantity: inventory, status },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      inventory,
      status,
    });
  } catch (error) {
    console.error("Inventory Update Error:", error);
    res.status(500).json({ success: false, message: "Inventory update failed" });
  }
};

export {
  getProducts,
  getProduct,
  syncProductFromShopify,
  updateProductInventory,
};

