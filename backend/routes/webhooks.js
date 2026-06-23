import express from "express";

import {
  inventoryUpdateWebhook,
  createWebhook
} from "../controllers/webhookController.js";


const router = express.Router();


router.post(
  "/inventory",
  express.json(),
  inventoryUpdateWebhook
);


router.post(
  "/create",
  createWebhook
);


export default router;