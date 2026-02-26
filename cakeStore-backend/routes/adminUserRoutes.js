import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { getAdminUsers } from "../controllers/adminUserController.js";

const adminUserRoutes = express.Router();

adminUserRoutes.get("/", verifyToken, isAdmin, getAdminUsers);

export default adminUserRoutes;
