import express from "express";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } from "../controllers/adminNotificationController.js";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getNotifications);
router.put("/mark-all-read", verifyToken, isAdmin, markAllAsRead);
router.put("/:id/mark-read", verifyToken, isAdmin, markAsRead);
router.delete("/clear-all", verifyToken, isAdmin, deleteAllNotifications);
router.delete("/:id", verifyToken, isAdmin, deleteNotification);

export default router;
