import Subscriber from "../models/Subscriber.js";

const createSubscriber = async (req, res) => {
  try {
    const { email, productId, variantId, productName, productImage, price } = req.body;

    if (!email || !productId) {
      return res.status(400).json({ success: false, message: "Email and product are required" });
    }

    const existingSubscriber = await Subscriber.findOne({ email, productId });

    if (existingSubscriber) {
      return res.json({ success: false, message: "You are already subscribed for this product" });
    }

    const subscriber = await Subscriber.create({
      email,
      productId,
      variantId,
      productName,
      productImage,
      productPrice: Number(price) || 0,
      status: "pending",
    });

    res.json({
      success: true,
      message: "You will be notified when product is back in stock",
      subscriber: {
        id: subscriber._id.toString(),
        email: subscriber.email,
        productId: subscriber.productId,
      },
    });
  } catch (error) {
    console.error("Create Subscriber Error:", error);
    res.status(500).json({ success: false, message: "Unable to subscribe" });
  }
};

const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      subscribers: subscribers.map((subscriber) => ({
        id: subscriber._id.toString(),
        email: subscriber.email,
        productId: subscriber.productId,
        variantId: subscriber.variantId,
        productName: subscriber.productName,
        productImage: subscriber.productImage,
        productPrice: subscriber.productPrice,
        status: subscriber.status,
        createdAt: subscriber.createdAt,
        updatedAt: subscriber.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Get Subscribers Error:", error);
    res.status(500).json({ success: false, message: "Unable to fetch subscribers" });
  }
};

const getProductSubscribers = async (req, res) => {
  try {
    const { productId } = req.params;
    const subscribers = await Subscriber.find({ productId, status: "pending" }).sort({ createdAt: -1 });

    res.json({
      success: true,
      subscribers: subscribers.map((subscriber) => ({
        id: subscriber._id.toString(),
        email: subscriber.email,
        productId: subscriber.productId,
        variantId: subscriber.variantId,
        productName: subscriber.productName,
        productImage: subscriber.productImage,
        productPrice: subscriber.productPrice,
        status: subscriber.status,
        createdAt: subscriber.createdAt,
        updatedAt: subscriber.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Product Subscribers Error:", error);
    res.status(500).json({ success: false, message: "Unable to get subscribers" });
  }
};

const checkSubscription = async (req, res) => {
  try {
    const { email, productId } = req.query;

    if (!email || !productId) {
      return res.json({ subscribed: false });
    }

    const existingSubscriber = await Subscriber.findOne({ email, productId });
    res.json({ subscribed: Boolean(existingSubscriber) });
  } catch (error) {
    console.error("Check Subscription Error:", error);
    res.status(500).json({ subscribed: false, message: "Unable to check subscription" });
  }
};

const updateSubscriberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const subscriber = await Subscriber.findByIdAndUpdate(id, { status }, { new: true });

    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found" });
    }

    res.json({ success: true, message: "Subscriber status updated" });
  } catch (error) {
    console.error("Update Subscriber Error:", error);
    res.status(500).json({ success: false, message: "Status update failed" });
  }
};

const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const subscriber = await Subscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found" });
    }

    res.json({ success: true, message: "Subscriber deleted" });
  } catch (error) {
    console.error("Delete Subscriber Error:", error);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

export {
  createSubscriber,
  getSubscribers,
  getProductSubscribers,
  checkSubscription,
  updateSubscriberStatus,
  deleteSubscriber,
};
