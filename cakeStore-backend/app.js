// extternal modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

dotenv.config();

// connect to database
await connectDB();

// local modules
import authRoutes from "./routes/authRoutes.js";
import { verifyToken } from "./middleware/auth.js";

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  console.log("API is running.....");
  res.send("Bakery API is running...");
});

app.use("/api/auth", authRoutes);

app.get("/api/profile", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated",
    user: req.user, // { id, role }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`),
);
