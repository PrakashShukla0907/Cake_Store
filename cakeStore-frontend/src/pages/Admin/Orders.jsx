import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Search, Eye, ChevronDown, Check, Clock, Truck, ChefHat, XCircle, Package, User, Mail, MapPin, Calendar, CreditCard } from "lucide-react";
import { getAdminOrders, updateAdminOrderStatus } from "../../api/admin.api";
import { useAdmin } from "../../context/AdminContext";
import ConfirmModal from "../../components/Admin/ConfirmModal"; // Using for consistency if needed, but we'll build a custom details modal here

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const STATUS_OPTIONS = ["Pending", "Baking", "Out for Delivery", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const { theme } = useTheme();
  const { refreshAdminState } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAdminOrders();
      const allOrders = data?.orders || data || [];
      const active = allOrders.filter(o => o.orderStatus !== "Delivered");
      setOrders(active);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await updateAdminOrderStatus(orderId, newStatus);
      // Optimistically update UI
      setOrders(orders.map(order => order._id === orderId ? { ...order, orderStatus: newStatus } : order));
      refreshAdminState(); // Update sidebar badges
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Delivered': 
        return {
          bg: theme === "dark" ? "bg-emerald-400/10" : "bg-emerald-50",
          text: theme === "dark" ? "text-emerald-400" : "text-emerald-700",
          ring: theme === "dark" ? "ring-emerald-400/20" : "ring-emerald-600/20",
          icon: <Check className="h-3 w-3" />,
          label: "Delivered"
        };
      case 'Cancelled': 
        return {
          bg: theme === "dark" ? "bg-rose-400/10" : "bg-rose-50",
          text: theme === "dark" ? "text-rose-400" : "text-rose-700",
          ring: theme === "dark" ? "ring-rose-400/20" : "ring-rose-600/20",
          icon: <XCircle className="h-3 w-3" />,
          label: "Cancelled"
        };
      case 'Pending': 
        return {
          bg: theme === "dark" ? "bg-amber-400/10" : "bg-amber-50",
          text: theme === "dark" ? "text-amber-400" : "text-amber-700",
          ring: theme === "dark" ? "ring-amber-400/20" : "ring-amber-600/20",
          icon: <Clock className="h-3 w-3" />,
          label: "Pending"
        };
      case 'Baking':
        return {
          bg: theme === "dark" ? "bg-rose-400/10" : "bg-rose-100/50",
          text: theme === "dark" ? "text-rose-300" : "text-rose-600",
          ring: theme === "dark" ? "ring-rose-400/20" : "ring-rose-600/10",
          icon: <ChefHat className="h-3 w-3" />,
          label: "Baking"
        };
      case 'Out for Delivery':
        return {
          bg: theme === "dark" ? "bg-blue-400/10" : "bg-blue-50",
          text: theme === "dark" ? "text-blue-400" : "text-blue-700",
          ring: theme === "dark" ? "ring-blue-400/20" : "ring-blue-600/20",
          icon: <Truck className="h-3 w-3" />,
          label: "Shipping"
        };
      default: 
        return {
          bg: theme === "dark" ? "bg-slate-400/10" : "bg-slate-50",
          text: theme === "dark" ? "text-slate-400" : "text-slate-700",
          ring: theme === "dark" ? "ring-slate-400/20" : "ring-slate-600/20",
          icon: <Package className="h-3 w-3" />,
          label: status
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={classNames(
            "text-2xl font-bold tracking-tight",
            theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text"
          )}>
            Orders {orders.length > 0 && `(${orders.length})`}
          </h2>
          <p className={classNames(
            "mt-1 text-sm",
            theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted"
          )}>
            View and update order processing statuses.
          </p>
        </div>

        {/* Revenue Summary Card */}
        {!loading && orders.length > 0 && (
          <div className={classNames(
            "px-6 py-3 rounded-2xl border shadow-lg flex items-center gap-4 transition-all duration-500 hover:scale-[1.02] backdrop-blur-md",
            theme === "dark" 
              ? "bg-rose-500/10 border-rose-500/20 shadow-rose-500/5 hover:border-rose-500/40" 
              : "bg-rose-50/80 border-rose-100 shadow-rose-500/10 hover:border-rose-200"
          )}>
            <div className={classNames(
              "p-2.5 rounded-xl transition-colors duration-300",
              theme === "dark" ? "bg-rose-500/20 text-rose-400 group-hover:bg-rose-500/30" : "bg-theme-cream-solid text-rose-600 shadow-sm"
            )}>
              <span className="text-xl font-bold">₹</span>
            </div>
            <div>
              <p className={classNames(
                "text-[10px] font-black uppercase tracking-widest opacity-60",
                theme === "dark" ? "text-rose-400 font-bold" : "text-rose-700"
              )}>
                Pending Revenue
              </p>
              <p className={classNames(
                "text-2xl font-black",
                theme === "dark" ? "text-rose-400" : "text-rose-700 font-black"
              )}>
                ₹{orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={classNames(
        "flex items-center justify-between p-4 rounded-xl border shadow-sm transition-colors duration-300",
        theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-theme-light-card border-theme-light-border"
      )}>
        <div className="relative max-w-sm w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className={classNames("h-5 w-5", theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted")} aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={classNames(
              "block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 shadow-sm ring-1 ring-inset sm:text-sm sm:leading-6 transition-all duration-300",
              theme === "dark" 
                ? "bg-theme-dark-bg text-theme-dark-text ring-theme-dark-border placeholder:text-theme-dark-muted focus:ring-2 focus:ring-theme-dark-primary" 
                : "bg-theme-light-bg text-theme-light-text ring-theme-light-border placeholder:text-theme-light-muted focus:ring-2 focus:ring-theme-light-primary"
            )}
            placeholder="Search by order ID, name or email..."
          />
        </div>
      </div>

      {loading ? (
        <div className={classNames(
          "flex flex-col items-center justify-center p-20 rounded-xl border shadow-sm transition-colors duration-300",
          theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-theme-light-card border-theme-light-border"
        )}>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent mb-4"></div>
          <p className={theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted"}>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className={classNames(
          "flex flex-col items-center justify-center p-20 rounded-3xl border shadow-sm transition-all duration-500 animate-in fade-in zoom-in h-[400px]",
          theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-theme-light-card border-theme-light-border"
        )}>
          <div className={classNames(
            "h-24 w-24 mb-6 rounded-full flex items-center justify-center shadow-inner transition-colors duration-500",
            theme === "dark" ? "bg-slate-800 text-rose-500/30" : "bg-rose-50 text-rose-600/20"
          )}>
            <Package className="h-10 w-10 animate-bounce duration-[3000ms]" />
          </div>
          <h3 className={classNames("text-xl font-black", theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text")}>
            No active orders
          </h3>
          <p className={classNames("mt-2 text-sm max-w-xs text-center font-medium", theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted")}>
            All caught up! New customer orders will appear here automatically as they arrive.
          </p>
        </div>
      ) : (
        <div className={classNames(
          "rounded-2xl shadow-sm border transition-colors duration-300",
          theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-theme-light-card border-theme-light-border"
        )}>
          <div className="overflow-x-auto pb-24">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className={classNames(
                theme === "dark" ? "bg-theme-dark-bg/50 text-theme-dark-muted" : "bg-theme-light-bg text-theme-light-muted"
              )}>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">Order ID</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Customer</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Items</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Qty</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Total</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                 {orders.filter(order => 
                    order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
                 ).map((order) => (
                  <tr key={order._id} className={classNames(
                    "transition-all duration-300 group relative",
                    theme === "dark" ? "hover:bg-theme-dark-bg/80 hover:z-[5]" : "hover:bg-theme-light-bg/80 hover:z-[5]"
                  )}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 sm:pl-6">
                      <div className={classNames("font-mono font-bold text-sm", theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text")}>
                        #{order._id.substring(order._id.length - 6).toUpperCase()}
                      </div>
                      <div className={classNames("text-[11px] mt-1 font-medium", theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted")}>
                        {new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                     <td className="whitespace-nowrap px-3 py-5">
                      <div className={classNames("font-black text-sm", theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text")}>
                        {order.user?.name || "Guest"}
                      </div>
                      <div className={classNames("text-[11px] mt-0.5 font-bold opacity-60", theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted")}>
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5">
                      <div className="flex flex-col min-w-0">
                        {order.items?.length > 0 && (
                          <>
                            <span className={classNames("text-[13px] font-black truncate max-w-[200px]", theme === "dark" ? "text-white" : "text-slate-900")}>
                              {order.items[0]?.product?.name || "Product"}
                            </span>
                            {order.items.length > 1 && (
                              <span className="text-[10px] opacity-70 font-black uppercase tracking-widest mt-0.5">
                                + {order.items.length - 1} more items
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5">
                       <div className={classNames("flex flex-col", theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text")}>
                          <span className="text-sm font-black">
                             {order.items[0]?.quantity || 1} <span className="text-xs opacity-50 font-medium ml-0.5">pc{order.items[0]?.quantity > 1 ? 's' : ''}</span>
                          </span>
                          {order.items.length > 1 && (
                            <span className={classNames("text-[10px] font-black mt-1.5 px-2 py-0.5 rounded-md self-start", theme === "dark" ? "bg-slate-800 text-rose-400" : "bg-rose-50 text-rose-600")}>
                               {order.items.reduce((acc, item) => acc + (item.quantity || 1), 0)} Total
                            </span>
                          )}
                       </div>
                    </td>
                    <td className={classNames("whitespace-nowrap px-3 py-5 text-base font-black", theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text")}>
                      ₹{order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                      <StatusDropdown 
                        currentStatus={order.orderStatus} 
                        onChange={(status) => handleStatusChange(order._id, status)}
                        theme={theme}
                        getStatusConfig={getStatusConfig}
                        isUpdating={updatingId === order._id}
                      />
                    </td>
                     <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className={classNames(
                          "inline-flex p-2 rounded-xl transition-all hover:scale-110 shadow-sm",
                          theme === "dark" ? "text-theme-dark-primary bg-slate-800 hover:bg-slate-700" : "text-theme-light-primary bg-rose-50 hover:bg-rose-100"
                        )}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Order</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Spacing for Dropdowns at the bottom */}
      {!loading && orders.length > 0 && <div className="h-40" />}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          theme={theme}
          getStatusConfig={getStatusConfig}
        />
      )}
    </div>
  );
}

const StatusDropdown = ({ currentStatus, onChange, theme, getStatusConfig, isUpdating }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useState(null);
  const config = getStatusConfig(currentStatus);

  const options = STATUS_OPTIONS;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          "flex items-center justify-between w-full min-w-[150px] px-4 py-2.5 rounded-xl text-[13px] font-black border-2 transition-all duration-300 ring-1",
          config.bg, config.text, config.ring,
          isOpen ? "ring-rose-500/50 border-rose-500/50 shadow-lg shadow-rose-500/10" : "border-transparent",
          isUpdating ? "opacity-50 cursor-wait" : "hover:scale-105 active:scale-95"
        )}
      >
        <span className="flex items-center gap-2.5">
           {isUpdating ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : config.icon}
           {config.label}
        </span>
        <ChevronDown className={classNames("h-3.5 w-3.5 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[45]" onClick={() => setIsOpen(false)} />
          <div className={classNames(
            "absolute left-0 mt-2 w-full min-w-[180px] rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 z-[100] animate-in fade-in zoom-in duration-200 origin-top",
            theme === "dark" ? "bg-slate-900 border border-slate-700" : "bg-theme-cream-solid border border-rose-100"
          )}>
            <div className="p-1">
              {options.map((opt) => {
                const optConfig = getStatusConfig(opt);
                const isSelected = opt === currentStatus;
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    className={classNames(
                      "flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-[12px] font-black transition-colors mb-0.5 last:mb-0",
                      isSelected 
                        ? (theme === "dark" ? "bg-slate-800 text-rose-400" : "bg-rose-50 text-rose-600")
                        : (theme === "dark" ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-gray-600 hover:bg-gray-50 hover:text-rose-600")
                    )}
                  >
                    <span className="flex items-center gap-3">
                       <span className={classNames("p-1 rounded-lg", optConfig.bg, optConfig.text)}>
                         {optConfig.icon}
                       </span>
                       {optConfig.label}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-rose-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const OrderDetailsModal = ({ order, onClose, theme, getStatusConfig }) => {
  const config = getStatusConfig(order.orderStatus);
  
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />

        <div className={classNames(
          "relative transform overflow-hidden rounded-3xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl animate-in fade-in zoom-in duration-300",
          theme === "dark" ? "bg-slate-900 border border-slate-800" : "bg-theme-cream-solid"
        )}>
          {/* Header */}
          <div className={classNames(
            "px-6 py-4 flex items-center justify-between border-b",
            theme === "dark" ? "border-slate-800" : "border-rose-50"
          )}>
            <div>
              <h3 className={classNames("text-lg font-black", theme === "dark" ? "text-white" : "text-slate-900")}>
                Order Details
              </h3>
              <p className={classNames("text-xs font-mono", theme === "dark" ? "text-slate-400" : "text-slate-500")}>
                #{order._id.toUpperCase()}
              </p>
            </div>
            <div className={classNames(
              "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
              config.bg, config.text
            )}>
              {config.icon}
              {config.label}
            </div>
          </div>

          <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Customer & Delivery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className={classNames("text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-2", theme === "dark" ? "text-white" : "text-slate-900")}>
                  <User className="h-3 w-3" /> Customer Info
                </h4>
                <div className={classNames(
                  "p-4 rounded-2xl border transition-colors",
                  theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-100"
                )}>
                  <p className={classNames("text-sm font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>{order.user?.name || "Guest"}</p>
                  <div className="flex items-center gap-2 mt-1 opacity-70">
                    <Mail className="h-3 w-3" />
                    <p className="text-xs font-medium">{order.user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className={classNames("text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-2", theme === "dark" ? "text-white" : "text-slate-900")}>
                  <MapPin className="h-3 w-3" /> Shipping Address
                </h4>
                <div className={classNames(
                  "p-4 rounded-2xl border transition-colors",
                  theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-rose-50/30 border-rose-100"
                )}>
                  <p className="text-xs font-medium leading-relaxed">
                    {order.deliveryLocation?.address || "Address not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h4 className={classNames("text-[10px] font-black uppercase tracking-widest opacity-50 flex items-center gap-2", theme === "dark" ? "text-white" : "text-slate-900")}>
                <Package className="h-3 w-3" /> Items Summary
              </h4>
              <div className={classNames(
                "rounded-2xl border overflow-hidden",
                theme === "dark" ? "border-slate-800" : "border-gray-100"
              )}>
                {order.items?.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={classNames(
                      "flex items-center justify-between p-4 border-b last:border-0",
                      theme === "dark" ? "border-slate-800 bg-slate-800/20" : "border-gray-50 bg-theme-cream-solid"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {item.product?.image && (
                        <img src={item.product?.image} className="h-10 w-10 rounded-xl object-cover" alt="" />
                      )}
                      <div>
                        <p className={classNames("text-xs font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>
                          {item.product?.name || "Deleted Product"}
                        </p>
                        <p className="text-[10px] opacity-60 font-medium">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className={classNames("text-xs font-black", theme === "dark" ? "text-rose-400" : "text-rose-600")}>
                      ₹{((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Footer Summary */}
            <div className={classNames(
              "p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4",
              theme === "dark" ? "bg-slate-800/80" : "bg-slate-900 text-white"
            )}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-theme-cream-solid/10 rounded-2xl">
                   <CreditCard className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-wider opacity-60">Payment Mode</p>
                   <p className="text-sm font-bold">{order.paymentMethod || "COD"}</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                 <p className="text-[10px] font-black uppercase tracking-wider opacity-60">Total Amount</p>
                 <p className="text-2xl font-black">₹{order.totalAmount?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className={classNames(
            "p-4 flex gap-3",
            theme === "dark" ? "bg-slate-950/50" : "bg-gray-50"
          )}>
            <button
              onClick={onClose}
              className={classNames(
                "flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                theme === "dark" ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-theme-cream-solid border border-gray-200 text-slate-600 hover:bg-gray-100"
              )}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
