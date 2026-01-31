// external modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// local modules
import connectDB from "./config/db.js";
import { verifyToken } from "./middleware/auth.js";

import authRoutes from "./routes/authRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/ordersRoutes.js";
import adminOrderRoutes from "./routes/adminOrdersRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";

dotenv.config();

// connect to database
await connectDB();

const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(morgan("dev"));

// ---------- BASE ROUTE ----------
app.get("/", (req, res) => {
  res.send("Bakery API v1 is running 🚀");
});

// ---------- API v1 ----------
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", storeRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/user/orders", orderRoutes);

// ---------- ADMIN ----------
app.use("/api/v1/admin/orders", adminOrderRoutes);
app.use("/api/v1/admin/products", adminProductRoutes);

// ---------- SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
