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
        "min-h-screen pb-12",
        theme === "dark"
          ? "bg-[#2B1B17] text-[#E5D3C5]"
          : "bg-[#F9F1E7] text-[#4A3728]",
      )}
    >
      {/* Hero Section */}
      <div
        className={classNames(
          "py-12 px-4",
          theme === "dark"
            ? "bg-linear-to-r  from-amber-900 to-orange-900"
            : "bg-linear-to-r  from-pink-500 to-orange-500",
        )}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            🍰 Welcome to CakeStore
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Delicious homemade cakes crafted with love
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cakes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={classNames(
                  "w-full px-4 py-3 pl-12 rounded-lg border-2 focus:outline-none transition",
                  theme === "dark"
                    ? "bg-[#3A2A25] border-[#B97A6A] text-[#E5D3C5] placeholder-[#9D6A5A]"
                    : "bg-white border-pink-300 text-gray-800 placeholder-gray-400",
                )}
              />
              <FaSearch className="absolute left-4 top-4 text-lg opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <p className="text-xl opacity-70">Loading delicious cakes... 🔄</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl mb-4">😢 No cakes found</p>
            <p className="opacity-70">
              {searchQuery
                ? "Try a different search term"
                : "Come back soon for fresh cakes!"}
            </p>
          </div>
        ) : (
          <>
            <h2
              className={classNames(
                "text-3xl font-bold mb-8",
                theme === "dark" ? "text-[#B97A6A]" : "text-[#4A3728]",
              )}
            >
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Featured Cakes"}
            </h2>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap">
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={classNames(
                      "px-4 py-2 rounded-lg font-semibold transition",
                      theme === "dark"
                        ? "bg-[#B97A6A] text-[#E5D3C5] hover:bg-[#9D6A5A]"
                        : "bg-pink-500 text-white hover:bg-pink-600",
                    )}
                  >
                    ← Previous
                  </button>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={classNames(
                        "px-3 py-2 rounded-lg font-semibold transition",
                        currentPage === page
                          ? theme === "dark"
                            ? "bg-[#B97A6A] text-[#E5D3C5]"
                            : "bg-pink-600 text-white"
                          : theme === "dark"
                            ? "bg-[#3A2A25] text-[#E5D3C5] hover:bg-[#4A3A35]"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300",
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
                      "px-4 py-2 rounded-lg font-semibold transition",
                      theme === "dark"
                        ? "bg-[#B97A6A] text-[#E5D3C5] hover:bg-[#9D6A5A]"
                        : "bg-pink-500 text-white hover:bg-pink-600",
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
