import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
    },

    category: {
      type: String,
      enum: ["cake", "pastry", "bread", "cookies", "cupcake", "other"],
      default: "Other",
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Indexes for optimized querying
productSchema.index({ available: 1, createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
