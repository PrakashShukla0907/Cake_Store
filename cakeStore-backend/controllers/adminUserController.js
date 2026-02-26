import User from "../models/user.js";

/**
 * GET ALL CUSTOMERS (excluding admins)
 */
export const getAdminUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { role: { $ne: "admin" } };

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .select("-password"); // Exclude password from stats tracking

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
