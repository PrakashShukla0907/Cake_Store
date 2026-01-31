import User from "../models/user.js";
import Product from "../models/product.js";

/* ================= CART ================= */

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (quantity < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const user = await User.findById(req.user.id);

    const itemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({
        productId,
        quantity,
        priceAtAdd: product.price,
      });
    }

    await user.save();
    res.json({ success: true, message: "Added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Quantity must be at least 1" });
    }

    const user = await User.findById(req.user.id);

    const item = user.cart.find(
      (item) => item.productId.toString() === productId,
    );

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    item.quantity = quantity;
    await user.save();

    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId,
    );

    await user.save();
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= FAVOURITES ================= */

export const toggleFavourite = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);

    const index = user.favourites.indexOf(productId);

    if (index > -1) {
      user.favourites.splice(index, 1);
    } else {
      user.favourites.push(productId);
    }

    await user.save();
    res.json({ success: true, favourites: user.favourites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favourites");
    res.json({ success: true, favourites: user.favourites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
