import express from "express";

import {
  getDashboardStats,
  getRecentSubscribers,
  getRecentNotifications
} from "../controllers/dashboardController.js";


const router = express.Router();


router.get(
  "/stats",
  getDashboardStats
);


router.get(
  "/subscribers",
  getRecentSubscribers
);


router.get(
  "/notifications",
  getRecentNotifications
);


export default router;