import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/product.api";
import { useTheme } from "../../context/ThemeContext";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getProducts({ limit: 100 });
      setProducts(res.data.products || []);
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await createProduct(formData);
      }
      setFormData({ name: "", price: "", description: "" });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
      console.error("Form submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setLoading(true);
    setError("");

    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", price: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div
      className={classNames(
        "min-h-screen pb-12",
        theme === "dark"
          ? "bg-[#2B1B17] text-[#E5D3C5]"
          : "bg-linear-to-br from-pink-50 to-orange-50",
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2
            className={classNames(
              "text-3xl sm:text-4xl font-bold",
              theme === "dark" ? "text-[#B97A6A]" : "text-[#4A3728]",
            )}
          >
            🎂 Manage Products
          </h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className={classNames(
                "px-6 py-2 rounded-lg font-semibold transition",
                theme === "dark"
                  ? "bg-[#B97A6A] text-[#E5D3C5] hover:bg-[#9D6A5A]"
                  : "bg-pink-600 text-white hover:bg-pink-700",
              )}
            >
              ➕ Add New Product
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div
            className={classNames(
              "rounded-lg p-8 mb-8",
              theme === "dark"
                ? "bg-[#3A2A25]"
                : "bg-white border border-gray-200",
            )}
          >
            <h3 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Chocolate Cake"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={classNames(
                      "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                      theme === "dark"
                        ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5]"
                        : "bg-gray-50 border-gray-300 text-gray-900",
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="299"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="1"
                    step="0.01"
                    className={classNames(
                      "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                      theme === "dark"
                        ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5]"
                        : "bg-gray-50 border-gray-300 text-gray-900",
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Delicious homemade cake..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className={classNames(
                    "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition resize-none",
                    theme === "dark"
                      ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5]"
                      : "bg-gray-50 border-gray-300 text-gray-900",
                  )}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={classNames(
                    "flex-1 py-2 rounded-lg font-semibold transition",
                    theme === "dark"
                      ? "bg-[#B97A6A] text-[#E5D3C5] hover:bg-[#9D6A5A]"
                      : "bg-pink-600 text-white hover:bg-pink-700",
                  )}
                >
                  {loading
                    ? "🔄 Processing..."
                    : editingId
                      ? "✓ Update"
                      : "✓ Add"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className={classNames(
                    "flex-1 py-2 rounded-lg font-semibold transition",
                    theme === "dark"
                      ? "bg-[#2B1B17] text-[#E5D3C5] hover:bg-[#3A2A25]"
                      : "bg-gray-300 text-gray-800 hover:bg-gray-400",
                  )}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        {loading && !showForm ? (
          <div className="text-center py-16">
            <p className="text-lg opacity-70">Loading products... 🔄</p>
          </div>
        ) : products.length === 0 ? (
          <div
            className={classNames(
              "rounded-lg p-12 text-center",
              theme === "dark"
                ? "bg-[#3A2A25]"
                : "bg-white border border-gray-200",
            )}
          >
            <p className="text-lg mb-4">No products added yet</p>
            <button
              onClick={() => setShowForm(true)}
              className={classNames(
                "px-6 py-2 rounded-lg font-semibold transition",
                theme === "dark"
                  ? "bg-[#B97A6A] text-[#E5D3C5] hover:bg-[#9D6A5A]"
                  : "bg-pink-600 text-white hover:bg-pink-700",
              )}
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div
              className={classNames(
                "rounded-lg overflow-hidden",
                theme === "dark"
                  ? "bg-[#3A2A25]"
                  : "bg-white border border-gray-200",
              )}
            >
              <table className="w-full">
                <thead
                  className={classNames(
                    theme === "dark"
                      ? "bg-linear-to-r from-amber-900 to-orange-900 text-white"
                      : "bg-linear-to-r from-pink-500 to-orange-500 text-white",
                  )}
                >
                  <tr>
                    <th className="p-4 text-left font-bold">Name</th>
                    <th className="p-4 text-right font-bold">Price</th>
                    <th className="p-4 text-left font-bold">Description</th>
                    <th className="p-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product._id}
                      className={classNames(
                        "border-b transition hover:shadow-md",
                        index % 2 === 0
                          ? theme === "dark"
                            ? "bg-[#2B1B17]"
                            : "bg-gray-50"
                          : "",
                      )}
                    >
                      <td className="p-4 font-semibold">{product.name}</td>
                      <td className="p-4 text-right">
                        <span className="text-lg font-bold text-pink-600">
                          ₹{product.price}
                        </span>
                      </td>
                      <td className="p-4 text-sm opacity-75 max-w-xs truncate">
                        {product.description || "-"}
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="inline-block bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-semibold transition"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default AdminProducts;
