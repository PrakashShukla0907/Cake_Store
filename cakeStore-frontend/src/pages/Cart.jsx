import { useEffect, useState, useContext } from "react";
import { getCart, updateCart, removeFromCart } from "../api/cart.api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    <div className="min-h-screen pb-12 bg-gray-50 text-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex items-center gap-3 mb-8 sm:mb-10">
          <div className="p-2 sm:p-3 rounded-md bg-black text-white shadow-sm border border-black">
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
            Shopping Cart
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 font-bold text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <p className="text-lg font-bold text-gray-500">Loading your cart... 🔄</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="rounded-md p-10 sm:p-16 text-center border-2 border-dashed border-gray-300 bg-white shadow-sm">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center mb-6 text-gray-400">
               <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <p className="text-xl sm:text-2xl font-black mb-2 text-black">Your cart is empty</p>
            <p className="mb-8 text-sm sm:text-base max-w-xs mx-auto font-medium text-gray-500">
              Looks like you haven't added any delicious cakes to your cart yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-md font-bold bg-black text-white hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mx-auto w-full sm:w-auto"
            >
              Start Shopping <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-5 mb-8 sm:mb-10">
              {cart.map((item) => (
                <div
                  key={item.productId._id}
                  className="group relative rounded-md p-4 sm:p-5 transition-all duration-300 border border-gray-200 bg-white hover:border-black flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 shadow-sm"
                >
                  {/* Remove Button - Top Right on Mobile, normal flow on Desktop */}
                  <button
                    onClick={() => handleRemove(item.productId._id)}
                    className="absolute top-4 right-4 sm:static sm:top-auto sm:right-auto p-2 sm:p-3 rounded-md bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all shadow-sm"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {/* Product Info */}
                  <div className="flex-1 pr-12 sm:pr-0">
                    <h3 className="text-base sm:text-lg font-black mb-1 group-hover:text-gray-700 transition-colors uppercase tracking-tight text-black line-clamp-2">
                      {item.productId.name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <span className="text-black font-black text-lg sm:text-xl">₹{item.productId.price}</span>
                       <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400">Per Piece</span>
                    </div>
                  </div>

                  {/* Mobile Separator / Container for Quantities */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-1 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-100 sm:border-0">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 shrink-0 bg-white border border-gray-200 rounded-md px-2 py-1">
                      <button
                        onClick={() => handleQuantity(item.productId._id, Math.max(1, item.quantity - 1))}
                        className="text-gray-400 hover:text-black transition-colors p-1"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <span className="font-black text-sm text-black min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantity(item.productId._id, item.quantity + 1)}
                        className="text-gray-400 hover:text-black transition-colors p-1"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right sm:min-w-[120px]">
                      <p className="text-[10px] font-black uppercase tracking-[2px] mb-0.5 sm:mb-1 text-gray-500">
                        Item Total
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-black">
                        ₹{(item.productId.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary Card */}
            <div className="rounded-md p-6 sm:p-8 border border-gray-200 bg-white relative overflow-hidden shadow-sm">
               <h3 className="text-xl font-black mb-6 sm:mb-8 flex items-center gap-2 text-black">
                 Order Summary
               </h3>

              <div className="space-y-4 mb-6 sm:mb-8">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="font-bold text-xs sm:text-sm uppercase tracking-widest">Subtotal</span>
                  <span className="text-base sm:text-lg font-bold text-black">₹{total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-md border border-gray-200">
                  <span className="font-black text-xs sm:text-sm uppercase tracking-widest text-black">Shipping</span>
                  <span className="text-xs sm:text-sm font-black text-green-600 uppercase bg-green-50 px-2 py-1 rounded-sm border border-green-200">Free</span>
                </div>

                <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
                  <div className="flex flex-col w-full sm:w-auto">
                     <span className="text-[10px] font-black uppercase tracking-[3px] text-gray-500 mb-1">Total Amount</span>
                     <span className="text-3xl sm:text-4xl font-black text-black">
                        ₹{total.toFixed(2)}
                     </span>
                  </div>
                  
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full sm:w-auto justify-center bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-md font-black text-sm uppercase tracking-widest transition-all shadow-sm flex items-center gap-3"
                  >
                    Checkout <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => navigate("/")}
                  className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors flex items-center gap-2"
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
}
