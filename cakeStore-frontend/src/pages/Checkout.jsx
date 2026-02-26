import { useState, useEffect } from "react";
import { placeOrder } from "../api/order.api";
import { getCart } from "../api/cart.api";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Hash
} from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.cart || []);
    } catch (err) {
      setError("Failed to load cart");
      console.error("Fetch cart error:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const address = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.postalCode}`;

      await placeOrder({
        address,
        // lat/lng are required by backend but not collected here yet, 
        // passing 0 for now or I will update backend to make them optional
        lat: 0,
        lng: 0,
        paymentMethod: "Cash on Delivery"
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
      console.error("Place order error:", err);
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0,
  );

  const isFormValid =
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.address.trim() &&
    formData.city.trim() &&
    formData.state.trim() &&
    formData.postalCode.trim();

  return (
    <div
      className={classNames(
        "min-h-screen pb-16 transition-colors duration-500",
        theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-[#FFF9F9] text-slate-800"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20">
            <CreditCard className="h-6 w-6" />
          </div>
          <h2 className={classNames(
            "text-3xl font-black tracking-tight",
            theme === "dark" ? "text-white" : "text-slate-900"
          )}>
            Checkout
          </h2>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✓ Order placed successfully! Redirecting to orders...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <div
              className={classNames(
                "rounded-3xl p-8 border backdrop-blur-md relative overflow-hidden",
                theme === "dark"
                  ? "bg-slate-900/80 border-slate-800"
                  : "bg-white border-rose-100 shadow-xl shadow-rose-500/5",
              )}
            >
              <div className="flex items-center gap-2 mb-8">
                 <Truck className="h-5 w-5 text-rose-500" />
                 <h3 className="text-xl font-black uppercase tracking-tight">Shipping Information</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                      <User className="h-3 w-3" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className={classNames(
                        "w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all font-bold",
                        theme === "dark"
                          ? "bg-slate-950 border-slate-800 text-white focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 placeholder:text-slate-700"
                          : "bg-gray-50 border-rose-50 text-slate-900 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-500/5 placeholder:text-slate-300",
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                      <Mail className="h-3 w-3" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={classNames(
                        "w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all font-bold",
                        theme === "dark"
                          ? "bg-slate-950 border-slate-800 text-white focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 placeholder:text-slate-700"
                          : "bg-gray-50 border-rose-50 text-slate-900 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-500/5 placeholder:text-slate-300",
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                    <Phone className="h-3 w-3" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your 10-digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={classNames(
                      "w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all font-bold",
                      theme === "dark"
                        ? "bg-slate-950 border-slate-800 text-white focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 placeholder:text-slate-700"
                        : "bg-gray-50 border-rose-50 text-slate-900 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-500/5 placeholder:text-slate-300",
                    )}
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                    <MapPin className="h-3 w-3" /> Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your complete street address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className={classNames(
                      "w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all font-bold",
                      theme === "dark"
                        ? "bg-slate-950 border-slate-800 text-white focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 placeholder:text-slate-700"
                        : "bg-gray-50 border-rose-50 text-slate-900 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-500/5 placeholder:text-slate-300",
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className={classNames(
                        "w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all font-bold",
                        theme === "dark"
                          ? "bg-slate-950 border-slate-800 text-white focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 placeholder:text-slate-700"
                          : "bg-gray-50 border-rose-50 text-slate-900 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-500/5 placeholder:text-slate-300",
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Enter your state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className={classNames(
                        "w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all font-bold",
                        theme === "dark"
                          ? "bg-slate-950 border-slate-800 text-white focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 placeholder:text-slate-700"
                          : "bg-gray-50 border-rose-50 text-slate-900 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-500/5 placeholder:text-slate-300",
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-60 ml-1">
                      <Hash className="h-3 w-3" /> ZIP Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Enter six digit ZIP code"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className={classNames(
                        "w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all font-bold",
                        theme === "dark"
                          ? "bg-slate-950 border-slate-800 text-white focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 placeholder:text-slate-700"
                          : "bg-gray-50 border-rose-50 text-slate-900 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-500/5 placeholder:text-slate-300",
                      )}
                    />
                  </div>
                </div>

                <div
                  className={classNames(
                    "p-5 rounded-2xl border flex flex-col gap-2",
                    theme === "dark"
                      ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
                      : "bg-emerald-50 border-emerald-100 text-emerald-700",
                  )}
                >
                  <p className="text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Your information is protected with SSL encryption
                  </p>
                  <p className="text-xs font-bold flex items-center gap-2">
                    <Truck className="h-4 w-4" /> We offer super fast free delivery on all orders
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={classNames(
                    "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 transform active:scale-[0.98]",
                    isFormValid && !loading
                      ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/25 cursor-pointer"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed",
                  )}
                >
                  {loading ? (
                    <><div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" /> Processing...</>
                  ) : (
                    <><CheckCircle2 className="h-5 w-5" /> Place Order</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */} 
          <div className="lg:col-span-1">
            <div
              className={classNames(
                "rounded-3xl p-8 sticky top-24 border backdrop-blur-md relative overflow-hidden",
                theme === "dark"
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-rose-100 shadow-2xl shadow-rose-500/5",
              )}
            >
               {/* Background Glow */}
               <div className="absolute -top-24 -right-24 w-40 h-40 bg-rose-500/10 blur-[60px] rounded-full pointer-events-none" />

               <div className="flex items-center gap-2 mb-8">
                  <ShoppingBag className="h-5 w-5 text-rose-500" />
                  <h3 className="text-xl font-black uppercase tracking-tight">Order Summary</h3>
               </div>

              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
                {cart.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex justify-between items-start gap-4 pb-4 border-b border-rose-50 dark:border-slate-800 group"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-sm group-hover:text-rose-500 transition-colors">{item.productId.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">
                        Qty: {item.quantity} × ₹{item.productId.price}
                      </p>
                    </div>
                    <p className="font-black text-rose-500 text-sm">
                      ₹{(item.productId.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-xs font-black uppercase tracking-widest">Subtotal</span>
                  <span className="text-sm font-bold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Shipping</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Free</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-[3px] opacity-40 mb-1">Total Amount</span>
                     <span className="text-3xl font-black text-rose-500">
                        ₹{total.toFixed(2)}
                     </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold opacity-50 justify-center">
                     <Info className="h-3 w-3" /> All taxes included
                  </div>
                  <button 
                    onClick={() => navigate("/cart")}
                    className="text-xs font-bold uppercase tracking-widest text-center hover:text-rose-500 transition-colors opacity-60 hover:opacity-100"
                  >
                    ← Back to Cart
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default Checkout;
