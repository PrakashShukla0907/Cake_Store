import { Menu as MenuIcon, Bell, Trash2, X } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { useTheme } from "../../context/ThemeContext";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { markAllNotificationsRead, deleteAdminNotification, deleteAllAdminNotifications } from "../../api/notification.api";
import NotificationToast from "./NotificationToast";
import { useAdmin } from "../../context/AdminContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Topbar({ setMobileMenuOpen }) {
  const { theme } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const { notifications, refreshAdminState } = useAdmin();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
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
    <header className={classNames(
      "sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b px-4 sm:gap-x-6 sm:px-6 lg:px-8 transition-colors duration-300",
      theme === "dark" 
        ? "bg-theme-dark-bg/90 border-theme-dark-border backdrop-blur-sm" 
        : "bg-theme-light-bg/90 border-theme-light-border backdrop-blur-sm"
    )}>
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className={classNames(
            "lg:hidden p-2 rounded-md transition-colors",
            theme === "dark" ? "text-theme-dark-text hover:bg-theme-dark-card" : "text-theme-light-text hover:bg-theme-light-card"
          )}
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
            className={classNames(
              "p-2 rounded-full transition-colors relative",
              theme === "dark" 
                ? "text-slate-400 hover:text-white hover:bg-slate-800" 
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 text-[10px] font-bold text-white flex items-center justify-center">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <div className={classNames(
              "absolute right-[-100px] sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 origin-top-right rounded-2xl shadow-xl ring-1 ring-black/5 focus:outline-none transition-all duration-300 z-50 overflow-hidden",
              theme === "dark" ? "bg-slate-900/95 border border-slate-700/50 backdrop-blur-xl" : "bg-theme-cream-solid/95 border border-rose-100/50 backdrop-blur-xl"
            )}>
              <div className={classNames("p-4 py-3 border-b flex justify-between items-center", theme === "dark" ? "border-slate-800" : "border-gray-100")}>
                <h3 className={classNames("text-sm font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>Notifications</h3>
                <div className="flex items-center gap-3">
                    {notifications.length > 0 && (
                        <button 
                            onClick={handleClearAll}
                            className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-tight"
                            title="Clear All Notifications"
                        >
                            Clear All
                        </button>
                    )}
                    {notifications.some(n => !n.isRead) && (
                        <button 
                            onClick={handleMarkAllRead}
                            className="text-[10px] font-bold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors uppercase tracking-tight"
                        >
                            Mark Read
                        </button>
                    )}
                </div>
              </div>
              <ul className={classNames("divide-y max-h-60 overflow-y-auto rounded-b-xl", theme === "dark" ? "divide-slate-800" : "divide-gray-100")}>
                {notifications.length === 0 ? (
                  <li className={classNames("p-4 text-sm text-center", theme === "dark" ? "text-slate-400" : "text-gray-500")}>No new notifications.</li>
                ) : (
                  notifications.map(n => (
                    <li key={n._id} className={classNames(
                        "p-4 text-sm cursor-pointer transition-colors border-l-2 group", 
                        n.isRead 
                            ? (theme === "dark" ? "text-slate-400 hover:bg-slate-800/50 border-transparent" : "text-gray-500 hover:bg-gray-50 border-transparent")
                            : (theme === "dark" ? "text-slate-100 bg-rose-500/5 hover:bg-rose-500/10 border-rose-500" : "text-gray-900 bg-rose-50 hover:bg-rose-100/50 border-rose-500")
                    )}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <span className="font-medium truncate">{n.message}</span>
                          <span className={classNames("text-[10px] opacity-60", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                              {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => handleDelete(e, n._id)}
                          className={classNames(
                            "p-1 rounded-md lg:opacity-0 lg:group-hover:opacity-100 transition-opacity",
                            theme === "dark" ? "hover:bg-slate-700 text-slate-500" : "hover:bg-gray-200 text-gray-400"
                          )}
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
        <div className={classNames(
          "hidden lg:block lg:h-6 lg:w-px",
          theme === "dark" ? "bg-slate-500" : "bg-gray-500"
        )} aria-hidden="true" />

        <ThemeToggle />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-x-2 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <span className="sr-only">Open user menu</span>
            <div className={classNames(
              "h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm",
              theme === "dark" ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-700"
            )}>
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </button>

          {showProfileMenu && (
            <div className={classNames(
              "absolute right-0 mt-2 w-48 origin-top-right rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 z-50",
              theme === "dark" ? "bg-slate-900 border border-slate-700" : "bg-theme-cream-solid border border-rose-100"
            )}>
              <div className={classNames("p-4 border-b", theme === "dark" ? "border-slate-800" : "border-gray-100")}>
                <p className={classNames("text-sm font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>
                  {user?.name || "Admin"}
                </p>
                <p className={classNames("text-xs truncate", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                  {user?.email || "admin@bakery.com"}
                </p>
              </div>
              <ul className="py-2">
                <li>
                  <a href="/admin/products" className={classNames(
                    "block px-4 py-2 text-sm",
                    theme === "dark" ? "text-slate-300 hover:bg-slate-800 hover:text-white" : "text-gray-700 hover:bg-rose-50"
                  )}>
                    Products
                  </a>
                </li>
                <li>
                  <a href="/admin/orders" className={classNames(
                    "block px-4 py-2 text-sm",
                    theme === "dark" ? "text-slate-300 hover:bg-slate-800 hover:text-white" : "text-gray-700 hover:bg-rose-50"
                  )}>
                    Orders
                  </a>
                </li>
                <li className={classNames("border-t mt-1 pt-1", theme === "dark" ? "border-slate-800" : "border-gray-100")}>
                  <button
                    onClick={logout}
                    className={classNames(
                      "block w-full text-left px-4 py-2 text-sm",
                      theme === "dark" ? "text-rose-400 hover:bg-slate-800 hover:text-rose-300" : "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    )}
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
