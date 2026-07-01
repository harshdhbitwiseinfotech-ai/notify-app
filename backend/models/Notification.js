import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  subscriberId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    default: "",
  },
  productPrice: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  subject: {
    type: String,
    default: "Product Back In Stock",
  },
  message: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending",
  },
  sentAt: {
    type: Date,
    default: null,
  },
  errorMessage: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

NotificationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

NotificationSchema.index({ productId: 1, email: 1 });

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
