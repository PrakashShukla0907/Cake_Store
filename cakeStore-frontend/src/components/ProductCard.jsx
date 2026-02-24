import { useState, useContext } from "react";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { addToCart } from "../api/product.api";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
      });
      setMessage("✓ Added to cart!");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage("Failed to add to cart");
      console.error("Add to cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={classNames(
        "rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2",
        theme === "dark"
          ? "bg-[#3A2A25] text-[#E5D3C5]"
          : "bg-white text-gray-900",
      )}
    >
      {/* Product Image */}
      <div
        className={classNames(
          "h-48 overflow-hidden bg-linear-to-br ",
          theme === "dark"
            ? "from-amber-900 to-amber-800"
            : "from-amber-100 to-orange-100",
        )}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍰
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-bold text-lg line-clamp-2 mb-2">{product.name}</h3>

        {/* Product Description */}
        {product.description && (
          <p
            className={classNames(
              "text-sm line-clamp-2 mb-3",
              theme === "dark" ? "text-[#D4C5B9]" : "text-gray-600",
            )}
          >
            {product.description}
          </p>
        )}

        {/* Product Details */}
        <div className="flex justify-between items-center mb-4">
          {/* Price */}
          <div className="text-2xl font-bold text-pink-600">
            ₹{product.price}
          </div>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <span
              className={classNames(
                "text-xs font-semibold px-2 py-1 rounded-full",
                product.stock > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800",
              )}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={loading || product.stock === 0}
          className={classNames(
            "w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2",
            product.stock === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : theme === "dark"
                ? "bg-[#B97A6A] text-[#E5D3C5] hover:bg-[#9D6A5A]"
                : "bg-pink-600 text-white hover:bg-pink-700",
          )}
        >
          {loading ? "🔄" : "🛒"} {loading ? "Adding..." : "Add to Cart"}
        </button>

        {/* Feedback Message */}
        {message && (
          <p
            className={classNames(
              "mt-2 text-center text-sm font-semibold",
              message.includes("✓") ? "text-green-600" : "text-red-600",
            )}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default ProductCard;
