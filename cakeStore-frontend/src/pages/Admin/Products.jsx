import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { getAdminProducts, deleteAdminProduct, createAdminProduct, updateAdminProduct } from "../../api/admin.api";
import ConfirmModal from "../../components/Admin/ConfirmModal";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  
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

  const fetchProducts = async (pageNum, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const data = await getAdminProducts(pageNum, searchTerm);
      const fetchedProducts = data?.products || data || [];
      
      setProducts(prev => reset ? fetchedProducts : [...prev, ...fetchedProducts]);
      setHasMore(data?.page < data?.pages);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    // Reset to page 1 when search term changes
    fetchProducts(1, true);
  }, [searchTerm]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchProducts(page + 1);
        }
      },
      { threshold: 1.0 }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, searchTerm]);

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
      fetchProducts(1, true); // Refresh from page 1
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
      fetchProducts(1, true); // Refresh from page 1 after save
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
          <h2 className="text-2xl font-black tracking-tight text-black">
            Products
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Manage your bakery catalog, prices, and stock.
          </p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-bold shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-black text-white hover:bg-gray-800"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Product
        </button>
      </div>

      {/* Add Product Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-md shadow-xl border bg-white border-gray-200 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Loading Bar */}
            <div className="relative h-1 w-full overflow-hidden bg-transparent">
              {submitting && (
                <div 
                  className="absolute h-full bg-black rounded-full"
                  style={{ width: "100%", animation: "loadingBar 1.5s ease-in-out infinite" }}
                />
              )}
            </div>
            <div className="p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-black">
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => !submitting && setIsModalOpen(false)} disabled={submitting} className={`p-1 rounded transition-colors hover:bg-gray-100 text-gray-500 ${submitting ? "opacity-40 cursor-not-allowed" : ""}`}>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-black">Product Name</label>
                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:ring-1 focus:ring-black focus:border-black bg-white text-black" />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1 text-black">Description</label>
                <textarea required rows={2} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:ring-1 focus:ring-black focus:border-black bg-white text-black" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-black">Product Image {editingId && "(Leave blank to keep current)"}</label>
                
                {/* Image Preview Area */}
                <div className="mb-4 flex items-center justify-center h-48 rounded-md border-2 border-dashed overflow-hidden relative group bg-gray-50 border-gray-300">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain bg-white" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-[10px] font-black bg-black px-3 py-1 rounded-sm uppercase tracking-[3px]">New Image Selected</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <ImageIcon className="mx-auto h-12 w-12 mb-2 text-gray-400" />
                      <p className="text-xs font-bold text-gray-500">No image selected</p>
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
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:ring-1 focus:ring-black focus:border-black bg-white text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-black hover:file:bg-gray-200 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-black">Category</label>
                  <select required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:ring-1 focus:ring-black focus:border-black bg-white text-black">
                    {["cake", "pastry", "bread", "cookies", "cupcake", "other"].map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-black">Price (₹)</label>
                  <input required type="number" step="0.01" min="0" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:ring-1 focus:ring-black focus:border-black bg-white text-black" />
                </div>
              </div>

              <div className="flex items-center mt-2">
                <input type="checkbox" id="available" checked={newProduct.available} onChange={e => setNewProduct({...newProduct, available: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer" />
                <label htmlFor="available" className="ml-2 block text-sm font-bold cursor-pointer text-black">Mark as Available</label>
              </div>
              
              <div className="mt-6">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md shadow-sm text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors bg-black text-white hover:bg-gray-800 focus:ring-black ${submitting ? "opacity-75 cursor-not-allowed" : ""}`}
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
      <div className="flex items-center justify-between p-4 rounded-md border border-gray-200 bg-white shadow-sm">
        <div className="relative max-w-sm w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 shadow-sm bg-white text-black placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black sm:text-sm sm:leading-6 transition-colors"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 rounded-md border border-gray-200 bg-white shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black mb-4"></div>
          <p className="font-medium text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 rounded-md border border-gray-200 bg-white shadow-sm">
          <div className="h-16 w-16 mb-4 rounded-md flex items-center justify-center bg-gray-50 text-gray-400">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-black text-black">No products found</h3>
          <p className="mt-1 text-sm max-w-sm text-center font-medium text-gray-500">
            {searchTerm ? "Try adjusting your search query to find what you're looking for." : "Get started by adding your first bakery product."}
          </p>
        </div>
      ) : (
        <div className="rounded-md shadow-sm border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-hidden sm:overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 block sm:table">
              <thead className="bg-gray-50 text-gray-500 hidden sm:table-header-group">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-black uppercase tracking-widest sm:pl-6">Product</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-widest">Category</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-widest">Price</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-black uppercase tracking-widest">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 block sm:table-row-group">
                {products.map((product) => (
                  <tr key={product._id} className="transition-all hover:bg-gray-50 block sm:table-row border-b border-gray-200 sm:border-0 p-4 sm:p-0">
                    <td className="whitespace-nowrap py-2 sm:py-4 pl-0 sm:pl-6 pr-0 sm:pr-3 flex justify-between items-center sm:table-cell border-b border-gray-100 sm:border-0">
                      <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-gray-400">Product</span>
                      <div className="flex items-center text-right sm:text-left">
                        <div className="h-10 w-10 flex-shrink-0">
                          {product.image ? (
                            <img className="h-10 w-10 rounded-md object-cover border border-gray-200 bg-white" src={product.image} alt={product.name} />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-bold text-black max-w-[150px] sm:max-w-none truncate">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-2 sm:py-4 px-0 sm:px-3 flex justify-between items-center sm:table-cell border-b border-gray-100 sm:border-0">
                      <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-gray-400">Category</span>
                      <span className="inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-700 border border-gray-200">
                        {product.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-2 sm:py-4 px-0 sm:px-3 flex justify-between items-center sm:table-cell border-b border-gray-100 sm:border-0">
                      <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-gray-400">Price</span>
                      <span className="text-sm font-black text-black">
                        ₹{product.price?.toFixed(2)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-2 sm:py-4 px-0 sm:px-3 flex justify-between items-center sm:table-cell border-b border-gray-100 sm:border-0">
                      <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-gray-400">Status</span>
                      <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                        product.available !== false
                          ? "bg-black text-white"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {product.available !== false ? "Available" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-3 sm:py-4 pl-0 sm:pl-3 pr-0 sm:pr-6 flex justify-between sm:justify-end items-center sm:table-cell">
                      <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</span>
                      <div className="flex gap-4 sm:gap-0">
                        <button 
                          onClick={() => handleEditClick(product)}
                          className="sm:mr-4 transition-colors text-black hover:text-gray-600 p-2 sm:p-0 rounded-md border border-gray-200 sm:border-0 hover:bg-gray-100 sm:hover:bg-transparent"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit {product.name}</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2 sm:p-0 rounded-md border border-gray-200 sm:border-0 hover:bg-red-50 sm:hover:bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete {product.name}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Intersection Observer Target for Infinite Scroll */}
          {products.length > 0 && (
            <div 
              ref={observerTarget} 
              className="py-4 flex justify-center items-center h-16 bg-white border-t border-gray-100"
            >
              {loadingMore ? (
                <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading more...
                </div>
              ) : !hasMore ? (
                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">End of results</span>
              ) : null}
            </div>
          )}
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
