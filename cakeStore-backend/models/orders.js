import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    deliveryLocation: {
      address: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        default: 0,
      },
      lng: {
        type: Number,
        default: 0,
      },
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Baking", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
