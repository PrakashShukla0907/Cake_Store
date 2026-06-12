import { useState, useEffect } from "react";
import { Search, Eye, ChevronDown, Check, Clock, Truck, ChefHat, XCircle, Package, User, Mail, MapPin, CreditCard, History, Phone } from "lucide-react";
import { getAdminOrders, updateAdminOrderStatus } from "../../api/admin.api";
import { useAdmin } from "../../context/AdminContext";

const STATUS_OPTIONS = ["Pending", "Baking", "Out for Delivery", "Delivered", "Cancelled"];

export default function CompletedOrders() {
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
      // Filter for only delivered orders
      const allOrders = data?.orders || data || [];
      const completed = allOrders.filter(o => o.orderStatus === "Delivered");
      setOrders(completed);
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
      
      if (newStatus !== "Delivered" && newStatus !== "Cancelled") {
        // Moves back to active orders
        setOrders(orders.filter(order => order._id !== orderId));
      } else {
        // Stays in completed, just update the label
        setOrders(orders.map(order => order._id === orderId ? { ...order, orderStatus: newStatus } : order));
      }

      refreshAdminState();
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
          bg: "bg-green-50",
          text: "text-green-700",
          ring: "border-green-200",
          icon: <Check className="h-3 w-3" />,
          label: "Delivered"
        };
      case 'Cancelled': 
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          ring: "border-red-200",
          icon: <XCircle className="h-3 w-3" />,
          label: "Cancelled"
        };
      case 'Pending': 
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          ring: "border-orange-200",
          icon: <Clock className="h-3 w-3" />,
          label: "Pending"
        };
      case 'Baking':
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          ring: "border-blue-200",
          icon: <ChefHat className="h-3 w-3" />,
          label: "Baking"
        };
      case 'Out for Delivery':
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          ring: "border-purple-200",
          icon: <Truck className="h-3 w-3" />,
          label: "Shipping"
        };
      default: 
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          ring: "border-gray-200",
          icon: <Package className="h-3 w-3" />,
          label: status
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-black">
            <History className="h-6 w-6 text-black" />
            Completed Orders {orders.length > 0 && `(${orders.length})`}
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            History of successfully delivered orders.
          </p>
        </div>

        {/* Revenue Summary Card */}
        {!loading && orders.length > 0 && (
          <div className="px-6 py-3 rounded-md border border-gray-200 bg-white shadow-sm flex items-center gap-4">
            <div className="p-2.5 rounded-md bg-gray-50 text-black border border-gray-200">
              <span className="text-xl font-black">₹</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-500">
                History Revenue
              </p>
              <p className="text-2xl font-black text-black">
                ₹{orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-4 rounded-md border border-gray-200 bg-white shadow-sm">
        <div className="relative max-w-sm w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-3 shadow-sm focus:border-black focus:ring-1 focus:ring-black sm:text-sm sm:leading-6 bg-white text-black transition-colors"
            placeholder="Search within history..."
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 rounded-md border border-gray-200 bg-white shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black mb-4"></div>
          <p className="font-medium text-gray-500">Loading history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 rounded-md border border-gray-200 bg-white shadow-sm h-[400px]">
          <div className="h-24 w-24 mb-6 rounded-md flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-300">
            <History className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-black text-black">
            No completed orders
          </h3>
          <p className="mt-2 text-sm max-w-xs text-center font-medium text-gray-500">
            Your fulfillment history is empty. Orders appear here once they are marked as Delivered.
          </p>
        </div>
      ) : (
        <div className="rounded-md shadow-sm border border-gray-200 bg-white">
          <div className="overflow-x-auto pb-24">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-black uppercase tracking-widest sm:pl-6">Order ID</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-widest">Customer</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-widest">Items</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-widest">Qty</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-widest">Total</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-widest">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                 {orders.filter(order => 
                    order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
                 ).map((order) => (
                  <tr key={order._id} className="transition-colors hover:bg-gray-50 group">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                      <div className="font-mono font-bold text-sm text-black">
                        #{order._id.substring(order._id.length - 6).toUpperCase()}
                      </div>
                      <div className="text-[11px] mt-1 font-medium text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                     <td className="whitespace-nowrap px-3 py-4">
                      <div className="font-bold text-sm text-black">
                        {order.user?.name || "Guest"}
                      </div>
                      <div className="text-[11px] mt-0.5 font-medium text-gray-500">
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="flex flex-col min-w-0">
                        {order.items?.length > 0 && (
                          <>
                            <span className="text-[13px] font-bold truncate max-w-[200px] text-black">
                              {order.items[0]?.product?.name || "Product"}
                            </span>
                            {order.items.length > 1 && (
                              <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5 text-gray-500">
                                + {order.items.length - 1} more items
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                       <div className="flex flex-col text-black">
                          <span className="text-sm font-bold">
                             {order.items[0]?.quantity || 1} <span className="text-xs font-medium text-gray-500 ml-0.5">pc{order.items[0]?.quantity > 1 ? 's' : ''}</span>
                          </span>
                       </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-base font-black text-black">
                      ₹{order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <StatusDropdown 
                        currentStatus={order.orderStatus} 
                        onChange={(status) => handleStatusChange(order._id, status)}
                        getStatusConfig={getStatusConfig}
                        isUpdating={updatingId === order._id}
                      />
                    </td>
                     <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex p-2 rounded-md transition-all hover:bg-gray-100 border border-gray-200 shadow-sm text-black bg-white"
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
          getStatusConfig={getStatusConfig}
        />
      )}
    </div>
  );
}

const StatusDropdown = ({ currentStatus, onChange, getStatusConfig, isUpdating }) => {
  const [isOpen, setIsOpen] = useState(false);
  const config = getStatusConfig(currentStatus);

  const options = STATUS_OPTIONS;
  const isLocked = currentStatus === "Delivered" || currentStatus === "Cancelled";

  return (
    <div className="relative">
      <button
        type="button"
        disabled={isUpdating || isLocked}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full min-w-[150px] px-3 py-2 rounded-md text-xs font-bold border ${config.bg} ${config.text} ${config.ring} ${isUpdating ? "opacity-50 cursor-wait" : isLocked ? "opacity-75 cursor-not-allowed" : "hover:brightness-95"}`}
      >
        <span className="flex items-center gap-2.5">
           {isUpdating ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" /> : config.icon}
           {config.label}
        </span>
        {!isLocked && <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />}
      </button>

      {isOpen && !isLocked && (
        <>
          <div className="fixed inset-0 z-[45]" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-1 w-full min-w-[180px] rounded-md shadow-lg border border-gray-200 bg-white z-100">
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
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-sm text-xs font-bold transition-colors mb-0.5 last:mb-0 ${isSelected ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50 hover:text-black"}`}
                  >
                    <span className="flex items-center gap-3">
                       <span className={`p-1 rounded-sm border ${optConfig.bg} ${optConfig.text} ${optConfig.ring}`}>
                         {optConfig.icon}
                       </span>
                       {optConfig.label}
                    </span>
                    {isSelected && <Check className="h-3 w-3 text-black" />}
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

const OrderDetailsModal = ({ order, onClose, getStatusConfig }) => {
  const config = getStatusConfig(order.orderStatus);
  
  return (
    <div className="fixed inset-0 z-100 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div 
          className="fixed inset-0 bg-black/60 transition-opacity" 
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-md text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl bg-white border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-gray-50">
            <div>
              <h3 className="text-lg font-black text-black">
                Order Details
              </h3>
              <p className="text-xs font-mono font-medium text-gray-500">
                #{order._id.toUpperCase()}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-wider border ${config.bg} ${config.text} ${config.ring}`}>
              {config.icon}
              {config.label}
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Customer & Delivery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[2px] text-gray-500 flex items-center gap-2">
                  <User className="h-3 w-3" /> Customer Info
                </h4>
                <div className="p-4 rounded-md border border-gray-200 bg-white">
                  <p className="text-sm font-bold text-black">{order.user?.name || "Guest"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <p className="text-xs font-medium text-gray-600">{order.user?.phone || "No Phone"}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <p className="text-xs font-medium text-gray-600">{order.user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[2px] text-gray-500 flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> Shipping Address
                </h4>
                <div className="p-4 rounded-md border border-gray-200 bg-white">
                  <p className="text-xs font-medium leading-relaxed text-black">
                    {order.deliveryLocation?.address || "Address not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[2px] text-gray-500 flex items-center gap-2">
                <Package className="h-3 w-3" /> Items Summary
              </h4>
              <div className="rounded-md border border-gray-200 overflow-hidden bg-white">
                {order.items?.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-4 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      {item.product?.image ? (
                        <img src={item.product?.image} className="h-10 w-10 rounded-md object-cover border border-gray-200" alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-black">
                          {item.product?.name || "Deleted Product"}
                        </p>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-xs font-black text-black">
                      ₹{((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Footer Summary */}
            <div className="p-5 rounded-md border border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white border border-gray-200 rounded-md text-black">
                   <CreditCard className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-500">Payment Mode</p>
                   <p className="text-sm font-bold text-black">{order.paymentMethod || "COD"}</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                 <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-500">Total Amount</p>
                 <p className="text-2xl font-black text-black">₹{order.totalAmount?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="p-4 flex gap-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-md font-bold text-sm bg-white border border-gray-300 text-black hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
