import Order from "../models/orders.js";

/* ================= GET ALL ORDERS ================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name phone email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

/* ================= UPDATE ORDER STATUS ================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "Pending",
      "Baking",
      "Out for Delivery",
      "Delivered",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

/* ================= MARK ORDER AS PAID ================= */
export const markOrderAsPaid = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.isPaid = true;
    await order.save();

    res.json({
      success: true,
      message: "Order marked as paid",
      order,
    });
  } catch (error) {
    console.error("Mark paid error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark order as paid",
    });
  }
};
