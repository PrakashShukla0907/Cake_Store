import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["New Order", "Low Stock", "Order Cancelled", "General"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
