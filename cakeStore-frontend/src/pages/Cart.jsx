import { useEffect, useState, useContext } from "react";
import { getCart, updateCart, removeFromCart } from "../api/cart.api";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const { refreshUser } = useContext(AuthContext);
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
      refreshUser(); // Update global badge
    } catch (err) {
      setError("Failed to update quantity");
      console.error("Update cart error:", err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      fetchCart();
      refreshUser(); // Update global badge
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
        "min-h-screen pb-12 transition-colors duration-500",
        theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-[#FFF9F9] text-slate-800"
      )}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <h2 className={classNames(
            "text-3xl font-black tracking-tight",
            theme === "dark" ? "text-white" : "text-slate-900"
          )}>
            Shopping Cart
          </h2>
        </div>

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
          <div className={classNames(
            "rounded-3xl p-16 text-center border-2 border-dashed transition-colors",
            theme === "dark" ? "bg-slate-900/50 border-slate-800" : "bg-theme-cream-solid border-rose-100"
          )}>
            <div className="mx-auto w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
               <ShoppingBag className="h-10 w-10 text-rose-500 opacity-50" />
            </div>
            <p className="text-2xl font-bold mb-2">Your cart is empty</p>
            <p className={classNames("mb-8 max-w-xs mx-auto", theme === "dark" ? "text-slate-400" : "text-slate-500")}>
              Looks like you haven't added any delicious cakes to your cart yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 rounded-xl font-bold bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/25 flex items-center gap-2 mx-auto"
            >
              Start Shopping <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-5 mb-10">
              {cart.map((item) => (
                <div
                  key={item.productId._id}
                  className={classNames(
                    "group relative rounded-2xl p-5 transition-all duration-300 border flex flex-col sm:flex-row sm:items-center gap-6",
                    theme === "dark"
                      ? "bg-slate-900 border-slate-800 hover:border-rose-500/30"
                      : "bg-theme-cream-solid border-rose-100 hover:border-rose-300 shadow-sm"
                  )}
                >
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-extrabold mb-1 group-hover:text-rose-500 transition-colors uppercase tracking-tight">
                      {item.productId.name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <span className="text-rose-500 font-black text-xl">₹{item.productId.price}</span>
                       <span className="text-xs font-bold uppercase tracking-widest opacity-40">Per Piece</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div
                    className={classNames(
                      "flex items-center gap-1 rounded-xl p-1.5 border shadow-inner",
                      theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-gray-50 border-rose-100"
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
                        "w-9 h-9 flex items-center justify-center rounded-lg transition-all",
                        theme === "dark"
                          ? "text-slate-400 hover:bg-slate-800 hover:text-rose-400"
                          : "text-slate-500 hover:bg-rose-100 hover:text-rose-600",
                      )}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-black text-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantity(item.productId._id, item.quantity + 1)
                      }
                      className={classNames(
                        "w-9 h-9 flex items-center justify-center rounded-lg transition-all",
                        theme === "dark"
                          ? "text-slate-400 hover:bg-slate-800 hover:text-rose-400"
                          : "text-slate-500 hover:bg-rose-100 hover:text-rose-600",
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right sm:min-w-[120px]">
                    <p className={classNames(
                      "text-[10px] font-bold uppercase tracking-[2px] mb-1 opacity-50",
                      theme === "dark" ? "text-slate-400" : "text-slate-600"
                    )}>
                      Item Total
                    </p>
                    <p className="text-2xl font-black text-rose-500">
                      ₹{(item.productId.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.productId._id)}
                    className="group/remove p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    title="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary Card */}
            <div className={classNames(
              "rounded-3xl p-8 border backdrop-blur-md relative overflow-hidden",
              theme === "dark"
                ? "bg-slate-900/80 border-slate-800"
                : "bg-theme-cream-solid border-rose-100 shadow-xl shadow-rose-500/5"
            )}>
               {/* Background Glow */}
               <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none" />
               
               <h3 className="text-xl font-black mb-8 flex items-center gap-2">
                 Order Summary
               </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center opacity-70">
                  <span className="font-bold text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">Subtotal</span>
                  <span className="text-lg font-bold">₹{total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                  <span className="font-bold text-sm uppercase tracking-widest text-emerald-600">Shipping</span>
                  <span className="text-sm font-black text-emerald-600 uppercase">Free</span>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-[3px] opacity-40 mb-1">Total Amount</span>
                     <span className="text-4xl font-black text-rose-500">
                        ₹{total.toFixed(2)}
                     </span>
                  </div>
                  
                  <button
                    onClick={() => navigate("/checkout")}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-rose-500/25 flex items-center gap-3 transform active:scale-[0.98]"
                  >
                    Checkout <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => navigate("/")}
                  className={classNames(
                    "text-xs font-bold uppercase tracking-widest hover:text-rose-500 transition-colors flex items-center gap-2",
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  ← Back to Shopping
                </button>
              </div>
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
