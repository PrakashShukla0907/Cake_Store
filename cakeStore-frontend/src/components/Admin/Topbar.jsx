import { Menu as MenuIcon, Bell, Trash2, X } from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { markAllNotificationsRead, deleteAdminNotification, deleteAllAdminNotifications } from "../../api/notification.api";
import NotificationToast from "./NotificationToast";
import { useAdmin } from "../../context/AdminContext";

export default function Topbar({ setMobileMenuOpen }) {
  const { user, logout } = useContext(AuthContext);
  const { notifications, refreshAdminState } = useAdmin();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [activeToast, setActiveToast] = useState(null);
  const prevNotifsRef = useRef([]);
  
  // Handle new notification toast
  useEffect(() => {
    if (notifications.length > 0 && prevNotifsRef.current.length > 0) {
      const latest = notifications[0];
      const prevLatest = prevNotifsRef.current[0];
      if (latest._id !== prevLatest._id && latest.type === "New Order") {
        setActiveToast(latest);
      }
    }
    prevNotifsRef.current = notifications;
  }, [notifications]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      refreshAdminState();
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      if (window.confirm("Are you sure you want to delete all notifications?")) {
        await deleteAllAdminNotifications();
        refreshAdminState();
      }
    } catch (err) {
      console.error("Failed to clear all notifications:", err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteAdminNotification(id);
      refreshAdminState();
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-gray-200 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
        >
          <span className="sr-only">Open sidebar</span>
          <MenuIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-md text-gray-500 hover:text-black hover:bg-gray-100 transition-colors relative"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-black ring-2 ring-white text-[10px] font-black text-white flex items-center justify-center">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="fixed left-1/2 -translate-x-1/2 top-14 sm:absolute sm:left-auto sm:translate-x-0 sm:top-auto sm:right-0 mt-2 w-[90vw] max-w-[280px] sm:w-80 origin-top-right rounded-md shadow-xl border border-gray-200 bg-white focus:outline-none transition-all z-50 overflow-hidden">
              <div className="p-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-sm font-black text-black">Notifications</h3>
                <div className="flex items-center gap-3">
                    {notifications.length > 0 && (
                        <button 
                            onClick={handleClearAll}
                            className="text-[10px] font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-tight"
                            title="Clear All Notifications"
                        >
                            Clear All
                        </button>
                    )}
                    {notifications.some(n => !n.isRead) && (
                        <button 
                            onClick={handleMarkAllRead}
                            className="text-[10px] font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-tight"
                        >
                            Mark Read
                        </button>
                    )}
                </div>
              </div>
              <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <li className="p-4 text-sm text-center text-gray-500 font-medium">No new notifications.</li>
                ) : (
                  notifications.map(n => (
                    <li 
                      key={n._id} 
                      onClick={() => {
                        setShowNotifications(false);
                        if (n.type === "Order Cancelled") {
                          navigate("/admin/cancelled-orders");
                        } else {
                          navigate("/admin/orders");
                        }
                      }}
                      className={`p-4 text-sm cursor-pointer transition-colors border-l-2 group ${
                        n.isRead 
                            ? "text-gray-500 hover:bg-gray-50 border-transparent"
                            : "text-black bg-gray-50/50 hover:bg-gray-100 border-black font-semibold"
                    }`}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <span className="truncate">{n.message}</span>
                          <span className="text-[10px] font-bold text-gray-400">
                              {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => handleDelete(e, n._id)}
                          className="p-1 rounded-md text-gray-400 hover:bg-gray-200 hover:text-black transition-all lg:opacity-0 lg:group-hover:opacity-100"
                          title="Delete notification"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="hidden lg:block lg:h-6 lg:w-px bg-gray-200" aria-hidden="true" />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-x-2 p-1 rounded-md transition-colors focus:outline-none"
          >
            <span className="sr-only">Open user menu</span>
            <div className="h-8 w-8 rounded-md flex items-center justify-center font-black text-sm bg-black text-white hover:bg-gray-800 transition-colors shadow-sm">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-xl border border-gray-200 bg-white focus:outline-none transition-all z-50">
              <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-md">
                <p className="text-sm font-black text-black">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs font-medium text-gray-500 truncate">
                  {user?.email || "admin@bakery.com"}
                </p>
              </div>
              <ul className="py-2">
                <li>
                  <a href="/admin/products" className="block px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-black">
                    Products
                  </a>
                </li>
                <li>
                  <a href="/admin/orders" className="block px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-black">
                    Orders
                  </a>
                </li>
                <li className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <NotificationToast 
        notification={activeToast} 
        onClose={() => setActiveToast(null)} 
      />
    </header>
  );
}
