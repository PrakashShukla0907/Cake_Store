import { useState, useEffect } from "react";
import { placeOrder } from "../api/order.api";
import { getCart } from "../api/cart.api";
import { useNavigate } from "react-router-dom";
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
  Navigation,
  Home
} from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    altPhone: "", // Optional additional phone
    streetAddress: "",
    locality: "",
    landmark: "",
    lat: 0,
    lng: 0
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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use OpenStreetMap Nominatim API for reverse geocoding
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          if (data && data.address) {
            // Build a sensible locality/area name
            const area = [
               data.address.road, 
               data.address.neighbourhood,
               data.address.suburb,
               data.address.village
            ].filter(Boolean).join(", ");

            setFormData(prev => ({
              ...prev,
              locality: area || data.display_name.split(',')[0] || "",
              lat: latitude,
              lng: longitude
            }));
          }
        } catch (err) {
          console.error("Error fetching address:", err);
          setError("Could not auto-fill area. Please type it manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Please allow location access in your browser to use this feature.");
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Automatically combine and append Bhopal
      const landmarkText = formData.landmark.trim() ? `, Landmark: ${formData.landmark.trim()}` : "";
      const phoneText = formData.altPhone.trim() ? ` (Alt Phone: ${formData.altPhone.trim()})` : "";
      const fullAddress = `${formData.streetAddress}, ${formData.locality}${landmarkText}, Bhopal, Madhya Pradesh${phoneText}`;

      await placeOrder({
        address: fullAddress,
        lat: formData.lat,
        lng: formData.lng,
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

  const isAltPhoneValid = formData.altPhone.trim() === "" || /^[0-9]{10}$/.test(formData.altPhone.trim());

  const isFormValid =
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.streetAddress.trim() &&
    formData.locality.trim() &&
    isAltPhoneValid;

  return (
    <div className="min-h-screen pb-16 bg-gray-50 text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 rounded-md bg-black text-white shadow-sm border border-black">
            <CreditCard className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-black">
            Checkout
          </h2>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 font-bold text-sm">
            ✓ Order placed successfully! Redirecting to orders...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 font-bold text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-md p-8 border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-8 text-black">
                 <Truck className="h-5 w-5" />
                 <h3 className="text-xl font-black uppercase tracking-tight">Shipping Information</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
                      <User className="h-3 w-3" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 rounded-md border border-gray-200 outline-none transition-all font-bold bg-white text-black focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
                      <Mail className="h-3 w-3" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 rounded-md border border-gray-200 outline-none transition-all font-bold bg-white text-black focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
                    <Phone className="h-3 w-3" /> Additional Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="altPhone"
                    value={formData.altPhone}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-md border border-gray-200 outline-none transition-all font-bold bg-white text-black focus:border-black focus:ring-1 focus:ring-black"
                  />
                  {!isAltPhoneValid && formData.altPhone.trim() !== "" && (
                     <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">Must be exactly 10 digits.</p>
                  )}
                  <p className="text-[10px] font-bold text-gray-400 mt-1 ml-1">
                    Your registered mobile number is already linked to this order automatically.
                  </p>
                </div>

                {/* Address Section */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
                        <MapPin className="h-3 w-3" /> Area / Locality
                      </label>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={isLocating}
                        className="flex items-center justify-center gap-2 text-xs font-bold bg-gray-50 hover:bg-gray-100 border border-gray-200 text-black px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                      >
                        {isLocating ? (
                          <><div className="animate-spin h-3 w-3 border-2 border-black/30 border-t-black rounded-full" /> Locating...</>
                        ) : (
                          <><Navigation className="h-3 w-3" /> Auto-detect Area</>
                        )}
                      </button>
                    </div>
                    <input
                      type="text"
                      name="locality"
                      value={formData.locality}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 rounded-md border border-gray-200 outline-none transition-all font-bold bg-white text-black focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
                      <Home className="h-3 w-3" /> House No. & Street Address
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 rounded-md border border-gray-200 outline-none transition-all font-bold bg-white text-black focus:border-black focus:ring-1 focus:ring-black"
                    />
                    <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">
                      * Required for accurate delivery in your area
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
                      <MapPin className="h-3 w-3" /> Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-md border border-gray-200 outline-none transition-all font-bold bg-white text-black focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="p-5 mt-6 rounded-md border border-green-200 flex flex-col gap-2 bg-green-50 text-green-700">
                  <p className="text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Your information is protected with SSL encryption
                  </p>
                  <p className="text-xs font-bold flex items-center gap-2">
                    <Truck className="h-4 w-4" /> Local delivery guaranteed across Bhopal
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`w-full py-4 rounded-md font-black text-sm uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-3 border mt-4 ${
                    isFormValid && !loading
                      ? "bg-black text-white hover:bg-gray-800 border-black cursor-pointer"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
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
            <div className="rounded-md p-8 sticky top-24 border border-gray-200 bg-white shadow-sm">
               <div className="flex items-center gap-2 mb-8 text-black">
                  <ShoppingBag className="h-5 w-5" />
                  <h3 className="text-xl font-black uppercase tracking-tight">Order Summary</h3>
               </div>

              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
                {cart.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex justify-between items-start gap-4 pb-4 border-b border-gray-100 group"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-sm text-black group-hover:text-gray-600 transition-colors">{item.productId.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                        Qty: {item.quantity} × ₹{item.productId.price}
                      </p>
                    </div>
                    <p className="font-black text-black text-sm">
                      ₹{(item.productId.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="text-xs font-black uppercase tracking-widest">Subtotal</span>
                  <span className="text-sm font-bold text-black">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md border border-gray-200">
                  <span className="text-[10px] font-black uppercase tracking-widest text-black">Shipping (Bhopal)</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2 py-0.5 rounded-sm border border-green-200">Free</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-[3px] text-gray-500 mb-1">Total Amount</span>
                     <span className="text-3xl font-black text-black">
                        ₹{total.toFixed(2)}
                     </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 justify-center">
                     <Info className="h-3 w-3" /> All taxes included
                  </div>
                  <button 
                    onClick={() => navigate("/cart")}
                    className="text-xs font-bold uppercase tracking-widest text-center text-gray-500 hover:text-black transition-colors"
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
}
