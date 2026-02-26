import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut, Image as ImageIcon, X, CheckCircle } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { logoutUser } from "../../api/auth.api";
import { useAdmin } from "../../context/AdminContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const { theme } = useTheme();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { pendingOrdersCount } = useAdmin();

  const handleLogout = async () => {
    try {
      if (window.confirm("Are you sure you want to logout?")) {
        await logoutUser();
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Banners", href: "/admin/banner", icon: ImageIcon },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Orders", href: "/admin/orders", icon: Package },
    { name: "Completed", href: "/admin/completed-orders", icon: CheckCircle },
    { name: "Users", href: "/admin/users", icon: Users },
  ];

  const sidebarContent = (
    <div className={classNames(
      "flex h-full flex-col overflow-y-auto border-r transition-colors duration-300",
      theme === "dark" 
        ? "bg-theme-dark-bg border-theme-dark-border" 
        : "bg-theme-light-bg border-theme-light-border"
    )}>
      {/* Brand */}
      <div className={classNames(
        "flex h-16 shrink-0 items-center justify-between px-6 border-b",
        theme === "dark" ? "border-theme-dark-border" : "border-theme-light-border"
      )}>
        <Link to="/" className={classNames(
          "text-xl font-bold tracking-tight",
          theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text"
        )}>
          GOPAL BAKERS Admin
        </Link>
        <button
          type="button"
          className="lg:hidden -mr-2 p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col mt-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = item.href === "/admin" 
            ? location.pathname === "/admin" 
            : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={classNames(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                isActive 
                  ? (theme === "dark" 
                      ? "bg-theme-dark-primary text-theme-dark-bg shadow-sm" 
                      : "bg-theme-light-primary text-theme-light-text shadow-sm")
                  : (theme === "dark" 
                      ? "text-theme-dark-muted hover:bg-theme-dark-card hover:text-theme-dark-text" 
                      : "text-theme-light-muted hover:bg-theme-light-card hover:text-theme-light-text")
              )}
            >
              <item.icon
                className={classNames(
                  "mr-3 flex-shrink-0 h-5 w-5 transition-transform group-hover:scale-110",
                  isActive 
                    ? (theme === "dark" ? "text-theme-dark-bg" : "text-theme-light-text") 
                    : (theme === "dark" ? "text-theme-dark-muted group-hover:text-theme-dark-text" : "text-theme-light-muted group-hover:text-theme-light-text")
                )}
                aria-hidden="true"
              />
              {item.name}
              {item.name === "Orders" && pendingOrdersCount > 0 && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 group-hover:scale-125 transition-transform" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className={classNames(
        "p-4 border-t mt-auto space-y-4",
        theme === "dark" ? "border-theme-dark-border bg-slate-900/50" : "border-theme-light-border bg-gray-50/50"
      )}>
        {/* User Profile Summary */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className={classNames(
            "h-9 w-9 rounded-full flex items-center justify-center text-xs font-black ring-2 ring-offset-2",
            theme === "dark" 
              ? "bg-rose-500 text-white ring-slate-900 ring-rose-500/20" 
              : "bg-rose-600 text-white ring-white ring-rose-500/10"
          )}>
            {user?.name?.substring(0, 2).toUpperCase() || "AD"}
          </div>
          <div className="flex flex-col min-w-0">
            <p className={classNames("text-sm font-bold truncate", theme === "dark" ? "text-white" : "text-slate-900")}>
              {user?.name || "Administrator"}
            </p>
            <p className={classNames("text-[10px] font-black uppercase tracking-widest opacity-60 truncate", theme === "dark" ? "text-rose-400" : "text-rose-600")}>
              {user?.role || "Admin"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className={classNames(
            "group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
            theme === "dark"
              ? "text-red-400 hover:bg-rose-500/10 hover:text-rose-400"
              : "text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm hover:shadow-red-500/5"
          )}
        >
          <LogOut className="mr-3 h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Hidden on small screens) */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:shadow-sm">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="relative z-[100] lg:hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-0 flex justify-start">
            <div className="relative flex w-full max-w-xs flex-1 transform transition ease-in-out duration-300 translate-x-0">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


