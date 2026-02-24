import express from "express";
import {
  postSignup,
  postLogin,
  postLogout,
  getProfile,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";

const authRoutes = express.Router();

authRoutes.post("/signup", postSignup);
authRoutes.post("/login", postLogin);

// 🔐 logout should be protected
authRoutes.post("/logout", verifyToken, postLogout);

// 🔐 get user profile
authRoutes.get("/me", verifyToken, getProfile);

export default authRoutes;
