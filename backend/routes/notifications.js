import express from "express";
import Notification from "../models/Notification.js";
import { sendBackInStockEmail } from "../services/emailService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      notifications: notifications.map((n) => ({
        id: n._id.toString(),
        productId: n.productId,
        productName: n.productName,
        productImage: n.productImage,
        productPrice: n.productPrice,
        email: n.email,
        status: n.status,
        sentAt: n.sentAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/send", async (req, res) => {
  try {
    const { email, productId, variantId, productName, productImage, price, productUrl, buyUrl } = req.body;
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5000";
    const resolvedProductUrl = productUrl || `${clientUrl}/products/${productId}`;
    const resolvedBuyUrl = buyUrl || `${clientUrl}/cart/${variantId}:1`;

    const result = await sendBackInStockEmail({
      email,
      productName,
      productImage,
      price,
      productUrl: resolvedProductUrl,
      buyUrl: resolvedBuyUrl,
    });

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.message || "Email failed" });
    }

    await Notification.create({
      subscriberId: "",
      productId: productId || "",
      productName: productName || "",
      productImage: productImage || "",
      productPrice: Number(price) || 0,
      email,
      subject: `${productName} is back in stock`,
      message: `${productName} is back in stock.`,
      status: "sent",
      sentAt: new Date(),
    });

    res.json({ success: true, message: "Notification sent" });
  } catch (error) {
    console.error("Send Notification Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const { subscribers, product } = req.body;
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5000";
    const sendResults = [];

    for (const subscriber of subscribers || []) {
      const resolvedProductUrl = product?.url || `${clientUrl}/products/${product?.id}`;
      const resolvedBuyUrl = product?.buyUrl || `${clientUrl}/cart/${subscriber.variantId}:1`;

      const result = await sendBackInStockEmail({
        email: subscriber.email,
        productName: subscriber.productName || product?.title || "Product",
        productImage: subscriber.productImage || product?.image || "",
        price: subscriber.productPrice || product?.price || 0,
        productUrl: resolvedProductUrl,
        buyUrl: resolvedBuyUrl,
      });

      sendResults.push({ email: subscriber.email, success: result.success, message: result.message });

      await Notification.create({
        subscriberId: subscriber.id || "",
        productId: product?.id || subscriber.productId || "",
        productName: subscriber.productName || product?.title || "",
        productImage: subscriber.productImage || product?.image || "",
        productPrice: subscriber.productPrice || product?.price || 0,
        email: subscriber.email,
        subject: `${subscriber.productName || product?.title || "Product"} is back in stock`,
        message: result.success ? "Bulk notification sent" : "Bulk notification failed",
        status: result.success ? "sent" : "failed",
        sentAt: new Date(),
      });
    }

    res.json({ success: true, sent: sendResults.filter((item) => item.success).length, results: sendResults });
  } catch (error) {
    console.error("Bulk Notification Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
