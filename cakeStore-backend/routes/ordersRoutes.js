import express from "express";
import {
  placeOrder,
  cancelOrder,
  getMyOrders,
} from "../controllers/ordersController.js";

import { verifyToken } from "../middleware/auth.js";

const orderRoutes = express.Router();

// Place order
orderRoutes.post("/", verifyToken, placeOrder);

// Cancel order only if pending
orderRoutes.patch("/:orderId/cancle", verifyToken, cancelOrder);

// Get my orders
orderRoutes.get("/my-orders", verifyToken, getMyOrders);

export default orderRoutes;
