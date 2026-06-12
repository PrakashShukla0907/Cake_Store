import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut, Image as ImageIcon, X, CheckCircle, XCircle } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { logoutUser } from "../../api/auth.api";
import { useAdmin } from "../../context/AdminContext";

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
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
    { name: "Cancelled", href: "/admin/cancelled-orders", icon: XCircle },
    { name: "Users", href: "/admin/users", icon: Users },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col overflow-y-auto border-r border-gray-200 bg-white">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200">
        <Link to="/" className="text-xl font-black tracking-tight text-black">
          Gopal Bakers Admin
        </Link>
        <button
          type="button"
          className="lg:hidden -mr-2 p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-black focus:outline-none"
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
              className={`group flex items-center px-4 py-3 text-sm font-bold rounded-md transition-all ${
                isActive 
                  ? "bg-black text-white" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <item.icon
                className={`mr-3 flex-shrink-0 h-5 w-5 transition-transform group-hover:scale-110 ${
                  isActive ? "text-white" : "text-gray-400 group-hover:text-black"
                }`}
                aria-hidden="true"
              />
              {item.name}
              {item.name === "Orders" && pendingOrdersCount > 0 && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-black ring-2 ring-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 mt-auto space-y-4">
        {/* User Profile Summary */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="h-9 w-9 rounded-md flex items-center justify-center text-xs font-black bg-black text-white">
            {user?.name?.substring(0, 2).toUpperCase() || "AD"}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-bold truncate text-black">
              {user?.name || "Administrator"}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 truncate">
              {user?.role || "Admin"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="group flex w-full items-center px-4 py-3 text-sm font-bold rounded-md transition-all text-gray-600 hover:bg-gray-200 hover:text-black"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-black transition-transform group-hover:-translate-x-1" />
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
        <div className="relative z-100 lg:hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div 
            className="fixed inset-0 bg-black/60 transition-opacity" 
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
