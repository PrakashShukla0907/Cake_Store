import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const AdminDashboard = () => {
  const { theme } = useTheme();

  return (
    <div
      className={classNames(
        "min-h-screen pb-12",
        theme === "dark"
          ? "bg-[#2B1B17] text-[#E5D3C5]"
          : "bg-linear-to-br  from-purple-50 to-indigo-50",
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1
            className={classNames(
              "text-5xl font-bold mb-3",
              theme === "dark" ? "text-[#B97A6A]" : "text-gray-800",
            )}
          >
            👨‍💼 Admin Dashboard
          </h1>
          <p
            className={
              theme === "dark" ? "text-[#D4C5B9]" : "text-xl text-gray-600"
            }
          >
            Manage your store efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/admin/products"
            className={classNames(
              "rounded-lg p-8 group cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl",
              theme === "dark"
                ? "bg-[#3A2A25] hover:shadow-xl"
                : "bg-white border border-gray-200",
            )}
          >
            <div className="flex items-center gap-4">
              <div className="text-6xl">🎂</div>
              <div>
                <h3
                  className={classNames(
                    "text-2xl font-bold transition",
                    theme === "dark"
                      ? "text-[#E5D3C5] group-hover:text-pink-400"
                      : "text-gray-800 group-hover:text-pink-600",
                  )}
                >
                  Manage Products
                </h3>
                <p
                  className={
                    theme === "dark"
                      ? "text-[#D4C5B9] mt-2"
                      : "text-gray-600 mt-2"
                  }
                >
                  Add, edit, or remove cake products from your store
                </p>
              </div>
            </div>
            <div
              className={classNames(
                "mt-4 flex items-center font-semibold group-hover:translate-x-2 transition",
                theme === "dark" ? "text-pink-400" : "text-pink-600",
              )}
            >
              View Products →
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className={classNames(
              "rounded-lg p-8 group cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl",
              theme === "dark"
                ? "bg-[#3A2A25] hover:shadow-xl"
                : "bg-white border border-gray-200",
            )}
          >
            <div className="flex items-center gap-4">
              <div className="text-6xl">📋</div>
              <div>
                <h3
                  className={classNames(
                    "text-2xl font-bold transition",
                    theme === "dark"
                      ? "text-[#E5D3C5] group-hover:text-blue-400"
                      : "text-gray-800 group-hover:text-blue-600",
                  )}
                >
                  Manage Orders
                </h3>
                <p
                  className={
                    theme === "dark"
                      ? "text-[#D4C5B9] mt-2"
                      : "text-gray-600 mt-2"
                  }
                >
                  View and update order statuses and customer information
                </p>
              </div>
            </div>
            <div
              className={classNames(
                "mt-4 flex items-center font-semibold group-hover:translate-x-2 transition",
                theme === "dark" ? "text-blue-400" : "text-blue-600",
              )}
            >
              View Orders →
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default AdminDashboard;
