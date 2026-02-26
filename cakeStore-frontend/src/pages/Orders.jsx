import { useEffect, useState } from "react";
import { getMyOrders } from "../api/order.api";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  MapPin, 
  Calendar, 
  CreditCard,
  ChefHat,
  ShoppingBag,
  ArrowLeft,
  X,
  User,
  Mail,
  Printer
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMyOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      setError("Failed to fetch your orders");
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
          icon: <Clock className="h-4 w-4" />,
          label: "Pending"
        };
      case "baking":
        return {
          color: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
          icon: <ChefHat className="h-4 w-4" />,
          label: "Baking"
        };
      case "out for delivery":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
          icon: <Truck className="h-4 w-4" />,
          label: "Out for Delivery"
        };
      case "delivered":
        return {
          color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
          icon: <CheckCircle2 className="h-4 w-4" />,
          label: "Delivered"
        };
      case "cancelled":
        return {
          color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
          icon: <XCircle className="h-4 w-4" />,
          label: "Cancelled"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
          icon: <Package className="h-4 w-4" />,
          label: status
        };
    }
  };

  return (
    <div
      className={classNames(
        "min-h-screen pb-20 transition-colors duration-500",
        theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-[#FFF9F9] text-slate-800"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20">
              <Package className="h-6 w-6" />
            </div>
            <h2 className={classNames(
              "text-3xl font-black tracking-tight",
              theme === "dark" ? "text-white" : "text-slate-900"
            )}>
              My Orders
            </h2>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-rose-500 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-6 py-4 rounded-2xl mb-8 font-bold flex items-center gap-3">
            <XCircle className="h-5 w-5" /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
             <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
             <p className="text-sm font-black uppercase tracking-widest opacity-40">Loading your history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div
            className={classNames(
              "rounded-3xl p-16 text-center border-2 border-dashed flex flex-col items-center gap-6",
              theme === "dark"
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-rose-100 shadow-xl shadow-rose-500/5",
            )}
          >
            <div className="p-6 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500">
               <ShoppingBag className="h-12 w-12" />
            </div>
            <div>
              <p className="text-2xl font-black mb-2 italic">No orders yet?</p>
              <p className="text-sm font-medium opacity-60 max-w-xs mx-auto">
                Your delicious cake journey hasn't started yet. Let's fix that!
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/25 active:scale-95"
            >
              Explore Cakes
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const status = getStatusConfig(order.orderStatus);
              return (
                <div
                  key={order._id}
                  className={classNames(
                    "rounded-3xl border backdrop-blur-md relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/5",
                    theme === "dark"
                      ? "bg-slate-900/80 border-slate-800"
                      : "bg-white border-rose-100",
                  )}
                >
                  {/* Subtle Accent Glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-rose-500/10 transition-colors" />

                  {/* Order Header Card */}
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                           <Hash className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40 mb-1">Order Identifier</p>
                           <p className="font-mono font-bold text-lg">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                           <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40 mb-1">Placed On</p>
                           <p className="font-bold">
                             {new Date(order.createdAt).toLocaleDateString("en-IN", {
                               year: "numeric",
                               month: "short",
                               day: "numeric",
                             })}
                           </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all">
                        <span className={classNames(
                          "flex items-center gap-2 text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full border shadow-sm",
                          status.color
                        )}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                      {/* Shipping & Payment Info */}
                      <div className="md:col-span-8 space-y-6">
                        <div className="flex items-start gap-4">
                           <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 mt-1">
                              <MapPin className="h-4 w-4" />
                           </div>
                           <div className="flex-1">
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Delivering To</p>
                              <p className="text-sm font-bold leading-relaxed max-w-md">
                                {order.deliveryLocation?.address || "Address not available"}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-start gap-4">
                           <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 mt-1">
                              <CreditCard className="h-4 w-4" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Payment Method</p>
                              <p className="text-sm font-bold">{order.paymentMethod || "Cash on Delivery"}</p>
                           </div>
                        </div>

                        {/* Order Items List */}
                        <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800/50">
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 flex items-center gap-2">
                              <ShoppingBag className="h-3 w-3" /> Bundled Delights
                           </p>
                           <div className="grid sm:grid-cols-2 gap-4">
                             {order.items?.map((item, idx) => (
                               <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                 <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-rose-500 font-black shadow-sm border border-slate-100 dark:border-slate-600">
                                   {item.quantity}
                                 </div>
                                 <div className="min-w-0">
                                   <p className="text-sm font-bold truncate">{item.product?.name || "Premium Cake"}</p>
                                   <p className="text-[10px] font-black uppercase opacity-40">₹{item.product?.price || 0} per item</p>
                                 </div>
                               </div>
                             ))}
                           </div>
                        </div>
                      </div>

                      {/* Financials Card */}
                      <div className="md:col-span-4 h-full">
                        <div className={classNames(
                          "h-full p-8 rounded-3xl flex flex-col justify-between border relative overflow-hidden",
                          theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-rose-50/30 border-rose-100"
                        )}>
                           <div className="relative z-10">
                              <p className="text-[10px] font-black uppercase tracking-[3px] opacity-40 mb-2">Grand Total</p>
                              <p className="text-4xl font-black text-rose-500">
                                ₹{order.totalAmount?.toFixed(2) || "0.00"}
                              </p>
                              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit">
                                 <CheckCircle2 className="h-3 w-3" /> Price Incls. Taxes
                              </div>
                           </div>
                           
                           <button 
                             onClick={() => {
                               setSelectedOrder(order);
                               setShowReceipt(true);
                             }}
                             className="mt-8 w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-200 dark:border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                           >
                              <Printer className="h-3.5 w-3.5" /> Order Receipt
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) }
      </div>

      {/* Receipt Modal */}
      {showReceipt && selectedOrder && (
        <OrderReceiptModal 
          order={selectedOrder} 
          onClose={() => setShowReceipt(false)} 
          theme={theme}
          getStatusConfig={getStatusConfig}
        />
      )}
    </div>
  );
};

const OrderReceiptModal = ({ order, onClose, theme, getStatusConfig }) => {
  const config = getStatusConfig(order.orderStatus);
  
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />

        <div className={classNames(
          "relative transform overflow-hidden rounded-3xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl animate-in fade-in zoom-in duration-300",
          theme === "dark" ? "bg-slate-900 border border-slate-800" : "bg-white"
        )}>
          {/* Print Action */}
          <div className="absolute top-4 right-14">
             <button 
               onClick={() => window.print()}
               className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors"
               title="Print Receipt"
             >
                <Printer className="h-4 w-4" />
             </button>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-8 space-y-8 print:p-0">
            {/* Header / Brand */}
            <div className="text-center pb-8 border-b border-dashed border-slate-200 dark:border-slate-800">
               <div className="inline-flex p-3 rounded-2xl bg-rose-500 text-white mb-4">
                  <Package className="h-6 w-6" />
               </div>
               <h3 className={classNames("text-2xl font-black italic", theme === "dark" ? "text-white" : "text-rose-500")}>
                 GOPAL BAKERS
               </h3>
               <p className="text-[10px] font-black uppercase tracking-[4px] opacity-40 mt-1">Official Purchase Receipt</p>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-2 gap-6">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Receipt Number</p>
                  <p className="font-mono font-bold text-sm">#{order._id.toUpperCase()}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Date Issued</p>
                  <p className="font-bold text-sm">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
               </div>
            </div>

            {/* Status & Payment Summary */}
            <div className={classNames(
              "p-5 rounded-3xl border flex flex-col sm:flex-row justify-between gap-4",
              theme === "dark" ? "bg-slate-800/40 border-slate-700" : "bg-gray-50 border-gray-100"
            )}>
              <div className="flex items-center gap-3">
                 <div className={classNames("p-2 rounded-xl", config.color.split(' ')[0], config.color.split(' ')[1])}>
                    {config.icon}
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Current Status</p>
                    <p className="text-xs font-bold">{config.label}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500">
                    <CreditCard className="h-4 w-4" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Payment Details</p>
                    <p className="text-xs font-bold">{order.paymentMethod || "COD"}</p>
                 </div>
              </div>
            </div>

            {/* Itemized List */}
            <div className="space-y-4">
               <p className="text-[10px] font-black uppercase tracking-widest opacity-40 border-b border-slate-100 dark:border-slate-800 pb-2">Itemized Summary</p>
               <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                       <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black">
                            {item.quantity}
                          </span>
                          <span className="font-bold">{item.product?.name || "Premium Cake"}</span>
                       </div>
                       <span className="font-black">₹{((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Total Section */}
            <div className={classNames(
              "pt-6 border-t-2 border-dashed border-slate-200 dark:border-slate-800 flex justify-between items-end",
            )}>
               <div>
                  <p className="text-[10px] font-black opacity-40">Thank you for choosing Cake Store!</p>
                  <p className="text-[9px] font-medium opacity-30 mt-1 italic">This is a computer generated receipt.</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Grand Total</p>
                  <p className="text-3xl font-black text-rose-500 italic">₹{order.totalAmount?.toFixed(2)}</p>
               </div>
            </div>
          </div>
          
          <div className="p-4 flex gap-3 print:hidden">
            <button
              onClick={onClose}
              className={classNames(
                "flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                theme === "dark" ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-900 text-white hover:bg-slate-800"
              )}
            >
              Done Viewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Hash = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default Orders;
