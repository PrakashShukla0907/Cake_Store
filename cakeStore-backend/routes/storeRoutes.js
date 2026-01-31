import express from "express";
import {
  getStoreProducts,
  getStoreProductById,
  getProductsByCategory,
} from "../controllers/storeController.js";

const storeRoutes = express.Router();

// Public store routes (Guest / User / Admin)
storeRoutes.get("/", getStoreProducts);
storeRoutes.get("/category/:category", getProductsByCategory);
storeRoutes.get("/:id", getStoreProductById);

export default storeRoutes;
