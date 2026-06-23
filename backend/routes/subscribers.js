import express from "express";

import {
  createSubscriber,
  getSubscribers,
  getProductSubscribers,
  updateSubscriberStatus,
  deleteSubscriber
} from "../controllers/subscriberController.js";


const router = express.Router();

router.post(
  "/",
  createSubscriber
);

router.get(
  "/",
  getSubscribers
);

router.get(
  "/product/:productId",
  getProductSubscribers
);

router.put(
  "/:id",
  updateSubscriberStatus
);

router.delete(
  "/:id",
  deleteSubscriber
);

export default router;