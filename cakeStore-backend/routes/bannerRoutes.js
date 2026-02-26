import express from "express";
import parser from "../middleware/multer.js";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  getBanners,
  addBanner,
  removeBanner,
} from "../controllers/bannerController.js";

const bannerRoutes = express.Router();

// Public route to get banners (like the banners for the homepage)
bannerRoutes.get("/", getBanners);

// Admin only routes for managing banners
bannerRoutes.post(
  "/",
  verifyToken,
  isAdmin,
  parser.single("image"),
  addBanner
);

bannerRoutes.delete(
  "/:id",
  verifyToken,
  isAdmin,
  removeBanner
);

export default bannerRoutes;
