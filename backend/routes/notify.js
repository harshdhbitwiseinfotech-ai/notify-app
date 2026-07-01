import express from "express";
import { createSubscriber } from "../controllers/subscriberController.js";

const router = express.Router();

router.post(
  "/",
  createSubscriber
);

router.post(
  "/subscribe",
  createSubscriber
);

export default router;
