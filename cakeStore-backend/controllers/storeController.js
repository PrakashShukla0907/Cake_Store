import Product from "../models/product.js";

/**
 * @desc Get store products with search & pagination
 * @route GET /api/store
 * @access Public
 */
export const getStoreProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const { search, category } = req.query;

    // build query
    const query = { available: true };

    // search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // filter by category
    if (category) {
      query.category = category;
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

/**
 * @desc Get product by ID
 * @route GET /api/store/:id
 */
export const getStoreProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      available: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};

/**
 * @desc Get products by category
 * @route GET /api/store/category/:category
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      available: true,
    });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category products",
    });
  }
};
