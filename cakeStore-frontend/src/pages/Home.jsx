import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/product.api";
import ProductCard from "../components/ProductCard";
import { Filter } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";

  const categories = ["All", "cake", "pastry", "bread", "cookies", "cupcake", "other"];

  const fetchProducts = async (page = 1, search = "", category = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await getProducts({ 
        page, 
        limit: 12, 
        ...(search && { search }),
        ...(category && { category })
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

  useEffect(() => { fetchProducts(currentPage, searchQuery, categoryParam); }, [currentPage, searchQuery, categoryParam]);

  const handlePageChange = (page) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (categoryParam) params.set("category", categoryParam);
    params.set("page", page);
    setSearchParams(params);
  };

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (category) params.set("category", category);
    params.set("page", 1);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Error */}
        {error && (
          <div className="border border-gray-300 bg-gray-50 text-gray-800 px-4 py-3 rounded-md mb-8 text-sm font-medium flex items-center gap-2">
            <span className="font-black">!</span> {error}
          </div>
        )}

        {/* Search result heading */}
        {searchQuery && !loading && (
          <div className="mb-8 pb-6 border-b border-gray-100">
            <h2 className="text-2xl font-black text-black tracking-tight">
              Results for &ldquo;{searchQuery}&rdquo;
            </h2>
            <p className="text-sm text-gray-500 mt-1">{products.length} cake{products.length !== 1 ? "s" : ""} found</p>
          </div>
        )}

        {/* Filter Section */}
        <div className="flex flex-wrap gap-2 mb-8 items-center border-b border-gray-100 pb-6">
          <span className="text-sm font-bold text-gray-500 mr-2 flex items-center gap-2">
             <Filter className="h-4 w-4" /> Filter:
          </span>
          {categories.map((cat) => {
            const isSelected = categoryParam === cat || (cat === "All" && !categoryParam);
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat === "All" ? "" : cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                  isSelected
                    ? "bg-black text-white border-black shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Loading...</p>
          </div>

        /* Empty */
        ) : products.length === 0 ? (
          <div className="text-center py-28 border border-gray-100 rounded-lg bg-gray-50">
            <p className="text-5xl mb-4">😢</p>
            <h3 className="text-xl font-black text-black mb-2">No cakes found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? `We couldn't find any cakes matching "${searchQuery}"`
                : "Check back soon for freshly baked goods!"}
            </p>
          </div>

        /* Products grid */
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-14">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 rounded-md border border-gray-300 text-sm font-bold text-black bg-white hover:bg-gray-50 hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-black transition-all border ${
                      currentPage === page
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 rounded-md border border-gray-300 text-sm font-bold text-black bg-white hover:bg-gray-50 hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
