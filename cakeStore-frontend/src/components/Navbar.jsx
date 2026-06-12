import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { logoutUser } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import {
  Bell,
  Trash2,
  X,
  Search,
  Home,
  ShoppingCart,
  ClipboardList,
  LayoutDashboard,
  Package,
  Users,
  Image,
  CheckSquare,
  Plus,
  LogOut,
  LogIn,
  UserPlus,
  BarChart2,
  Menu as MenuIcon,
} from "lucide-react";
import {
  markAllNotificationsRead,
  deleteAdminNotification,
  deleteAllAdminNotifications,
} from "../api/notification.api";
import { useRef, useEffect } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

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

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    ...(user && user.role !== "admin"
      ? [{ name: "My Orders", href: "/orders", icon: ClipboardList }]
      : []),
  ];

  const adminLinks = [
    { to: "/admin",                  label: "Dashboard",  icon: BarChart2      },
    { to: "/admin/orders",           label: "Orders",     icon: ClipboardList  },
    { to: "/admin/completed-orders", label: "Completed",  icon: CheckSquare    },
    { to: "/admin/products",         label: "Products",   icon: Package        },
    { to: "/admin/users",            label: "Users",      icon: Users          },
    { to: "/admin/banner",           label: "Banners",    icon: Image          },
  ];

  const adminMobileLinks = [
    { to: "/admin",                  label: "Overview Dashboard",  sub: "Statistics & Analytics",   icon: BarChart2     },
    { to: "/admin/orders",           label: "Order Fulfillment",   sub: "Manage Customer Orders",   icon: ClipboardList },
    { to: "/admin/completed-orders", label: "Completed Orders",    sub: "Fulfillment History",      icon: CheckSquare   },
    { to: "/admin/products",         label: "Catalog Management",  sub: "Inventory & Pricing",      icon: Package       },
    { to: "/admin/users",            label: "Customer Directory",  sub: "User Accounts",            icon: Users         },
    { to: "/admin/banner",           label: "Marketing Banners",   sub: "Promotional Display",      icon: Image         },
  ];

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 bg-white border-b border-gray-200 text-black shadow-sm"
    >
      {({ close }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center gap-4">

              {/* ── Logo ── */}
              <Link
                to="/"
                className="flex items-center shrink-0"
                aria-label="Gopal Bakers Home"
              >
                <span className="text-lg font-black tracking-tight text-black">
                  Gopal Bakers
                </span>
              </Link>

              {/* ── Desktop Nav Links ── */}
              <div className="hidden lg:flex items-center gap-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="px-3 py-2 rounded-md font-semibold text-[13px] text-gray-600 hover:text-black hover:bg-gray-100  :text-white :bg-gray-900 transition-all"
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Admin Link */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-md font-bold text-[13px] bg-black text-white hover:bg-gray-800 transition-all shadow-sm"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Admin Panel
                  </Link>
                )}
              </div>

              {/* ── Right Side ── */}
              <div className="flex items-center gap-2">

                {/* Admin Bell */}
                {isAdmin && (
                  <div className="relative" ref={notificationRef}>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 rounded-md transition-all relative group text-gray-500 hover:bg-gray-100 hover:text-black  :bg-gray-900 :text-white"
                      aria-label="Notifications"
                    >
                      <Bell className="h-5 w-5" />
                      {notifications.filter((n) => !n.isRead).length > 0 && (
                        <span className="absolute top-1 right-1 h-4 w-4 rounded-sm bg-black  ring-2 ring-white  text-[9px] font-black text-white  flex items-center justify-center">
                          {notifications.filter((n) => !n.isRead).length}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg shadow-xl ring-1 ring-black/10  z-[60] overflow-hidden bg-white  border border-gray-200 ">
                        <div className="px-4 py-3 border-b border-gray-100  flex justify-between items-center">
                          <h3 className="text-xs font-black uppercase tracking-widest text-black  flex items-center gap-1.5">
                            <Bell className="h-3.5 w-3.5" />
                            Alerts
                          </h3>
                          <div className="flex items-center gap-3">
                            {notifications.length > 0 && (
                              <button onClick={handleClearAll} className="text-[10px] font-black text-gray-400 hover:text-black :text-white transition-colors uppercase">
                                Clear all
                              </button>
                            )}
                            {notifications.some((n) => !n.isRead) && (
                              <button onClick={handleMarkAllRead} className="text-[10px] font-black text-gray-400 hover:text-black :text-white transition-colors uppercase">
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                        <ul className="divide-y divide-gray-100  max-h-72 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <li className="p-8 text-xs font-black uppercase tracking-widest text-center opacity-30 italic text-gray-500">
                              All caught up
                            </li>
                          ) : (
                            notifications.map((n) => (
                              <li
                                key={n._id}
                                className={classNames(
                                  "px-4 py-3 text-sm cursor-pointer transition-colors border-l-2 group relative",
                                  n.isRead
                                    ? "text-gray-400 hover:bg-gray-50 :bg-gray-900 border-transparent"
                                    : "text-gray-900  bg-gray-50  hover:bg-gray-100 :bg-gray-800 border-black ",
                                )}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                    <span className="font-bold truncate text-[13px]">{n.message}</span>
                                    <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">
                                      {new Date(n.createdAt).toLocaleTimeString()} · {new Date(n.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <button
                                    onClick={(e) => handleDelete(e, n._id)}
                                    className="p-1 rounded lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-gray-200 :bg-gray-700 text-gray-400"
                                  >
                                    <Trash2 className="h-3 w-3" />
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

                {/* ── Desktop Search Bar ── */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = new FormData(e.target).get("search");
                    navigate(q ? `/?search=${encodeURIComponent(q)}` : `/`);
                  }}
                  className="hidden md:flex items-center relative group"
                  role="search"
                  aria-label="Search cakes"
                >
                  {/* Search icon on LEFT — non-interactive, theme-matched */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search cakes..."
                    aria-label="Search"
                    className="w-44 lg:w-52 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white text-gray-800 placeholder-gray-400 outline-none focus:w-60 focus:border-black focus:ring-2 focus:ring-black/8 transition-all duration-300"
                  />
                </form>

                {/* Cart (Desktop) */}
                {user && user.role !== "admin" && (
                  <Link
                    to="/cart"
                    aria-label="Shopping Cart"
                    className="relative flex items-center gap-1.5 px-3 py-2 rounded-md font-semibold text-sm transition-all hover:bg-gray-100"
                  >
                    {/* Cart icon — black when empty, green when has items */}
                    <span className="relative">
                      <ShoppingCart className={`h-5 w-5 transition-colors ${cartCount > 0 ? "text-green-500" : "text-black"}`} />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-green-500 text-white text-[10px] font-black rounded-full px-1 shadow-sm ring-2 ring-white">
                          {cartCount}
                        </span>
                      )}
                    </span>
                    <span className={`hidden sm:inline font-bold transition-colors ${cartCount > 0 ? "text-green-600" : "text-black"}`}>
                      Cart
                    </span>
                  </Link>
                )}

                {/* Mobile Search Icon */}
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                  className="md:hidden p-2 rounded-md transition-all text-gray-500 hover:bg-gray-100 hover:text-black  :bg-gray-900 :text-white"
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </button>

                {/* Auth Buttons */}
                {!loading && (
                  <div className="hidden sm:flex items-center gap-2">
                    {!user ? (
                      <>
                        <Link
                          to="/login"
                          id="navbar-login-btn"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-md font-semibold text-sm border border-gray-300  text-gray-700  bg-white  hover:bg-gray-50 :bg-gray-900 hover:border-black :border-white transition-all"
                        >
                          <LogIn className="h-3.5 w-3.5" />
                          Login
                        </Link>
                        <Link
                          to="/signup"
                          id="navbar-signup-btn"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-md font-semibold text-sm bg-black  text-white  hover:bg-gray-800 :bg-gray-200 transition-all shadow-sm"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          Sign Up
                        </Link>
                      </>
                    ) : (
                      <button
                        onClick={logout}
                        id="navbar-signout-btn"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-md font-semibold text-sm border border-gray-300  text-gray-700  bg-white  hover:bg-gray-50 :bg-gray-900 transition-all"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    )}
                  </div>
                )}

                {/* Mobile Burger */}
                <DisclosureButton
                  className="lg:hidden inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-gray-300  font-bold text-sm text-gray-700  bg-white  hover:bg-gray-100 :bg-gray-900 transition-all"
                  aria-label="Open navigation menu"
                >
                  <MenuIcon className="h-4 w-4" />
                  <span className="hidden xs:inline">Menu</span>
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* ── Mobile Overlay Search (RECTANGLE) ── */}
          {isMobileSearchOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full px-4 py-3 border-b border-gray-200  bg-white  z-40 shadow-lg">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = new FormData(e.target).get("search");
                  navigate(q ? `/?search=${encodeURIComponent(q)}` : `/`);
                  setIsMobileSearchOpen(false);
                }}
                className="relative flex items-center"
                role="search"
                aria-label="Mobile search"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="search"
                  autoFocus
                  placeholder="Search cakes, pastries..."
                  aria-label="Search"
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300  rounded-lg text-sm font-medium bg-gray-50  text-gray-900  placeholder-gray-400  outline-none focus:bg-white :bg-black focus:border-black :border-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black :text-white"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* ── Mobile Menu Panel ── */}
          <DisclosurePanel className="lg:hidden border-b border-gray-200  bg-white  shadow-xl relative z-40">
            <div className="px-4 pt-4 pb-8 space-y-1 bg-white ">

              {/* Mobile Search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = new FormData(e.target).get("search");
                  navigate(q ? `/?search=${encodeURIComponent(q)}` : `/`);
                  close();
                }}
                className="relative mb-5"
                role="search"
                aria-label="Mobile menu search"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="search"
                  placeholder="Search for cakes, pastries..."
                  aria-label="Search"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300  rounded-lg text-sm font-bold bg-gray-50  text-gray-900  placeholder-gray-400  outline-none focus:bg-white :bg-black focus:border-black :border-white transition-all"
                />
              </form>

              {/* User Profile Card */}
              {user && (
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg mb-3 border border-gray-200  bg-gray-50 ">
                  <div className="h-9 w-9 rounded-md bg-black  flex items-center justify-center text-white  font-black text-sm">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-black ">{user.name}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{user.role} Account</span>
                  </div>
                </div>
              )}

              {/* Nav Items */}
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DisclosureButton
                    key={item.href}
                    as={Link}
                    to={item.href}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all w-full text-left text-gray-700  hover:bg-gray-100 :bg-gray-900 hover:text-black :text-white"
                  >
                    <Icon className="h-4 w-4 text-gray-400" />
                    {item.name}
                  </DisclosureButton>
                );
              })}

              {/* Cart Mobile */}
              {user && user.role !== "admin" && (
                <DisclosureButton
                  as={Link}
                  to="/cart"
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold transition-all w-full text-gray-700  hover:bg-gray-100 :bg-gray-900 hover:text-black :text-white"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-4 w-4 text-gray-400" />
                    <span>My Shopping Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-black  text-white  font-black text-[11px] px-2.5 py-0.5 rounded-sm">
                      {cartCount} {cartCount === 1 ? "item" : "items"}
                    </span>
                  )}
                </DisclosureButton>
              )}

              {/* Admin Section */}
              {isAdmin && (
                <div className="pt-4 mt-3 border-t border-gray-100  space-y-1">
                  <div className="flex items-center gap-2 px-2 mb-3">
                    <BarChart2 className="h-3 w-3 text-gray-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Admin</span>
                    <div className="flex-1 h-px bg-gray-200 " />
                  </div>

                  {adminMobileLinks.map((adminItem) => {
                    const Icon = adminItem.icon;
                    return (
                      <DisclosureButton
                        key={adminItem.to}
                        as={Link}
                        to={adminItem.to}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold w-full transition-all text-gray-700  bg-gray-50  hover:bg-gray-100 :bg-gray-800 hover:text-black :text-white"
                      >
                        <Icon className="h-4 w-4 text-gray-400 shrink-0" />
                        <div className="flex flex-col">
                          <span>{adminItem.label}</span>
                          <span className="text-[10px] opacity-40 uppercase tracking-widest font-black">{adminItem.sub}</span>
                        </div>
                      </DisclosureButton>
                    );
                  })}

                  <DisclosureButton
                    as={Link}
                    to="/admin/products"
                    className="flex items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-black w-full bg-black  text-white  hover:bg-gray-800 :bg-gray-100 shadow-md mt-3 transition-all active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                    New Product Entry
                  </DisclosureButton>
                </div>
              )}

              {/* Auth Actions */}
              {user ? (
                <div className="pt-4 border-t mt-3 border-gray-100 ">
                  <DisclosureButton
                    as="button"
                    onClick={() => { logout(); close(); }}
                    className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-3.5 text-sm font-black border border-gray-300  text-gray-700  bg-white  hover:bg-gray-100 :bg-gray-900 transition-all active:scale-95"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DisclosureButton>
                </div>
              ) : (
                <div className="pt-4 border-t mt-3 border-gray-100  space-y-2">
                  <DisclosureButton
                    as={Link}
                    to="/login"
                    id="mobile-login-btn"
                    className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-3.5 text-sm font-black border border-gray-300  text-gray-800  bg-white  hover:bg-gray-100 :bg-gray-900 transition-all active:scale-95"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </DisclosureButton>
                  <DisclosureButton
                    as={Link}
                    to="/signup"
                    id="mobile-signup-btn"
                    className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-3.5 text-sm font-black bg-black  text-white  hover:bg-gray-800 :bg-gray-200 shadow-md transition-all active:scale-95"
                  >
                    <UserPlus className="h-4 w-4" />
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
