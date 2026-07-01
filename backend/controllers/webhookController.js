import Product from "../models/Product.js";
import Subscriber from "../models/Subscriber.js";
import Notification from "../models/Notification.js";
import Webhook from "../models/Webhook.js";
import { sendBackInStockEmail } from "../services/emailService.js";

const inventoryUpdateWebhook = async (req, res) => {
  try {
    const webhookData = req.body;
    const variantId = webhookData.inventory_item_id;
    const availableQuantity = webhookData.available || 0;
    const status = availableQuantity > 0 ? "in_stock" : "out_of_stock";

    const product = await Product.findOneAndUpdate(
      { variantId },
      { inventoryQuantity: availableQuantity, status },
      { new: true }
    );

    if (status === "in_stock" && product) {
      await notifySubscribers(variantId, product);
    }

    res.status(200).json({ success: true, message: "Inventory webhook processed" });
  } catch (error) {
    console.error("Inventory Webhook Error:", error);
    res.status(500).json({ success: false, message: "Webhook processing failed" });
  }
};

const notifySubscribers = async (variantId, product) => {
  try {
    const subscribers = await Subscriber.find({ variantId, status: "pending" });
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5000";

    for (const subscriber of subscribers) {
      const emailResult = await sendBackInStockEmail({
        email: subscriber.email,
        productName: subscriber.productName,
        productImage: subscriber.productImage,
        price: subscriber.productPrice,
        productUrl: `${clientUrl}/products/${subscriber.productId}`,
        buyUrl: `${clientUrl}/cart/${subscriber.variantId}:1`,
      });

      subscriber.status = emailResult.success ? "notified" : "failed";
      subscriber.notifiedAt = new Date();
      await subscriber.save();

      await Notification.create({
        subscriberId: subscriber._id.toString(),
        productId: subscriber.productId,
        productName: subscriber.productName,
        productImage: subscriber.productImage,
        productPrice: subscriber.productPrice,
        email: subscriber.email,
        subject: "Product Back In Stock",
        message: `${subscriber.productName} is back in stock.`,
        status: emailResult.success ? "sent" : "failed",
        sentAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Subscriber Notification Error:", error);
  }
};

const createWebhook = async (req, res) => {
  try {
    const { shopDomain, webhookType, webhookId } = req.body;

    await Webhook.create({
      shopDomain,
      webhookType,
      webhookId,
      status: "active",
    });

    res.json({ success: true, message: "Webhook saved" });
  } catch (error) {
    console.error("Webhook Log Error:", error);
    res.status(500).json({ success: false, message: "Webhook log failed" });
  }
};

export { inventoryUpdateWebhook, createWebhook };
