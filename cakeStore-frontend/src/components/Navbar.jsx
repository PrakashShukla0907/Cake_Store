import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { logoutUser } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/logo_bakery.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigationItems = [
    { name: "🏠 Home", href: "/" },
    ...(user ? [{ name: "📦 My Orders", href: "/orders" }] : []),
    ...(user ? [{ name: "🛒 Cart", href: "/cart" }] : []),
  ];

  return (
    <Disclosure
      as="nav"
      className={classNames(
        "sticky top-0 z-50",
        theme === "dark"
          ? "bg-amber-900 text-amber-50"
          : "bg-amber-800 text-white",
      )}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            {/* <span className="text-2xl">🍰</span>
            <span className="text-xl font-bold hidden sm:inline">
              CakeStore
            </span> */}
            <img
              src={logo}
              alt="website logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-white hover:text-amber-100 transition font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Items */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Admin Link */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="hidden sm:inline px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
              >
                👨‍💼 Admin
              </Link>
            )}

            {/* Auth Links */}
            {!loading && (
              <>
                {!user ? (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      className="px-4 py-2 rounded-lg bg-white text-amber-800 font-medium hover:bg-amber-50 transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="hidden sm:block px-4 py-2 rounded-lg border border-white text-white hover:bg-white/10 font-medium transition"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition text-white"
                  >
                    <span className="hidden sm:inline text-sm font-medium">
                      {user.name}
                    </span>
                    <FaSignOutAlt className="text-lg" />
                  </button>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <DisclosureButton className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-2 focus:outline-offset-2 focus:outline-white transition">
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
      <DisclosurePanel className="sm:hidden border-t border-white/20">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigationItems.map((item) => (
            <DisclosureButton
              key={item.href}
              as={Link}
              to={item.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-white/10 transition w-full text-left"
            >
              {item.name}
            </DisclosureButton>
          ))}

          {user?.role === "admin" && (
            <DisclosureButton
              as={Link}
              to="/admin"
              className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-white/10 transition w-full text-left bg-red-600/20"
            >
              👨‍💼 Admin Dashboard
            </DisclosureButton>
          )}

          {user && (
            <DisclosureButton
              as="button"
              onClick={handleLogout}
              className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-white hover:bg-white/10 transition"
            >
              Logout
            </DisclosureButton>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
