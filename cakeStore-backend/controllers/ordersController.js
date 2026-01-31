import User from "../models/user.js";
import Order from "../models/orders.js";

/* ================= PLACE ORDER ================= */
export const placeOrder = async (req, res) => {
  try {
    const { address, lat, lng, paymentMethod = "Cash on Delivery" } = req.body;

    if (!address || lat == null || lng == null) {
      return res.status(400).json({
        success: false,
        message: "Delivery address and location are required",
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

    // Clear cart after order
    user.cart = [];
    await user.save();

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

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order cancelled successfully",
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
