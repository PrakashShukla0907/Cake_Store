import express from "express";
import {
  postSignup,
  postLogin,
  postLogout,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";

const authRoutes = express.Router();

authRoutes.post("/signup", postSignup);
authRoutes.post("/login", postLogin);

// 🔐 logout should be protected
authRoutes.post("/logout", verifyToken, postLogout);

export default authRoutes;
