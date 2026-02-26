import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaShoppingCart, FaSignOutAlt, FaBoxOpen, FaTags, FaPlus, FaUtensils, FaChartBar, FaUsers, FaImage, FaSearch, FaCheckCircle } from "react-icons/fa";
import { logoutUser } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/logo_bakery.png";
import { useAdmin } from "../context/AdminContext";
import { Bell, Trash2, X } from "lucide-react";
import { markAllNotificationsRead, deleteAdminNotification, deleteAllAdminNotifications } from "../api/notification.api";
import { useRef, useEffect } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  
  const { notifications, refreshAdminState } = useAdmin();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const isAdmin = user?.role === "admin";

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

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = user?.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Removed local handleLogout to use unified context logout

  const navigationItems = [
    { name: "🏠 Home", href: "/" },
    ...(user && user.role !== 'admin' ? [{ name: "📦 My Orders", href: "/orders" }] : []),
  ];

  return (
    <Disclosure
      as="nav"
      className={classNames(
        "sticky top-0 z-50 border-b transition-all duration-300",
        theme === "dark"
          ? "bg-slate-900 border-slate-800 text-slate-100 shadow-md"
          : "bg-theme-cream-solid border-gray-100 text-slate-800 shadow-sm"
      )}
    >
      {({ close }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              {/* Logo and Brand */}
              <Link to="/" className="flex items-center gap-3 shrink-0 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
                  <img
                    src={logo}
                    alt="website logo"
                    className="relative h-11 w-auto object-contain transform group-hover:scale-105 transition duration-300 drop-shadow-md pb-1"
                  />
                </div>
                <span className={classNames(
                  "text-xl font-extrabold hidden sm:inline tracking-tight",
                  theme === "dark" ? "text-white" : "text-slate-900"
                )}>
                  GOPAL BAKERS
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={classNames(
                      "transition-colors font-semibold text-[15px]",
                      theme === "dark" 
                        ? "text-slate-300 hover:text-rose-400" 
                        : "text-slate-600 hover:text-rose-600"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Admin Dynamic Menu Links - Full on XL, Dropdown on LG */}
                {user?.role === "admin" && (
                  <>
                    <div className={classNames(
                      "hidden xl:flex items-center gap-3 rounded-full px-4 py-1.5 border shadow-inner transition-colors",
                      theme === "dark" 
                        ? "bg-slate-800 border-slate-700 shadow-slate-900/50" 
                        : "bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200/80 shadow-gray-200/50"
                    )}>
                      <span className={classNames(
                        "text-[10px] font-bold uppercase tracking-widest mr-2",
                        theme === "dark" ? "text-rose-400 opacity-80" : "text-rose-600 opacity-90"
                      )}>
                        Admin
                      </span>
                      <Link to="/admin" className={classNames(
                        "flex items-center gap-1.5 transition-colors font-bold text-sm",
                        theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-slate-700 hover:text-rose-600"
                      )}>
                        Dashboard
                      </Link>
                      <div className={classNames("w-px h-4", theme === "dark" ? "bg-slate-600" : "bg-gray-300")}></div>
                      <Link to="/admin/orders" className={classNames(
                        "flex items-center gap-1.5 transition-colors font-bold text-sm",
                        theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-slate-700 hover:text-rose-600"
                      )}>
                        Orders
                      </Link>
                      <div className={classNames("w-px h-4", theme === "dark" ? "bg-slate-600" : "bg-gray-300")}></div>
                      <Link to="/admin/completed-orders" className={classNames(
                        "flex items-center gap-1.5 transition-colors font-bold text-sm",
                        theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-slate-700 hover:text-rose-600"
                      )}>
                        Completed
                      </Link>
                      <div className={classNames("w-px h-4", theme === "dark" ? "bg-slate-600" : "bg-gray-300")}></div>
                      <Link to="/admin/products" className={classNames(
                        "flex items-center gap-1.5 transition-colors font-bold text-sm",
                        theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-slate-700 hover:text-rose-600"
                      )}>
                        Products
                      </Link>
                      <div className={classNames("w-px h-4", theme === "dark" ? "bg-slate-600" : "bg-gray-300")}></div>
                      <Link to="/admin/users" className={classNames(
                        "flex items-center gap-1.5 transition-colors font-bold text-sm",
                        theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-slate-700 hover:text-rose-600"
                      )}>
                        Users
                      </Link>
                      <div className={classNames("w-px h-4", theme === "dark" ? "bg-slate-600" : "bg-gray-300")}></div>
                      <Link to="/admin/banner" className={classNames(
                        "flex items-center gap-1.5 transition-colors font-bold text-sm",
                        theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-slate-700 hover:text-rose-600"
                      )}>
                        Banners
                      </Link>
                      <Link to="/admin/products" className="ml-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full px-3 py-1 transition-all transform hover:scale-105 shadow-md flex items-center gap-1.5 font-bold text-sm border border-rose-400/30">
                        <FaPlus className="text-xs" /> Add
                      </Link>
                    </div>

                    {/* LG Condensed Admin Dropdown */}
                    <Link to="/admin" className={classNames(
                        "hidden lg:flex xl:hidden items-center gap-2 px-4 py-1.5 rounded-full border font-bold text-sm transition-all",
                        theme === "dark" 
                          ? "bg-slate-800 border-slate-700 text-rose-400 hover:bg-slate-700" 
                          : "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100 shadow-sm"
                    )}>
                        <FaChartBar className="text-xs" />
                        <span>Admin Dashboard</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Right Side Items */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Admin Notifications */}
                {isAdmin && (
                  <div className="relative" ref={notificationRef}>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(!showNotifications)}
                      className={classNames(
                        "p-2 rounded-full transition-all relative group",
                        theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-rose-50"
                      )}
                    >
                      <Bell className={classNames(
                        "h-5 w-5 transition-colors",
                        theme === "dark" ? "group-hover:text-rose-400" : "group-hover:text-rose-600"
                      )} />
                      {notifications.filter(n => !n.isRead).length > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 text-[10px] font-bold text-white flex items-center justify-center">
                          {notifications.filter(n => !n.isRead).length}
                        </span>
                      )}
                    </button>

                    {/* Dropdown */}
                    {showNotifications && (
                      <div className={classNames(
                        "absolute right-[-100px] sm:right-[-50px] lg:right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 origin-top-right rounded-3xl shadow-2xl ring-1 ring-black/5 focus:outline-none transition-all duration-300 z-[60] overflow-hidden",
                        theme === "dark" ? "bg-slate-900/95 border border-slate-700/50 backdrop-blur-xl" : "bg-theme-cream-solid/95 border border-rose-100/50 backdrop-blur-xl"
                      )}>
                        <div className={classNames("p-4 py-3 border-b flex justify-between items-center", theme === "dark" ? "border-slate-800" : "border-gray-100")}>
                          <h3 className={classNames("text-sm font-black italic", theme === "dark" ? "text-white" : "text-slate-900 uppercase tracking-widest")}>Admin Alerts</h3>
                          <div className="flex items-center gap-3">
                            {notifications.length > 0 && (
                              <button 
                                onClick={handleClearAll}
                                className="text-[10px] font-black text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-tight"
                              >
                                Clear
                              </button>
                            )}
                            {notifications.some(n => !n.isRead) && (
                              <button 
                                onClick={handleMarkAllRead}
                                className="text-[10px] font-black text-slate-500 hover:text-slate-600 dark:text-slate-400 Transition-colors uppercase tracking-tight"
                              >
                                Read
                              </button>
                            )}
                          </div>
                        </div>
                        <ul className={classNames("divide-y max-h-72 overflow-y-auto rounded-b-2xl custom-scrollbar", theme === "dark" ? "divide-slate-800" : "divide-gray-50")}>
                          {notifications.length === 0 ? (
                            <li className={classNames("p-10 text-xs font-black uppercase tracking-widest text-center opacity-30 italic", theme === "dark" ? "text-slate-400" : "text-gray-500")}>Silence is golden...</li>
                          ) : (
                            notifications.map(n => (
                              <li key={n._id} className={classNames(
                                  "p-4 text-sm cursor-pointer transition-colors border-l-2 group relative", 
                                  n.isRead 
                                      ? (theme === "dark" ? "text-slate-400 hover:bg-slate-800/50 border-transparent" : "text-gray-500 hover:bg-gray-50 border-transparent")
                                      : (theme === "dark" ? "text-slate-100 bg-rose-500/5 hover:bg-rose-500/10 border-rose-500" : "text-gray-900 bg-rose-50 hover:bg-rose-100/50 border-rose-500")
                              )}>
                                <div className="flex justify-between items-start gap-2">
                                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                    <span className="font-bold truncate text-[13px]">{n.message}</span>
                                    <span className={classNames("text-[10px] font-black opacity-30 uppercase tracking-widest", theme === "dark" ? "text-slate-400" : "text-gray-500")}>
                                        {new Date(n.createdAt).toLocaleTimeString()} · {new Date(n.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                    <button 
                                      onClick={(e) => handleDelete(e, n._id)}
                                      className={classNames(
                                        "p-1.5 rounded-lg lg:opacity-0 lg:group-hover:opacity-100 transition-opacity",
                                        theme === "dark" ? "hover:bg-slate-700 text-slate-500" : "hover:bg-gray-200 text-gray-400"
                                      )}
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
                )}

                {/* Global Search Bar */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const query = formData.get("search");
                    if (query) {
                      navigate(`/?search=${encodeURIComponent(query)}`);
                    } else {
                      navigate(`/`); // Clear search on empty submit
                    }
                  }}
                  className="hidden md:flex relative group items-center"
                >
                  <div className={classNames(
                    "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors",
                    theme === "dark" ? "text-slate-400 group-focus-within:text-rose-400" : "text-slate-400 group-focus-within:text-rose-500"
                  )}>
                    <FaSearch className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search cakes..."
                    className={classNames(
                      "block w-full pl-10 pr-3 py-1.5 border rounded-full text-sm font-medium transition-all duration-300 outline-none focus:ring-2 focus:ring-opacity-50",
                      theme === "dark" 
                        ? "bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-500 focus:bg-slate-800 focus:border-rose-500/50 focus:ring-rose-500/30"
                        : "bg-gray-100/50 border-gray-200 text-slate-800 placeholder-slate-500 focus:bg-theme-cream-solid focus:border-rose-300 focus:ring-rose-200"
                    )}
                  />
                </form>

                {/* Cart Icon Badge (Desktop) */}
                {user && user.role !== 'admin' && (
                  <Link 
                    to="/cart" 
                    className={classNames(
                      "relative p-2 rounded-full transition-all group",
                      theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-rose-50"
                    )}
                  >
                    <FaShoppingCart className={classNames(
                      "h-5 w-5 transition-colors",
                      theme === "dark" ? "group-hover:text-rose-400" : "group-hover:text-rose-600"
                    )} />
                    {cartCount > 0 && (
                      <span className="badge badge-corner h-5 w-5 text-[10px] bg-rose-500">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Auth Links - Simplified to only burger menu on small screens */}
                {!loading && (
                  <div className="hidden sm:flex items-center">
                    {!user ? (
                      <div className="flex gap-2">
                        <Link
                          to="/login"
                          className={classNames(
                            "px-4 py-2 rounded-full font-semibold transition-all text-sm",
                            theme === "dark" 
                              ? "bg-slate-800 text-white hover:bg-slate-700" 
                              : "bg-theme-cream-solid text-rose-600 border border-rose-200 hover:bg-rose-50"
                          )}
                        >
                          Login
                        </Link>
                        <Link
                          to="/signup"
                          className="hidden lg:block px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 font-semibold shadow-md transition-all text-sm"
                        >
                          Sign Up
                        </Link>
                      </div>
                    ) : (
                      <button
                        onClick={logout}
                        className={classNames(
                          "flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all shadow-sm",
                          theme === "dark"
                            ? "bg-slate-800 hover:bg-rose-900/50 text-slate-200 hover:text-rose-200 border border-slate-700"
                            : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                        )}
                      >
                        <span className="hidden xl:inline text-xs">
                          {user.name.split(' ')[0].toUpperCase()}
                        </span>
                        <FaSignOutAlt className={theme === "dark" ? "text-rose-400" : "text-rose-500"} />
                      </button>
                    )}
                  </div>
                )}

                {/* Mobile Menu Button */}
                <DisclosureButton className={classNames(
                  "lg:hidden inline-flex items-center justify-center rounded-xl p-2.5 transition-all active:scale-95 border",
                  theme === "dark" 
                    ? "text-slate-300 bg-slate-800 border-slate-700" 
                    : "text-rose-600 bg-rose-50 border-rose-100 hover:bg-rose-100 shadow-sm"
                )}>
                  <span className="sr-only">Toggle menu</span>
                  <Bars3Icon
                    aria-hidden="true"
                    className="block h-6 w-6 group-data-open:hidden"
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className="hidden h-6 w-6 group-data-open:block"
                  />
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <DisclosurePanel className="lg:hidden border-b border-rose-100 dark:border-slate-800 bg-theme-cream-solid dark:bg-slate-900 shadow-xl relative z-40">
            <div className={classNames(
              "space-y-1 px-4 pt-4 pb-8",
              theme === "dark" ? "bg-slate-900" : "bg-theme-cream-solid"
            )}>
              {/* Mobile Global Search - Full Width */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const query = formData.get("search");
                  if (query) {
                    navigate(`/?search=${encodeURIComponent(query)}`);
                  } else {
                    navigate(`/`);
                  }
                  close();
                }}
                className="relative group items-center mb-6"
              >
                <div className={classNames(
                  "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors",
                  theme === "dark" ? "text-slate-400 group-focus-within:text-rose-400" : "text-slate-400 group-focus-within:text-rose-500"
                )}>
                  <FaSearch className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="search"
                  placeholder="Search for cakes, pastries..."
                  className={classNames(
                    "block w-full pl-11 pr-4 py-3.5 border rounded-2xl text-base font-bold transition-all duration-300 outline-none focus:ring-4 focus:ring-opacity-20",
                    theme === "dark" 
                      ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500 focus:bg-slate-800/80 focus:border-rose-500/50 focus:ring-rose-500/30"
                      : "bg-gray-50 border-gray-200 text-slate-800 placeholder-slate-500 focus:bg-theme-cream-solid focus:border-rose-300 focus:ring-rose-500/20"
                  )}
                />
              </form>

              {/* Add User Profile Info in Mobile Menu if Logged in */}
              {user && (
                <div className={classNames(
                  "flex items-center gap-3 px-4 py-4 rounded-2xl mb-4 border border-dashed",
                  theme === "dark" ? "bg-slate-800/40 border-slate-700" : "bg-rose-50/50 border-rose-200"
                )}>
                  <div className="h-10 w-10 rounded-full bg-rose-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className={classNames("text-sm font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>{user.name}</span>
                    <span className={classNames("text-[10px] font-black uppercase tracking-widest opacity-40", theme === "dark" ? "text-slate-400" : "text-rose-600")}>{user.role} Account</span>
                  </div>
                </div>
              )}

              {navigationItems.map((item) => (
                <DisclosureButton
                  key={item.href}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    "block rounded-xl px-5 py-4 text-base font-bold transition-all w-full text-left mb-2",
                    theme === "dark" 
                      ? "text-slate-300 hover:bg-slate-800 hover:text-rose-400" 
                      : "text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}

              {/* Mobile Cart Link with Badge */}
              {user && user.role !== 'admin' && (
                <DisclosureButton
                  as={Link}
                  to="/cart"
                  className={classNames(
                    "flex items-center justify-between rounded-xl px-5 py-4 text-base font-bold transition-all w-full text-left mb-2 border border-transparent",
                    theme === "dark" 
                      ? "text-slate-300 hover:bg-slate-800 hover:text-rose-400" 
                      : "text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <FaShoppingCart className={theme === "dark" ? "text-rose-400" : "text-rose-500"} />
                    <span>My Shopping Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-rose-500 text-white font-black text-[11px] px-3 py-1 rounded-full shadow-sm">
                      {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
                    </span>
                  )}
                </DisclosureButton>
              )}

              {/* Mobile Theme Toggle in Menu */}
              <div className={classNames(
                "flex items-center justify-between rounded-xl px-5 py-4 text-base font-bold transition-all w-full text-left mb-2",
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              )}>
                 <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                      {theme === 'dark' ? '🌙' : '☀️'}
                    </div>
                    <span>Appearance</span>
                 </div>
                 <ThemeToggle />
              </div>

              {/* Mobile Admin Menu Items */}
              {isAdmin && (
                <div className="pt-6 pb-2 mt-6 border-t border-gray-200 dark:border-slate-800/50 space-y-2">
                  <div className="px-4 flex items-center justify-between mb-4">
                     <span className="text-[10px] font-black text-rose-500 uppercase tracking-[4px] opacity-60">Admin Dashboard</span>
                     <div className="h-px flex-1 bg-rose-100 dark:bg-slate-800 ml-4"></div>
                  </div>
                  
                  <DisclosureButton
                    as={Link}
                    to="/admin"
                    className={classNames(
                      "flex items-center gap-4 rounded-2xl px-5 py-3.5 text-base font-bold w-full transition-all",
                      theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 bg-gray-50 hover:bg-rose-50 hover:text-rose-600"
                    )}
                  >
                    <FaChartBar className={theme === "dark" ? "text-rose-400" : "text-slate-400"} /> 
                    <div className="flex flex-col">
                       <span className="text-[14px]">Overview Dashboard</span>
                       <span className="text-[10px] opacity-40 uppercase tracking-widest font-black">Statistics & Analytics</span>
                    </div>
                  </DisclosureButton>
                  
                  <DisclosureButton
                    as={Link}
                    to="/admin/orders"
                    className={classNames(
                      "flex items-center gap-4 rounded-2xl px-5 py-3.5 text-base font-bold w-full transition-all",
                      theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 bg-gray-50 hover:bg-rose-50 hover:text-rose-600"
                    )}
                  >
                    <FaBoxOpen className={theme === "dark" ? "text-rose-400" : "text-slate-400"} /> 
                    <div className="flex flex-col">
                       <span className="text-[14px]">Order Fulfillment</span>
                       <span className="text-[10px] opacity-40 uppercase tracking-widest font-black">Manage Customer Orders</span>
                    </div>
                  </DisclosureButton>

                  <DisclosureButton
                    as={Link}
                    to="/admin/completed-orders"
                    className={classNames(
                      "flex items-center gap-4 rounded-2xl px-5 py-3.5 text-base font-bold w-full transition-all",
                      theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 bg-gray-50 hover:bg-rose-50 hover:text-rose-600"
                    )}
                  >
                    <FaCheckCircle className={theme === "dark" ? "text-rose-400" : "text-slate-400"} /> 
                    <div className="flex flex-col">
                       <span className="text-[14px]">Completed Orders</span>
                       <span className="text-[10px] opacity-40 uppercase tracking-widest font-black">Fulfillment History</span>
                    </div>
                  </DisclosureButton>
                  
                  <DisclosureButton
                    as={Link}
                    to="/admin/products"
                    className={classNames(
                      "flex items-center gap-4 rounded-2xl px-5 py-3.5 text-base font-bold w-full transition-all",
                      theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 bg-gray-50 hover:bg-rose-50 hover:text-rose-600"
                    )}
                  >
                    <FaTags className={theme === "dark" ? "text-rose-400" : "text-slate-400"} /> 
                    <div className="flex flex-col">
                       <span className="text-[14px]">Catalog Management</span>
                       <span className="text-[10px] opacity-40 uppercase tracking-widest font-black">Inventory & Pricing</span>
                    </div>
                  </DisclosureButton>

                  <DisclosureButton
                    as={Link}
                    to="/admin/users"
                    className={classNames(
                      "flex items-center gap-4 rounded-2xl px-5 py-3.5 text-base font-bold w-full transition-all",
                      theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 bg-gray-50 hover:bg-rose-50 hover:text-rose-600"
                    )}
                  >
                    <FaUsers className={theme === "dark" ? "text-rose-400" : "text-slate-400"} /> 
                    <div className="flex flex-col">
                       <span className="text-[14px]">Customer Directory</span>
                       <span className="text-[10px] opacity-40 uppercase tracking-widest font-black">User Accounts</span>
                    </div>
                  </DisclosureButton>

                  <DisclosureButton
                    as={Link}
                    to="/admin/banner"
                    className={classNames(
                      "flex items-center gap-4 rounded-2xl px-5 py-3.5 text-base font-bold w-full transition-all",
                      theme === "dark" ? "text-slate-300 hover:bg-slate-800" : "text-slate-700 bg-gray-50 hover:bg-rose-50 hover:text-rose-600"
                    )}
                  >
                    <FaImage className={theme === "dark" ? "text-rose-400" : "text-slate-400"} /> 
                    <div className="flex flex-col">
                       <span className="text-[14px]">Marketing Banners</span>
                       <span className="text-[10px] opacity-40 uppercase tracking-widest font-black">Promotional Display</span>
                    </div>
                  </DisclosureButton>
                  
                  <DisclosureButton
                    as={Link}
                    to="/admin/products"
                    className="flex items-center justify-center gap-3 rounded-2xl px-4 py-4 text-base font-black w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-xl mt-6 transition-all active:scale-95"
                  >
                    <FaPlus /> <span>New Product Entry</span>
                  </DisclosureButton>
                </div>
              )}

              {user ? (
                <div className="pt-8 border-t mt-8 border-gray-100 dark:border-slate-800">
                  <DisclosureButton
                    as="button"
                    onClick={() => {
                       logout();
                       close();
                    }}
                    className="flex items-center justify-center gap-3 w-full rounded-2xl px-4 py-4 text-base font-black text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 dark:bg-rose-900/20 dark:border-rose-900/40 dark:hover:bg-rose-900/40 dark:text-rose-400 transition-all shadow-md active:scale-95"
                  >
                    <FaSignOutAlt /> Sign Out
                  </DisclosureButton>
                </div>
              ) : (
                <div className="pt-8 border-t mt-8 border-gray-100 dark:border-slate-800 space-y-3">
                    <DisclosureButton
                        as={Link}
                        to="/login"
                        className="flex items-center justify-center w-full rounded-2xl px-4 py-4 text-base font-black text-white bg-rose-500 shadow-lg active:scale-95 transition-all"
                    >
                        Sign In
                    </DisclosureButton>
                    <DisclosureButton
                        as={Link}
                        to="/signup"
                        className={classNames(
                            "flex items-center justify-center w-full rounded-2xl px-4 py-4 text-base font-black border transition-all",
                            theme === "dark" ? "border-slate-700 text-slate-300" : "border-gray-200 text-slate-600 bg-gray-50"
                        )}
                    >
                        Create Account
                    </DisclosureButton>
                </div>
              )}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
