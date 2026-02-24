import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../api/order.api";
import { useTheme } from "../../context/ThemeContext";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      fetchOrders();
    } catch (err) {
      setError("Failed to update order status");
      console.error("Update status error:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusEmoji = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "🔄";
      case "shipped":
        return "📦";
      case "delivered":
        return "✓";
      case "cancelled":
        return "✕";
      default:
        return "📋";
    }
  };

  return (
    <div
      className={classNames(
        "min-h-screen pb-12",
        theme === "dark"
          ? "bg-[#2B1B17] text-[#E5D3C5]"
          : "bg-linear-to-br from-blue-50 to-indigo-50",
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2
          className={classNames(
            "text-3xl sm:text-4xl font-bold mb-8",
            theme === "dark" ? "text-[#B97A6A]" : "text-[#4A3728]",
          )}
        >
          📋 Manage Orders
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <p className="text-lg opacity-70">Loading orders... 🔄</p>
          </div>
        ) : orders.length === 0 ? (
          <div
            className={classNames(
              "rounded-lg p-12 text-center",
              theme === "dark"
                ? "bg-[#3A2A25]"
                : "bg-white border border-gray-200",
            )}
          >
            <p className="text-lg opacity-70">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className={classNames(
                  "rounded-lg p-6 hover:shadow-lg transition",
                  theme === "dark"
                    ? "bg-[#3A2A25]"
                    : "bg-white border border-gray-200",
                )}
              >
                {/* Order Header */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                  <div>
                    <p
                      className={classNames(
                        "text-xs uppercase font-semibold mb-1",
                        theme === "dark" ? "text-[#D4C5B9]" : "text-gray-500",
                      )}
                    >
                      Order ID
                    </p>
                    <p className="font-mono font-bold">
                      {order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <p
                      className={classNames(
                        "text-xs uppercase font-semibold mb-1",
                        theme === "dark" ? "text-[#D4C5B9]" : "text-gray-500",
                      )}
                    >
                      Customer Email
                    </p>
                    <p className="font-semibold break-all">
                      {order.user?.email}
                    </p>
                  </div>

                  <div>
                    <p
                      className={classNames(
                        "text-xs uppercase font-semibold mb-1",
                        theme === "dark" ? "text-[#D4C5B9]" : "text-gray-500",
                      )}
                    >
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-pink-600">
                      ₹{order.totalAmount?.toFixed(2) || "0.00"}
                    </p>
                  </div>

                  <div>
                    <p
                      className={classNames(
                        "text-xs uppercase font-semibold mb-1",
                        theme === "dark" ? "text-[#D4C5B9]" : "text-gray-500",
                      )}
                    >
                      Order Date
                    </p>
                    <p className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
                  <div>
                    <p
                      className={classNames(
                        "text-xs uppercase font-semibold mb-2",
                        theme === "dark" ? "text-[#D4C5B9]" : "text-gray-500",
                      )}
                    >
                      📍 Shipping Address
                    </p>
                    <p className="text-sm leading-relaxed">
                      {order.shippingAddress || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p
                      className={classNames(
                        "text-xs uppercase font-semibold mb-2",
                        theme === "dark" ? "text-[#D4C5B9]" : "text-gray-500",
                      )}
                    >
                      📦 Items
                    </p>
                    <ul className="text-sm space-y-1">
                      {order.items?.map((item, idx) => (
                        <li key={idx}>
                          {item.productId?.name || "Product"} ✕{item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Status Update */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div>
                    <p
                      className={classNames(
                        "text-xs uppercase font-semibold mb-3",
                        theme === "dark" ? "text-[#D4C5B9]" : "text-gray-500",
                      )}
                    >
                      Current Status
                    </p>
                    <span
                      className={classNames(
                        "inline-block px-4 py-2 rounded-full border-2 font-semibold text-sm",
                        getStatusColor(order.status),
                      )}
                    >
                      {getStatusEmoji(order.status)}{" "}
                      {order.status?.charAt(0).toUpperCase() +
                        order.status?.slice(1)}
                    </span>
                  </div>

                  <div>
                    <p
                      className={classNames(
                        "text-xs uppercase font-semibold mb-3",
                        theme === "dark" ? "text-[#D4C5B9]" : "text-gray-500",
                      )}
                    >
                      Update Status
                    </p>
                    <select
                      value={order.status || "Processing"}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className={classNames(
                        "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                        theme === "dark"
                          ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5]"
                          : "bg-gray-50 border-gray-300 text-gray-900",
                      )}
                    >
                      <option value="Processing">🔄 Processing</option>
                      <option value="Shipped">📦 Shipped</option>
                      <option value="Delivered">✓ Delivered</option>
                      <option value="Cancelled">✕ Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default AdminOrders;
