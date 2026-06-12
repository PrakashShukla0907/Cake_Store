import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder } from "../api/order.api";
import { addToCart } from "../api/product.api";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Package, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ChefHat, 
  XCircle,
  FileText,
  X
} from "lucide-react";

const Orders = () => {
  const { refreshUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [reorderingId, setReorderingId] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);

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

  const handleOrderAgain = async (order) => {
    try {
      setReorderingId(order._id);
      for (const item of order.items) {
        if (item.product && item.product._id) {
          await addToCart({ productId: item.product._id, quantity: item.quantity });
        }
      }
      refreshUser();
      navigate("/cart");
    } catch (err) {
      console.error("Reorder failed", err);
      setError("Failed to add items to cart.");
    } finally {
      setReorderingId(null);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      setLoading(true);
      await cancelOrder(orderToCancel);
      await fetchOrders();
    } catch (err) {
      console.error("Cancel order failed", err);
      setError(err.response?.data?.message || "Failed to cancel order.");
    } finally {
      setLoading(false);
      setOrderToCancel(null);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          color: "bg-orange-50 text-orange-700 border-orange-200",
          icon: <Clock className="h-3 w-3" />,
          label: "Pending",
        };
      case "baking":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <ChefHat className="h-3 w-3" />,
          label: "Baking",
        };
      case "out for delivery":
        return {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <Truck className="h-3 w-3" />,
          label: "Out for Delivery",
        };
      case "delivered":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle2 className="h-3 w-3" />,
          label: "Delivered",
        };
      case "cancelled":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle className="h-3 w-3" />,
          label: "Cancelled",
        };
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: <Package className="h-3 w-3" />,
          label: status,
        };
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50 text-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-md bg-black text-white shadow-sm border border-black">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-black">
              My Orders
            </h2>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            ← Back to Store
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8 font-bold text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 rounded-md border border-gray-200 bg-white shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black mb-4" />
            <p className="font-medium text-gray-500">Loading your history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 rounded-md border border-gray-200 bg-white shadow-sm">
            <div className="h-24 w-24 mb-6 rounded-md flex items-center justify-center bg-gray-50 text-gray-300 border border-gray-200">
              <Package className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-black text-black">No orders yet</h3>
            <p className="mt-2 text-sm max-w-xs text-center font-medium text-gray-500 mb-8">
              Looks like you haven't placed an order yet. Let's fix that!
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3.5 rounded-md font-black text-sm uppercase tracking-widest bg-black text-white border border-black hover:bg-gray-800 transition-colors shadow-sm"
            >
              Explore Cakes
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = getStatusConfig(order.orderStatus);
              return (
                <div
                  key={order._id}
                  className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 mb-1">
                          Order ID
                        </p>
                        <p className="font-mono font-bold text-sm text-black">
                          #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 mb-1">
                          Placed On
                        </p>
                        <p className="font-bold text-sm text-black">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                       <span
                         className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest py-1.5 px-3 rounded-sm border ${status.color}`}
                       >
                         {status.icon}
                         {status.label}
                       </span>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {/* Left Column: Items */}
                       <div className="md:col-span-2 space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                             Items Ordered
                          </p>
                          <div className="space-y-3">
                            {order.items?.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-md border border-gray-100 bg-gray-50/50"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 rounded-sm bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-black text-black">
                                    {item.quantity}x
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-black">
                                      {item.product?.name || "Deleted Product"}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-500">
                                      ₹{item.product?.price || 0} per item
                                    </p>
                                  </div>
                                </div>
                                <div className="text-sm font-black text-black">
                                   ₹{((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                       </div>

                       {/* Right Column: Delivery & Totals */}
                       <div className="space-y-6">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                               <MapPin className="h-3 w-3" /> Delivery Address
                            </p>
                            <p className="text-xs font-bold leading-relaxed text-black bg-gray-50 p-3 rounded-md border border-gray-100">
                              {order.deliveryLocation?.address || "Address not available"}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                             <div className="flex justify-between items-center mb-4">
                               <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Payment</p>
                               <p className="text-xs font-bold text-black">{order.paymentMethod || "COD"}</p>
                             </div>
                             <div className="flex justify-between items-end border-t border-gray-200 pt-4">
                               <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Grand Total</p>
                               <p className="text-2xl font-black text-black">
                                 ₹{order.totalAmount?.toFixed(2) || "0.00"}
                               </p>
                             </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowReceipt(true);
                              }}
                              className="flex-1 py-3 rounded-md text-xs font-black uppercase tracking-widest border border-gray-200 text-black hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2 bg-white"
                            >
                              <FileText className="h-4 w-4" /> Details
                            </button>
                            <button
                              disabled={reorderingId === order._id}
                              onClick={() => handleOrderAgain(order)}
                              className="flex-1 py-3 rounded-md text-xs font-black uppercase tracking-widest border border-black bg-black text-white hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {reorderingId === order._id ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <><ShoppingBag className="h-4 w-4" /> Order Again</>
                              )}
                            </button>
                          </div>
                          
                          {/* Cancel Order Button */}
                          {order.orderStatus === "Pending" && (Date.now() - new Date(order.createdAt).getTime() < 2 * 60 * 1000) && (
                            <div className="mt-3 text-center">
                              <button
                                onClick={() => setOrderToCancel(order._id)}
                                className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center justify-center gap-1"
                              >
                                <XCircle className="h-3 w-3" /> Cancel Order
                              </button>
                              <p className="text-[9px] font-bold text-gray-400 mt-1">
                                Orders can only be cancelled within 2 minutes of placing.
                              </p>
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {showReceipt && selectedOrder && (
        <OrderReceiptModal
          order={selectedOrder}
          onClose={() => setShowReceipt(false)}
          getStatusConfig={getStatusConfig}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 z-100 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-black/60 transition-opacity"
              onClick={() => setOrderToCancel(null)}
            />
            <div className="relative transform overflow-hidden rounded-md text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm bg-white border border-gray-200">
              <div className="p-8 pb-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-6">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-black mb-2">Cancel Order?</h3>
                <p className="text-sm font-medium text-gray-500">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
              </div>
              <div className="px-8 pb-8 pt-0 flex gap-3">
                <button
                  onClick={() => setOrderToCancel(null)}
                  className="flex-1 py-3 rounded-md font-bold text-xs uppercase tracking-widest border border-gray-200 text-black hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 py-3 rounded-md font-black text-xs uppercase tracking-widest bg-red-500 text-white border border-red-500 hover:bg-red-600 transition-colors shadow-sm"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderReceiptModal = ({ order, onClose, getStatusConfig }) => {
  const config = getStatusConfig(order.orderStatus);

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-black/60 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-md text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md bg-white border border-gray-200">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-md bg-gray-100 text-gray-500 hover:text-black transition-colors print:hidden"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-8 pb-10">
            {/* Header */}
            <div className="text-center pb-6 border-b border-dashed border-gray-300">
              <h3 className="text-2xl font-black uppercase tracking-widest text-black">
                Gopal Bakers
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 mt-2">
                Order Details
              </p>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4 py-6 border-b border-dashed border-gray-300">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Order ID.
                </p>
                <p className="font-mono font-bold text-xs text-black">
                  #{order._id.substring(order._id.length - 8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Date
                </p>
                <p className="font-bold text-xs text-black">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Status & Payment */}
            <div className="py-6 border-b border-dashed border-gray-300 space-y-4">
              <div className="flex justify-between items-center">
                 <p className="text-xs font-bold text-gray-500">Order Status</p>
                 <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest py-1 px-2.5 rounded-sm border ${config.color}`}>
                   {config.label}
                 </span>
              </div>
              <div className="flex justify-between items-center">
                 <p className="text-xs font-bold text-gray-500">Payment Method</p>
                 <p className="text-xs font-bold text-black">{order.paymentMethod || "COD"}</p>
              </div>
            </div>

            {/* Itemized List */}
            <div className="py-6 border-b border-dashed border-gray-300 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                Items
              </p>
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-sm">
                  <div className="flex gap-2">
                    <span className="font-bold text-black">{item.quantity}x</span>
                    <span className="font-medium text-gray-700">{item.product?.name || "Product"}</span>
                  </div>
                  <span className="font-bold text-black">
                    ₹{((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-6 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-gray-400">Thank you for ordering!</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total</p>
                <p className="text-2xl font-black text-black">
                  ₹{order.totalAmount?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 pb-8 pt-0 print:hidden">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-md font-black text-xs uppercase tracking-widest bg-black text-white border border-black hover:bg-gray-800 transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
