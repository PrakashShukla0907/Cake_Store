import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { getDashboardStats } from "../controllers/adminStatsController.js";

const adminStatsRoutes = express.Router();

adminStatsRoutes.get("/", verifyToken, isAdmin, getDashboardStats);

export default adminStatsRoutes;
