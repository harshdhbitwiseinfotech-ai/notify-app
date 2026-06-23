import express from "express";
import {
  getProducts,
  getProduct,
  syncProductFromShopify,
  updateProductInventory
} from "../controllers/productController.js";


const router = express.Router();

router.get(
  "/",
  getProducts
);

router.get(
  "/:id",
  getProduct
);

router.post(
  "/sync",
  syncProductFromShopify
);

router.put(
  "/inventory",
  updateProductInventory
);

export default router;