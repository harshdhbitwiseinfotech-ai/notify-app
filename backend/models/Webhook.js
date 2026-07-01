import mongoose from "mongoose";

const WebhookSchema = new mongoose.Schema({
  shopDomain: {
    type: String,
    required: true,
  },
  webhookType: {
    type: String,
    required: true,
  },
  webhookId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
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

WebhookSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Webhook = mongoose.model("Webhook", WebhookSchema);

export default Webhook;
