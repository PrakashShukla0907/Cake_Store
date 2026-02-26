import { useEffect, useState, useRef } from "react";
import { getBanners, addBanner, removeBanner } from "../../api/banner.api";
import { useTheme } from "../../context/ThemeContext";
import ConfirmModal from "../../components/Admin/ConfirmModal";
import { Image as ImageIcon, Plus, Trash2, Loader2, X } from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AdminBanners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    
    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, bannerId: null });
    const { theme } = useTheme();
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
                    <h2 className={classNames(
                        "text-2xl font-bold tracking-tight",
                        theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text"
                    )}>
                        Manage Banners
                    </h2>
                    <p className={classNames(
                        "mt-1 text-sm",
                        theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted"
                    )}>
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
                        className={classNames(
                            "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                            theme === "dark" 
                              ? "bg-theme-dark-primary text-theme-dark-bg hover:brightness-110 focus-visible:outline-theme-dark-primary" 
                              : "bg-theme-light-primary text-theme-light-text hover:brightness-95 focus-visible:outline-theme-light-primary",
                            uploading && "opacity-50 cursor-not-allowed"
                        )}
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
                <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 px-4 py-3 rounded-xl mb-6 flex items-center">
                    <span className="font-semibold text-sm">{error}</span>
                </div>
            )}

            {/* Upload Progress Bar */}
            {uploading && (
                <div className={classNames(
                    "rounded-xl overflow-hidden h-1.5 w-full",
                    theme === "dark" ? "bg-slate-700" : "bg-rose-100"
                )}>
                    <div 
                        className="h-full bg-rose-500 rounded-xl"
                        style={{ animation: "loadingBar 1.5s ease-in-out infinite" }}
                    />
                </div>
            )}

            {/* Pending Upload Preview — always visible when a file is selected */}
            {previewUrl && (
                <div className={classNames(
                    "group relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 h-56 sm:h-64",
                    theme === "dark" 
                        ? "bg-slate-900/80 border-rose-500/50" 
                        : "bg-rose-50/50 border-rose-400/50"
                )}>
                    {/* Blurred backdrop */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img src={previewUrl} alt="" className="w-full h-full object-cover scale-110 opacity-40 blur-xl saturate-150" aria-hidden="true" />
                        <div className="absolute inset-0 bg-black/40 z-10" />
                    </div>
                    
                    <div className="relative z-20 h-full w-full flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-white text-xs font-bold uppercase tracking-widest mb-4 bg-rose-500 px-3 py-1 rounded-full shadow-lg">
                            New Banner Preview
                        </p>
                        <img src={previewUrl} alt="Preview Selection" className="h-24 w-auto object-contain mb-4 drop-shadow-xl" />
                        <div className="flex gap-2 w-full justify-center">
                            <button 
                                onClick={handleUpload}
                                disabled={uploading}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all disabled:opacity-50"
                            >
                                {uploading ? <Loader2 className="h-3 w-3 animate-spin"/> : <Plus className="h-3 w-3"/>}
                                {uploading ? "Uploading..." : "Confirm Upload"}
                            </button>
                            <button 
                                onClick={handleCancelSelection}
                                disabled={uploading}
                                className="bg-theme-cream-solid/20 hover:bg-theme-cream-solid/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                            >
                                <X className="h-3 w-3"/> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner Grid / Empty State */}
            {loading && banners.length === 0 ? (
                <div className={classNames(
                    "flex flex-col items-center justify-center p-20 rounded-xl border shadow-sm transition-colors duration-300",
                    theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-theme-light-card border-theme-light-border"
                )}>
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent mb-4"></div>
                    <p className={theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted"}>Loading banners...</p>
                </div>
            ) : banners.length === 0 && !previewUrl ? (
                <div className={classNames(
                    "flex flex-col items-center justify-center p-20 rounded-xl border shadow-sm transition-colors duration-300",
                    theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-theme-light-card border-theme-light-border"
                )}>
                    <div className={classNames(
                        "h-16 w-16 mb-4 rounded-full flex items-center justify-center",
                        theme === "dark" ? "bg-theme-dark-bg text-theme-dark-muted" : "bg-theme-light-bg text-theme-light-muted"
                    )}>
                        <ImageIcon className="h-8 w-8" />
                    </div>
                    <h3 className={classNames("text-lg font-semibold", theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text")}>No banners uploaded yet</h3>
                    <p className={classNames("mt-1 text-sm max-w-sm text-center", theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted")}>
                        Upload a landscape image to act as the global promotional banner carousel.
                    </p>
                </div>
            ) : banners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner, index) => (
                        <div key={banner._id} className={classNames(
                            "rounded-xl overflow-hidden shadow-sm border relative group transition-colors duration-300 h-48 sm:h-56 flex items-center justify-center",
                            theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-slate-900 border-theme-light-border"
                        )}>
                            {/* Blurred Backdrop */}
                            <div className="absolute inset-0 overflow-hidden">
                                <img 
                                    src={banner.image} 
                                    alt="" 
                                    className="w-full h-full object-cover scale-110 opacity-40 blur-xl saturate-150"
                                    aria-hidden="true"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            </div>

                            {/* Crisp Foreground Image */}
                            <img 
                                src={banner.image} 
                                alt={`Banner ${index}`} 
                                className="w-full h-full object-contain relative z-20 drop-shadow-lg transition-transform duration-500 group-hover:scale-[1.03]" 
                            />
                            
                            {/* Admin Controls Overlay */}
                            <div className="absolute inset-x-0 bottom-0 z-30 p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end">
                                <span className="text-white text-sm font-semibold drop-shadow-md bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
                                    Carousel Item {index + 1}
                                </span>
                                <button 
                                    onClick={() => handleDelete(banner._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full transition transform hover:scale-110 shadow-lg border border-red-400/50"
                                    title="Delete Banner"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            {/* Custom Confirm Delete Modal */}
            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={executeDelete}
                title="Remove Banner?"
                message="Are you sure you want to remove this promotional banner? This will remove it from the homepage immediately."
                confirmText="Yes, Remove Banner"
            />
        </div>
    );
};

export default AdminBanners;
