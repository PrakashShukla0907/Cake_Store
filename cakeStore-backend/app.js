// extternal modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

dotenv.config();


// connect to database
await connectDB();


import authRoutes from "./routes/authRoutes.js";

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`),
);
