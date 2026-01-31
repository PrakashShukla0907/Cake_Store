import express from "express";
import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  toggleFavourite,
  getFavourites,
} from "../controllers/userController.js";

import { verifyToken } from "../middleware/auth.js";

const userRoutes = express.Router();

/* ================= CART ROUTES ================= */

// Add product to cart
userRoutes.post("/cart", verifyToken, addToCart);

// Get user cart
userRoutes.get("/cart", verifyToken, getCart);

// Update cart item quantity
userRoutes.put("/cart", verifyToken, updateCartQuantity);

// Remove item from cart
userRoutes.delete("/cart/:productId", verifyToken, removeFromCart);

/* ================= FAVOURITE ROUTES ================= */

// Add / Remove favourite
userRoutes.post("/favourites/:productId", verifyToken, toggleFavourite);

// Get favourites
userRoutes.get("/favourites", verifyToken, getFavourites);

export default userRoutes;
