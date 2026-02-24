import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected successfully");
    return mongoose;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Don't exit process - let server run without DB temporarily
  }
};
export default connectDB;
