import User from "../models/user.js";
import Order from "../models/orders.js";
import Notification from "../models/notification.js";

/* ================= PLACE ORDER ================= */
export const placeOrder = async (req, res) => {
  try {
    const { 
      address, 
      lat = 0, 
      lng = 0, 
      paymentMethod = "Cash on Delivery" 
    } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    const user = await User.findById(req.user.id).populate("cart.productId");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Prepare order items & calculate total
    let totalAmount = 0;
    const items = user.cart.map((item) => {
      totalAmount += item.productId.price * item.quantity;
      return {
        product: item.productId._id,
        quantity: item.quantity,
      };
    });

    const order = await Order.create({
      user: user._id,
      items,
      totalAmount,
      deliveryLocation: {
        address,
        lat,
        lng,
      },
      paymentMethod,
    });

    // Run non-critical writes in the background to reduce response latency
    Promise.all([
      Notification.create({
        type: "New Order",
        message: `A new order of ₹${totalAmount.toFixed(2)} has been placed by ${user.name}.`,
        data: { orderId: order._id },
      }),
      User.updateOne({ _id: user._id }, { $set: { cart: [] } }),
    ]).catch((err) => console.error("Place order background tasks error:", err));

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
};

/* ================= CANCEL ORDER ================= */
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled now",
      });
    }

    const timeElapsed = Date.now() - new Date(order.createdAt).getTime();
    if (timeElapsed > 2 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "Cancellation time limit (2 minutes) has expired.",
      });
    }

    order.orderStatus = "Cancelled";
    order.cancelledBy = "User";
    await order.save();

    // Notify admin in the background
    Notification.create({
      type: "Order Cancelled",
      message: `Order #${order._id.toString().substring(order._id.toString().length - 6).toUpperCase()} was cancelled by the customer.`,
      data: { orderId: order._id },
    }).catch((err) => console.error("Cancel order notification error:", err));

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};

/* ================= GET MY ORDERS ================= */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
