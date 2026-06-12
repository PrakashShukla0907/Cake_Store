import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { addToCart } from "../api/product.api";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Edit3, Loader2 } from "lucide-react";

const ProductCard = ({ product }) => {
  const { user, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    if (!user) { navigate("/login"); return; }
    setLoading(true);
    setMessage("");
    try {
      await addToCart({ productId: product._id, quantity: 1 });
      await refreshUser();
      setMessage("Added to cart");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage("Failed to add");
      console.error("Add to cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">

      {/* Product Image */}
      <div className="h-52 w-full overflow-hidden relative bg-gray-50 flex items-center justify-center group">
        {product.image ? (
          <>
            {/* blurred backdrop */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img src={product.image} alt="" className="w-full h-full object-cover scale-110 opacity-20 blur-2xl" aria-hidden="true" />
            </div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain relative z-10 transition-transform duration-400 group-hover:scale-105 p-2"
            />
          </>
        ) : (
          <div className="text-5xl opacity-30">🍰</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-black text-base text-black line-clamp-2 mb-1 tracking-tight leading-tight">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 font-medium leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto">
          {/* Price + Stock */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-black text-black">₹{product.price}</span>
            {product.stock !== undefined && (
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                product.stock > 0
                  ? "bg-white text-black border-black"
                  : "bg-gray-100 text-gray-400 border-gray-200"
              }`}>
                {product.stock > 0 ? "In Stock" : "Sold Out"}
              </span>
            )}
          </div>

          {/* Action Button */}
          {user?.role === "admin" ? (
            <button
              onClick={() => navigate("/admin/products")}
              className="w-full py-2.5 px-4 rounded-md font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-white border border-black text-black hover:bg-black hover:text-white transition-all"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Product
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={loading || product.stock === 0}
              className={`w-full py-2.5 px-4 rounded-md font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                product.stock === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-black text-white border border-black hover:bg-gray-800 active:bg-black"
              }`}
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShoppingCart className="h-3.5 w-3.5" />}
              {loading ? "Adding..." : "Add to Cart"}
            </button>
          )}

          {/* Feedback */}
          {message && (
            <p className="mt-2 text-center text-xs font-bold text-black opacity-70">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
