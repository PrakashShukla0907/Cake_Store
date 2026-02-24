import { useEffect, useState } from "react";
import { getCart, updateCart, removeFromCart } from "../api/cart.api";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCart();
      setCart(res.data.cart || []);
    } catch (err) {
      setError("Failed to load cart");
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantity = async (productId, quantity) => {
    try {
      await updateCart({ productId, quantity });
      fetchCart();
    } catch (err) {
      setError("Failed to update quantity");
      console.error("Update cart error:", err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      fetchCart();
    } catch (err) {
      setError("Failed to remove item");
      console.error("Remove cart error:", err);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0,
  );

  return (
    <div
      className={classNames(
        "min-h-screen pb-12",
        theme === "dark"
          ? "bg-[#2B1B17] text-[#E5D3C5]"
          : "bg-[#F9F1E7] text-[#4A3728]",
      )}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2
          className={classNames(
            "text-3xl sm:text-4xl font-bold mb-8",
            theme === "dark" ? "text-[#B97A6A]" : "text-[#4A3728]",
          )}
        >
          🛒 Shopping Cart
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <p className="text-lg opacity-70">Loading your cart... 🔄</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-2xl mb-6">Your cart is empty 😢</p>
            <button
              onClick={() => navigate("/")}
              className={classNames(
                "px-6 py-3 rounded-lg font-semibold transition inline-block",
                theme === "dark"
                  ? "bg-[#B97A6A] text-[#E5D3C5] hover:bg-[#9D6A5A]"
                  : "bg-pink-600 text-white hover:bg-pink-700",
              )}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div
                  key={item.productId._id}
                  className={classNames(
                    "rounded-lg p-6 hover:shadow-lg transition flex flex-col sm:flex-row sm:items-center gap-4",
                    theme === "dark"
                      ? "bg-[#3A2A25]"
                      : "bg-white border border-gray-200",
                  )}
                >
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">
                      {item.productId.name}
                    </h3>
                    <p className="text-pink-600 font-semibold text-lg">
                      ₹{item.productId.price}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div
                    className={classNames(
                      "flex items-center gap-3 rounded-lg p-2",
                      theme === "dark" ? "bg-[#2B1B17]" : "bg-gray-100",
                    )}
                  >
                    <button
                      onClick={() =>
                        handleQuantity(
                          item.productId._id,
                          Math.max(1, item.quantity - 1),
                        )
                      }
                      className={classNames(
                        "w-8 h-8 flex items-center justify-center rounded font-bold transition",
                        theme === "dark"
                          ? "hover:bg-[#4A3A35]"
                          : "hover:bg-gray-200",
                      )}
                    >
                      −
                    </button>

                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleQuantity(item.productId._id, item.quantity + 1)
                      }
                      className={classNames(
                        "w-8 h-8 flex items-center justify-center rounded font-bold transition",
                        theme === "dark"
                          ? "hover:bg-[#4A3A35]"
                          : "hover:bg-gray-200",
                      )}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right sm:min-w-24">
                    <p
                      className={classNames(
                        "text-sm mb-1",
                        theme === "dark" ? "text-[#D4C5B9]" : "text-gray-600",
                      )}
                    >
                      Subtotal
                    </p>
                    <p className="text-2xl font-bold text-pink-600">
                      ₹{(item.productId.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.productId._id)}
                    className="text-red-500 hover:text-red-700 font-semibold transition"
                  >
                    🗑️ Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div
              className={classNames(
                "rounded-lg p-8",
                theme === "dark"
                  ? "bg-[#3A2A25]"
                  : "bg-white border border-gray-200",
              )}
            >
              <div className="flex justify-between items-center mb-6 pb-6 border-b opacity-75">
                <span className="text-lg font-semibold">Subtotal:</span>
                <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center mb-6 pb-6 border-b opacity-75">
                <span className="text-lg font-semibold">Shipping:</span>
                <span className="text-xl font-bold text-green-600">Free</span>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-2xl font-bold">Total:</span>
                <span className="text-3xl font-bold text-pink-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className={classNames(
                  "w-full py-3 rounded-lg font-semibold text-lg transition",
                  theme === "dark"
                    ? "bg-[#B97A6A] text-[#E5D3C5] hover:bg-[#9D6A5A]"
                    : "bg-pink-600 text-white hover:bg-pink-700",
                )}
              >
                Proceed to Checkout →
              </button>

              <button
                onClick={() => navigate("/")}
                className={classNames(
                  "w-full mt-3 py-3 rounded-lg font-semibold transition",
                  theme === "dark"
                    ? "bg-[#2B1B17] text-[#E5D3C5] hover:bg-[#3A2A25]"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300",
                )}
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default Cart;
