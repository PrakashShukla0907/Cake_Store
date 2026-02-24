import express from "express";
import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  toggleFavourite,
  getFavourites,
} from "../controllers/userController.js";

import { getProfile } from "../controllers/authController.js";

import { verifyToken } from "../middleware/auth.js";

const userRoutes = express.Router();

/* ================= PROFILE ROUTE ================= */

// Get user profile
userRoutes.get("/profile", verifyToken, getProfile);

/* ================= CART ROUTES ================= */

// Get cart
userRoutes.get("/cart", verifyToken, getCart);

// Add to cart
userRoutes.post("/cart", verifyToken, addToCart);

// Update cart quantity
userRoutes.put("/cart", verifyToken, updateCartQuantity);

// Remove item from cart
userRoutes.delete("/cart/:productId", verifyToken, removeFromCart);

/* ================= FAVOURITE ROUTES ================= */

// Add / Remove favourite
userRoutes.post("/favourites/:productId", verifyToken, toggleFavourite);

// Get favourites
userRoutes.get("/favourites", verifyToken, getFavourites);

export default userRoutes;
