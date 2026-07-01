import express from "express";

import {
  getDashboardStats,
  getRecentSubscribers,
  getRecentNotifications,
  getDashboardProducts,
  getDashboardAnalytics,
  simulateSale,
} from "../controllers/dashboardController.js";
import { updateSubscriberStatus } from "../controllers/subscriberController.js";

const router = express.Router();

router.get(
  "/stats",
  getDashboardStats
);

router.get(
  "/analytics",
  getDashboardAnalytics
);

router.post(
  "/sale/:id",
  simulateSale
);

router.get(
  "/products",
  getDashboardProducts
);

router.get(
  "/subscribers",
  getRecentSubscribers
);

router.put(
  "/subscribers/:id",
  updateSubscriberStatus
);

router.get(
  "/notifications",
  getRecentNotifications
);

export default router;
