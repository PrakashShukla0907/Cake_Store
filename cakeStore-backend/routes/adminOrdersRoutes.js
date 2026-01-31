import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
  markOrderAsPaid,
} from "../controllers/adminOrdersController.js";

import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const adminOrderRoutes = express.Router();

// All routes below are ADMIN only
adminOrderRoutes.use(verifyToken, isAdmin);

// Get all orders
adminOrderRoutes.get("/", getAllOrders);

// Update order status
adminOrderRoutes.patch("/:id/status", updateOrderStatus);

// Mark order as paid
adminOrderRoutes.patch("/orders/:orderId/pay", markOrderAsPaid);

export default adminOrderRoutes;
