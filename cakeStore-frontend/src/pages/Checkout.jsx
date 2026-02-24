import { useState, useEffect } from "react";
import { placeOrder } from "../api/order.api";
import { getCart } from "../api/cart.api";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

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
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.postalCode}`;

      await placeOrder({
        shippingAddress,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/my-orders");
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
          🧾 Checkout
        </h2>

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

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <div
              className={classNames(
                "rounded-lg p-8 mb-8",
                theme === "dark"
                  ? "bg-[#3A2A25]"
                  : "bg-white border border-gray-200",
              )}
            >
              <h3 className="text-2xl font-bold mb-6">Shipping Information</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className={classNames(
                        "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                        theme === "dark"
                          ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5]"
                          : "bg-gray-50 border-gray-300 text-gray-900",
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={classNames(
                        "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                        theme === "dark"
                          ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5]"
                          : "bg-gray-50 border-gray-300 text-gray-900",
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="9xxxxxxxxx"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={classNames(
                      "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                      theme === "dark"
                        ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5]"
                        : "bg-gray-50 border-gray-300 text-gray-900",
                    )}
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className={classNames(
                      "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                      theme === "dark"
                        ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5]"
                        : "bg-gray-50 border-gray-300 text-gray-900",
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className={classNames(
                        "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                        theme === "dark"
                          ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5]"
                          : "bg-gray-50 border-gray-300 text-gray-900",
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className={classNames(
                        "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                        theme === "dark"
                          ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5]"
                          : "bg-gray-50 border-gray-300 text-gray-900",
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="10001"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className={classNames(
                        "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                        theme === "dark"
                          ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5]"
                          : "bg-gray-50 border-gray-300 text-gray-900",
                      )}
                    />
                  </div>
                </div>

                <div
                  className={classNames(
                    "p-4 rounded-lg border-l-4",
                    theme === "dark"
                      ? "bg-[#2B1B17] border-[#B97A6A]"
                      : "bg-blue-50 border-blue-500",
                  )}
                >
                  <p className="text-sm">
                    ✓ Your information is safe and secure
                  </p>
                  <p className="text-sm">
                    ✓ We offer free delivery on all orders
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={classNames(
                    "w-full py-3 rounded-lg font-bold text-lg transition",
                    isFormValid && !loading
                      ? theme === "dark"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed",
                  )}
                >
                  {loading ? "🔄 Processing..." : "✓ Place Order"}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */} 
          <div>
            <div
              className={classNames(
                "rounded-lg p-8 sticky top-20",
                theme === "dark"
                  ? "bg-[#3A2A25]"
                  : "bg-white border border-gray-200",
              )}
            >
              <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex justify-between text-sm pb-3 border-b opacity-75"
                  >
                    <div>
                      <p className="font-semibold">{item.productId.name}</p>
                      <p
                        className={
                          theme === "dark" ? "text-[#D4C5B9]" : "text-gray-600"
                        }
                      >
                        ✕ {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-pink-600">
                      ₹{(item.productId.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pb-4 border-b">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
              </div>

              <div className="flex justify-between mt-4 text-2xl font-bold">
                <span>Total</span>
                <span className="text-pink-600">₹{total.toFixed(2)}</span>
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
