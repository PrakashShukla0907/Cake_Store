import { useState, useContext } from "react";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { addToCart } from "../api/product.api";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Sparkles, Edit3, Loader2, Check } from "lucide-react";

const ProductCard = ({ product }) => {
  const { theme } = useTheme();
  const { user, refreshUser } = useContext(AuthContext);
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
      await refreshUser(); // Update global state
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
        "rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col h-full border",
        theme === "dark"
          ? "bg-slate-800 border-slate-700 text-slate-200"
          : "bg-theme-cream-solid border-gray-100 text-slate-800",
      )}
    >
      {/* Product Image */}
      <div
        className={classNames(
          "h-56 w-full overflow-hidden relative group flex items-center justify-center",
          theme === "dark"
            ? "bg-slate-900"
            : "bg-slate-100",
        )}
      >
        {product.image ? (
          <>
            {/* Blurred Backdrop */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={product.image}
                alt=""
                className="w-full h-full object-cover scale-110 opacity-30 blur-2xl saturate-150"
                aria-hidden="true"
              />
            </div>
            {/* Foreground Crisp Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-lg p-2"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-50 relative z-10">
            🍰
          </div>
        )}
        {/* Subtle overlay gradient for image depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Product Name */}
        <h3 className="font-extrabold text-xl line-clamp-2 mb-2 tracking-tight">{product.name}</h3>

        {/* Product Description */}
        {product.description && (
          <p
            className={classNames(
              "text-sm line-clamp-2 mb-4 flex-grow font-medium",
              theme === "dark" ? "text-slate-400" : "text-slate-500",
            )}
          >
            {product.description}
          </p>
        )}

        {/* Product Details Wrapper to push to bottom */}
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-5">
            {/* Price */}
            <div className="text-2xl font-black bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
              ₹{product.price}
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <span
                className={classNames(
                  "text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border",
                  product.stock > 0
                    ? theme === "dark" ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-50 text-green-700 border-green-200"
                    : theme === "dark" ? "bg-red-900/30 text-red-400 border-red-800" : "bg-red-50 text-red-700 border-red-200",
                )}
              >
                {product.stock > 0 ? "In Stock" : "Sold Out"}
              </span>
            )}
          </div>

          {/* Action Button (Contextual) */}
          {user?.role === "admin" ? (
            <button
              onClick={() => navigate("/admin/products")}
              className={classNames(
                "w-full py-3 px-4 rounded-xl font-black transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-xl transform active:scale-[0.98] border text-sm uppercase tracking-widest",
                theme === "dark" 
                  ? "bg-slate-700 hover:bg-slate-600 border-slate-600 text-white" 
                  : "bg-slate-800 hover:bg-slate-900 border-slate-700 text-white"
              )}
            >
              <Edit3 className="h-4 w-4" /> Edit Product
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={loading || product.stock === 0}
              className={classNames(
                "w-full py-3.5 px-4 rounded-xl font-black transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform active:scale-[0.98] text-sm uppercase tracking-widest",
                product.stock === 0
                  ? "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                  : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25 border border-rose-400/30",
              )}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <ShoppingCart className="h-4 w-4" />} 
              {loading ? "Adding..." : "Add to Cart"}
            </button>
          )}

          {/* Feedback Message */}
          {message && (
            <p
              className={classNames(
                "mt-3 text-center text-sm font-bold animate-pulse",
                message.includes("✓") 
                  ? theme === "dark" ? "text-green-400" : "text-green-600"
                  : theme === "dark" ? "text-red-400" : "text-red-600",
              )}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default ProductCard;
