import Product from "../models/product.js";
import Order from "../models/orders.js";
import User from "../models/user.js";

/**
 * GET DASHBOARD STATS
 * Calculates Total Revenue, Total Orders, Total Products, Total Users, and Monthly Sales
 */
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const currentYear = new Date().getFullYear();

    const [
      totalProducts,
      totalUsers,
      totalOrders,
      revenueAggregation,
      currentOrders,
      currentProducts,
      currentUsers,
      lastOrders,
      lastProducts,
      lastUsers,
      currentRevenueAgg,
      lastRevenueAgg,
      monthlySalesAggregation
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: { $ne: "admin" } }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: "Delivered" } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: currentMonthStart } }),
      Product.countDocuments({ createdAt: { $gte: currentMonthStart } }),
      User.countDocuments({ role: { $ne: "admin" }, createdAt: { $gte: currentMonthStart } }),
      Order.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      Product.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      User.countDocuments({ role: { $ne: "admin" }, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      Order.aggregate([
        { $match: { orderStatus: "Delivered", createdAt: { $gte: currentMonthStart } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.aggregate([
        { $match: { orderStatus: "Delivered", createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.aggregate([
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
      ])
    ]);

    // Derived values
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;
    const currentRevenue = currentRevenueAgg.length > 0 ? currentRevenueAgg[0].total : 0;
    const lastRevenue = lastRevenueAgg.length > 0 ? lastRevenueAgg[0].total : 0;

    // --- Dynamic Trend Calculations ---
    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

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
