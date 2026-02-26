import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/product.api";
import ProductCard from "../components/ProductCard";
import { useTheme } from "../context/ThemeContext";
import { FaSearch } from "react-icons/fa";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme } = useTheme();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  const fetchProducts = async (page = 1, search = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await getProducts({
        page,
        limit: 12,
        ...(search && { search }),
      });

      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (value) => {
    setSearchParams({
      ...(value && { search: value }),
      page: 1,
    });
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    params.set("page", page);
    setSearchParams(params);
  };

  return (
    <div
      className={classNames(
        "min-h-screen pb-12 transition-colors duration-300",
        theme === "dark"
          ? "bg-slate-900 text-slate-200"
          : "bg-theme-cream-gradient text-slate-800",
      )}
    >

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-8 font-medium shadow-sm flex items-center gap-2">
            <span className="shrink-0">⚠️</span> {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
            <p className="text-xl font-medium opacity-70">Loading delicious cakes...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-theme-cream-solid/50 dark:bg-slate-800/10 backdrop-blur-sm rounded-3xl border border-white/50 dark:border-slate-700 shadow-xl">
            <p className="text-5xl mb-6">😢</p>
            <h3 className="text-2xl font-bold mb-2">No cakes found</h3>
            <p className="opacity-70 font-medium">
              {searchQuery
                ? `We couldn't find any cakes matching "${searchQuery}"`
                : "Check back soon for freshly baked goods!"}
            </p>
          </div>
        ) : (
          <>
            {searchQuery && (
              <div className="mb-10 flex items-center justify-between">
                <h2
                  className={classNames(
                    "text-3xl sm:text-4xl font-extrabold tracking-tight",
                    theme === "dark" 
                      ? "text-white" 
                      : "bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent"
                  )}
                >
                  Results for "{searchQuery}"
                </h2>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap mt-8">
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={classNames(
                      "px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
                      theme === "dark"
                        ? "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
                        : "bg-theme-cream-solid text-slate-700 hover:text-rose-600 border border-rose-100 hover:border-rose-200",
                    )}
                  >
                    ← Prev
                  </button>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={classNames(
                        "w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all shadow-sm",
                        currentPage === page
                          ? theme === "dark"
                            ? "bg-rose-500 text-white shadow-rose-900/20"
                            : "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-200"
                          : theme === "dark"
                            ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                            : "bg-theme-cream-solid text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-gray-100",
                      )}
                    >
                      {page}
                    </button>
                  ),
                )}

                {currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={classNames(
                      "px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
                      theme === "dark"
                        ? "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
                        : "bg-theme-cream-solid text-slate-700 hover:text-rose-600 border border-rose-100 hover:border-rose-200",
                    )}
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
