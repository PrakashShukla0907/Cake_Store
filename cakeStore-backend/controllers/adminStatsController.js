import Product from "../models/product.js";
import Order from "../models/orders.js";
import User from "../models/user.js";

/**
 * GET DASHBOARD STATS
 * Calculates Total Revenue, Total Orders, Total Products, Total Users, and Monthly Sales
 */
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const totalOrders = await Order.countDocuments();

    // Total revenue aggregation globally (Only Delivered Orders)
    const revenueAggregation = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // --- Dynamic Trend Calculations ---
    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Current Month Counts
    const currentOrders = await Order.countDocuments({ createdAt: { $gte: currentMonthStart } });
    const currentProducts = await Product.countDocuments({ createdAt: { $gte: currentMonthStart } });
    const currentUsers = await User.countDocuments({ role: { $ne: "admin" }, createdAt: { $gte: currentMonthStart } });

    // Last Month Counts
    const lastOrders = await Order.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } });
    const lastProducts = await Product.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } });
    const lastUsers = await User.countDocuments({ role: { $ne: "admin" }, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } });

    // Revenue Trends (Only Delivered Orders)
    const currentRevenueAgg = await Order.aggregate([
      { $match: { orderStatus: "Delivered", createdAt: { $gte: currentMonthStart } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const currentRevenue = currentRevenueAgg.length > 0 ? currentRevenueAgg[0].total : 0;

    const lastRevenueAgg = await Order.aggregate([
      { $match: { orderStatus: "Delivered", createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const lastRevenue = lastRevenueAgg.length > 0 ? lastRevenueAgg[0].total : 0;

    const trends = {
      revenue: calculateTrend(currentRevenue, lastRevenue),
      orders: calculateTrend(currentOrders, lastOrders),
      products: calculateTrend(currentProducts, lastProducts),
      users: calculateTrend(currentUsers, lastUsers)
    };

    // --- Monthly Sales for Line Chart ---
    const currentYear = new Date().getFullYear();
    const monthlySalesAggregation = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlySales = monthlySalesAggregation.map((data) => ({
      name: monthNames[data._id - 1],
      revenue: data.revenue,
    }));

    res.status(200).json({
      success: true,
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      monthlySales,
      trends
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
