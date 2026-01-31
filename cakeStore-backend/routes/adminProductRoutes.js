import express from "express";
import parser from "../middleware/multer.js";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  toggleAvailability,
} from "../controllers/adminProductController.js";

const adminProductRoutes = express.Router();

adminProductRoutes.post(
  "/",
  verifyToken,
  isAdmin,
  parser.single("image"),
  createProduct,
);
adminProductRoutes.get("/", verifyToken, isAdmin, getAllProducts);
adminProductRoutes.get("/:id", verifyToken, isAdmin, getSingleProduct);
adminProductRoutes.put(
  "/:id",
  verifyToken,
  isAdmin,
  parser.single("image"),
  updateProduct,
);
adminProductRoutes.delete("/:id", verifyToken, isAdmin, deleteProduct);
adminProductRoutes.patch(
  "/:id/availability",
  verifyToken,
  isAdmin,
  toggleAvailability,
);

export default adminProductRoutes;
