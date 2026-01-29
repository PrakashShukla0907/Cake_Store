import express from "express";

const authRoutes = express.Router();

import { postSignup, postLogin } from "../controllers/authController.js";

authRoutes.post("/signup", postSignup);
authRoutes.post("/login", postLogin);
// authRoutes.post("/logout", postLogout);

export default authRoutes;
