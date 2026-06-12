import { useEffect, useState, useRef } from "react";
import { getBanners, addBanner, removeBanner } from "../../api/banner.api";
import ConfirmModal from "../../components/Admin/ConfirmModal";
import { Image as ImageIcon, Plus, Trash2, Loader2, X } from "lucide-react";

const AdminBanners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    
    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, bannerId: null });
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getBanners();
            setBanners(res.data?.data || []);
        } catch (err) {
            setError("Failed to fetch banners");
            console.error("Fetch banners error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError("");
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("image", selectedFile);
            
            await addBanner(formData);
            await fetchBanners(); 
            handleCancelSelection(); // Reset after successful upload
        } catch (err) {
            setError(err.response?.data?.message || "Failed to upload banner");
            console.error("Upload banner error:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleCancelSelection = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDelete = (bannerId) => {
        setDeleteModal({ isOpen: true, bannerId });
    };

    const executeDelete = async () => {
        setLoading(true);
        setError("");

        try {
            await removeBanner(deleteModal.bannerId);
            await fetchBanners(); // Refresh to ensure synchronization 
        } catch (err) {
            setError("Failed to delete banner");
            console.error("Delete banner error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-black">
                        Manage Banners
                    </h2>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                        Upload landscape images to feature in the global promotional carousel.
                    </p>
                </div>
                <div>
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className={`inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-bold shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-black text-white hover:bg-gray-800 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {uploading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                        ) : (
                            <><Plus className="-ml-1 mr-2 h-5 w-5" /> Upload Image</>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
                    <span className="font-bold text-sm">{error}</span>
                </div>
            )}

            {/* Upload Progress Bar */}
            {uploading && (
                <div className="rounded-sm overflow-hidden h-1.5 w-full bg-gray-200">
                    <div 
                        className="h-full bg-black"
                        style={{ width: "100%", animation: "loadingBar 1.5s ease-in-out infinite" }}
                    />
                </div>
            )}

            {/* Pending Upload Preview */}
            {previewUrl && (
                <div className="group relative overflow-hidden rounded-md border-2 border-dashed transition-all duration-300 h-56 sm:h-64 bg-gray-50 border-gray-300">
                    <div className="relative z-20 h-full w-full flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-white text-[10px] font-black uppercase tracking-[3px] mb-4 bg-black px-3 py-1 rounded-sm shadow-sm">
                            New Banner Preview
                        </p>
                        <img src={previewUrl} alt="Preview Selection" className="h-24 w-auto object-contain mb-4 shadow-sm bg-white p-1 rounded-sm border border-gray-200" />
                        <div className="flex gap-2 w-full justify-center">
                            <button 
                                onClick={handleUpload}
                                disabled={uploading}
                                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                            >
                                {uploading ? <Loader2 className="h-3 w-3 animate-spin"/> : <Plus className="h-3 w-3"/>}
                                {uploading ? "Uploading..." : "Confirm Upload"}
                            </button>
                            <button 
                                onClick={handleCancelSelection}
                                disabled={uploading}
                                className="bg-white border border-gray-300 hover:bg-gray-100 text-black px-4 py-2 rounded-md text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                            >
                                <X className="h-3 w-3"/> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner Grid / Empty State */}
            {loading && banners.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 rounded-md border border-gray-200 bg-white shadow-sm">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black mb-4"></div>
                    <p className="font-medium text-gray-500">Loading banners...</p>
                </div>
            ) : banners.length === 0 && !previewUrl ? (
                <div className="flex flex-col items-center justify-center p-20 rounded-md border border-gray-200 bg-white shadow-sm">
                    <div className="h-16 w-16 mb-4 rounded-md flex items-center justify-center bg-gray-50 text-gray-400">
                        <ImageIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-black text-black">No banners uploaded yet</h3>
                    <p className="mt-1 text-sm max-w-sm text-center font-medium text-gray-500">
                        Upload a landscape image to act as the global promotional banner carousel.
                    </p>
                </div>
            ) : banners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner, index) => (
                        <div key={banner._id} className="rounded-md overflow-hidden shadow-sm border border-gray-200 bg-gray-50 relative group transition-colors duration-300 h-48 sm:h-56 flex items-center justify-center">
                            {/* Crisp Foreground Image */}
                            <img 
                                src={banner.image} 
                                alt={`Banner ${index}`} 
                                className="w-full h-full object-contain relative z-20" 
                            />
                            
                            {/* Admin Controls Overlay */}
                            <div className="absolute inset-x-0 bottom-0 z-30 p-3 flex justify-between items-end">
                                <span className="text-black bg-white border border-gray-200 text-[10px] font-black uppercase tracking-[2px] shadow-sm px-2 py-1 rounded-sm">
                                    Slide {index + 1}
                                </span>
                                <button 
                                    onClick={() => handleDelete(banner._id)}
                                    className="bg-white hover:bg-red-50 text-red-600 border border-red-200 p-2 rounded-md shadow-sm transition-all hover:scale-105"
                                    title="Delete Banner"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={executeDelete}
                title="Remove Banner?"
                message="Are you sure you want to remove this promotional banner? This will remove it from the homepage immediately."
                confirmText="Yes, Remove"
            />
        </div>
    );
};

export default AdminBanners;
