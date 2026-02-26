import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { getAdminProducts, deleteAdminProduct, createAdminProduct, updateAdminProduct } from "../../api/admin.api";
import ConfirmModal from "../../components/Admin/ConfirmModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminProducts() {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({ 
    name: "", 
    description: "", 
    price: "",
    image: null,
    category: "cake",
    available: true
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: "" });

  const openAddModal = () => {
    setEditingId(null);
    setNewProduct({ name: "", description: "", price: "", image: null, category: "cake", available: true });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      image: null,
      category: product.category,
      available: product.available !== false
    });
    setImagePreview(product.image); // Show current image as initial preview
    setIsModalOpen(true);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAdminProducts(1, searchTerm);
      setProducts(data?.products || data || []); 
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const handleDelete = (product) => {
    setDeleteModal({
      isOpen: true,
      productId: product._id,
      productName: product.name
    });
  };

  const executeDelete = async () => {
    try {
      setLoading(true);
      await deleteAdminProduct(deleteModal.productId);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", Number(newProduct.price));
      formData.append("category", newProduct.category);
      formData.append("available", Boolean(newProduct.available));
      
      if (newProduct.image) {
        formData.append("image", newProduct.image);
      } else if (!editingId) {
        alert("Please select an image to upload");
        setSubmitting(false);
        return;
      }

      if (editingId) {
        await updateAdminProduct(editingId, formData);
      } else {
        await createAdminProduct(formData);
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      setNewProduct({ name: "", description: "", price: "", image: null, category: "cake", available: true });
      fetchProducts(); // Refresh
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("Error saving product. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={classNames(
            "text-2xl font-bold tracking-tight",
            theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text"
          )}>
            Products
          </h2>
          <p className={classNames(
            "mt-1 text-sm",
            theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted"
          )}>
            Manage your bakery catalog, prices, and stock.
          </p>
        </div>
        
        <button 
          onClick={openAddModal}
          className={classNames(
            "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            theme === "dark" 
              ? "bg-theme-dark-primary text-theme-dark-bg hover:brightness-110 focus-visible:outline-theme-dark-primary" 
              : "bg-theme-light-primary text-theme-light-text hover:brightness-95 focus-visible:outline-theme-light-primary"
          )}
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Product
        </button>
      </div>

      {/* Add Product Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={classNames(
            "w-full max-w-md rounded-2xl shadow-xl border max-h-[90vh] overflow-hidden flex flex-col",
            theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-theme-cream-solid border-rose-100"
          )}>
            {/* Loading Bar */}
            <div className="relative h-1 w-full overflow-hidden rounded-t-2xl bg-transparent">
              {submitting && (
                <div 
                  className="absolute h-full bg-rose-500 rounded-full"
                  style={{ animation: "loadingBar 1.5s ease-in-out infinite" }}
                />
              )}
            </div>
            <div className="p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className={classNames("text-xl font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => !submitting && setIsModalOpen(false)} disabled={submitting} className={classNames("p-1 rounded transition-colors", theme === "dark" ? "hover:bg-slate-800 text-slate-400" : "hover:bg-rose-50 text-gray-500", submitting && "opacity-40 cursor-not-allowed")}>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className={classNames("block text-sm font-medium mb-1", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Product Name</label>
                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className={classNames("w-full rounded-lg border-0 py-2 px-3 shadow-sm ring-1 ring-inset focus:ring-2", theme === "dark" ? "bg-slate-800 text-white ring-slate-700 focus:ring-rose-500" : "bg-theme-cream-solid text-gray-900 ring-rose-200 focus:ring-rose-500")} />
              </div>
              
              <div>
                <label className={classNames("block text-sm font-medium mb-1", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Description</label>
                <textarea required rows={2} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className={classNames("w-full rounded-lg border-0 py-2 px-3 shadow-sm ring-1 ring-inset focus:ring-2", theme === "dark" ? "bg-slate-800 text-white ring-slate-700 focus:ring-rose-500" : "bg-theme-cream-solid text-gray-900 ring-rose-200 focus:ring-rose-500")} />
              </div>

              <div>
                <label className={classNames("block text-sm font-medium mb-1", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Product Image {editingId && "(Leave blank to keep current)"}</label>
                
                {/* Image Preview Area */}
                <div className={classNames(
                  "mb-4 flex items-center justify-center h-48 rounded-xl border-2 border-dashed overflow-hidden relative group",
                  theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-rose-100"
                )}>
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full uppercase tracking-widest">New Image Selected</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <ImageIcon className={classNames("mx-auto h-12 w-12 mb-2", theme === "dark" ? "text-slate-600" : "text-gray-300")} />
                      <p className={classNames("text-xs", theme === "dark" ? "text-slate-500" : "text-gray-400")}>No image selected</p>
                    </div>
                  )}
                </div>

                <input 
                  required={!editingId} 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewProduct({...newProduct, image: file});
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }} 
                  className={classNames(
                    "w-full rounded-lg border-0 py-2 px-3 shadow-sm ring-1 ring-inset focus:ring-2", 
                    theme === "dark" ? "bg-slate-800 text-white ring-slate-700 focus:ring-rose-500" : "bg-theme-cream-solid text-gray-900 ring-rose-200 focus:ring-rose-500",
                    "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold text-xs",
                    theme === "dark" ? "file:bg-rose-500/10 file:text-rose-400 hover:file:bg-rose-500/20" : "file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                  )} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={classNames("block text-sm font-medium mb-1", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Category</label>
                  <select required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className={classNames("w-full rounded-lg border-0 py-2 px-3 shadow-sm ring-1 ring-inset focus:ring-2", theme === "dark" ? "bg-slate-800 text-white ring-slate-700 focus:ring-rose-500" : "bg-theme-cream-solid text-gray-900 ring-rose-200 focus:ring-rose-500")}>
                    {["cake", "pastry", "bread", "cookies", "cupcake", "other"].map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={classNames("block text-sm font-medium mb-1", theme === "dark" ? "text-slate-300" : "text-gray-700")}>Price (₹)</label>
                  <input required type="number" step="0.01" min="0" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className={classNames("w-full rounded-lg border-0 py-2 px-3 shadow-sm ring-1 ring-inset focus:ring-2", theme === "dark" ? "bg-slate-800 text-white ring-slate-700 focus:ring-rose-500" : "bg-theme-cream-solid text-gray-900 ring-rose-200 focus:ring-rose-500")} />
                </div>
              </div>

              <div className="flex items-center mt-2">
                <input type="checkbox" id="available" checked={newProduct.available} onChange={e => setNewProduct({...newProduct, available: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500 cursor-pointer" />
                <label htmlFor="available" className={classNames("ml-2 block text-sm cursor-pointer", theme === "dark" ? "text-slate-300" : "text-gray-900")}>Mark as Available</label>
              </div>
              
              <div className="mt-6">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className={classNames(
                    "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors",
                    theme === "dark" ? "bg-rose-500 text-white hover:bg-rose-400 focus:ring-rose-500 focus:ring-offset-slate-900" : "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500",
                    submitting && "opacity-75 cursor-not-allowed"
                  )}
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> {editingId ? "Updating..." : "Adding Product..."}</>
                  ) : (
                    editingId ? "Save Changes" : "Add Product"
                  )}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar / Search */}
      <div className={classNames(
        "flex items-center justify-between p-4 rounded-xl border shadow-sm transition-colors duration-300",
        theme === "dark" 
          ? "bg-theme-dark-card border-theme-dark-border" 
          : "bg-theme-light-card border-theme-light-border"
      )}>
        <div className="relative max-w-sm w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className={classNames("h-5 w-5", theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted")} aria-hidden="true" />
          </div>
          <input
            type="text"
            className={classNames(
              "block w-full rounded-lg border-0 py-2 pl-10 pr-3 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-colors",
              theme === "dark" 
                ? "bg-theme-dark-bg text-theme-dark-text ring-theme-dark-border placeholder:text-theme-dark-muted focus:ring-theme-dark-primary" 
                : "bg-theme-light-bg text-theme-light-text ring-theme-light-border placeholder:text-theme-light-muted focus:ring-theme-light-primary"
            )}
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table Area */}
      {loading ? (
        <div className={classNames(
          "flex flex-col items-center justify-center p-20 rounded-xl border shadow-sm transition-colors duration-300",
          theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-theme-light-card border-theme-light-border"
        )}>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent mb-4"></div>
          <p className={theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted"}>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className={classNames(
          "flex flex-col items-center justify-center p-20 rounded-xl border shadow-sm transition-colors duration-300",
          theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-theme-light-card border-theme-light-border"
        )}>
          <div className={classNames(
            "h-16 w-16 mb-4 rounded-full flex items-center justify-center",
            theme === "dark" ? "bg-theme-dark-bg text-theme-dark-muted" : "bg-theme-light-bg text-theme-light-muted"
          )}>
            <Search className="h-8 w-8" />
          </div>
          <h3 className={classNames("text-lg font-semibold", theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text")}>No products found</h3>
          <p className={classNames("mt-1 text-sm max-w-sm text-center", theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted")}>
            {searchTerm ? "Try adjusting your search query to find what you're looking for." : "Get started by adding your first bakery product."}
          </p>
        </div>
      ) : (
        <div className={classNames(
          "rounded-xl shadow-sm border overflow-hidden transition-colors duration-300",
          theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-theme-light-card border-theme-light-border"
        )}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className={classNames(
                theme === "dark" ? "bg-theme-dark-bg/50 text-theme-dark-muted" : "bg-theme-light-bg text-theme-light-muted"
              )}>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">Product</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Category</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Price</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                {products.map((product) => (
                  <tr key={product._id} className={classNames(
                    "transition-colors",
                    theme === "dark" ? "hover:bg-theme-dark-bg/50" : "hover:bg-theme-light-bg/50"
                  )}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {product.image ? (
                            <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.name} />
                          ) : (
                            <div className={classNames(
                              "flex h-10 w-10 items-center justify-center rounded-lg border",
                              theme === "dark" ? "bg-theme-dark-bg border-theme-dark-border" : "bg-theme-light-bg border-theme-light-border"
                            )}>
                              <ImageIcon className={classNames("h-5 w-5", theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted")} />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className={classNames("font-medium", theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text")}>
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={classNames("whitespace-nowrap px-3 py-4 text-sm", theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted")}>
                      <span className={classNames(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        theme === "dark" ? "bg-theme-dark-bg text-theme-dark-text ring-theme-dark-border" : "bg-theme-light-bg text-theme-light-text ring-theme-light-border"
                      )}>
                        {product.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className={classNames("whitespace-nowrap px-3 py-4 text-sm font-semibold", theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text")}>
                      ₹{product.price?.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={classNames(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                        product.available !== false
                          ? (theme === "dark" ? "bg-emerald-400/10 text-emerald-400" : "bg-emerald-50 text-emerald-700")
                          : (theme === "dark" ? "bg-rose-400/10 text-rose-400" : "bg-rose-50 text-rose-700")
                      )}>
                        {product.available !== false ? "Available" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className={classNames(
                        "mr-4 transition-colors",
                        theme === "dark" ? "text-theme-dark-primary hover:text-white" : "text-theme-light-primary hover:text-theme-light-text"
                      )}>
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit {product.name}</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(product)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete {product.name}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Custom Confirm Delete Modal */}
      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={executeDelete}
        title="Delete Product?"
        message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone.`}
        confirmText="Yes, Delete Product"
      />
    </div>
  );
}
