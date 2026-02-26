import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getBanners } from "../api/banner.api";

export default function OfferBanner() {
  const { theme } = useTheme();
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getBanners();
        const apiBanners = res.data?.data || [];
        setBanners(apiBanners);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };
    fetchBanners();
  }, []);

  // Auto-sliding interval
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // 5 seconds for better reading time

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-48 sm:h-64 md:h-80 lg:h-[450px] relative overflow-hidden group bg-slate-900">
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={banner._id} className="min-w-full h-full relative float-left outline-none flex items-center justify-center">
             {/* Background Blurred Image */}
             <div className="absolute inset-0 overflow-hidden">
                <img 
                  src={banner.image} 
                  alt="" 
                  className="w-full h-full object-cover scale-110 opacity-40 blur-2xl saturate-150"
                  aria-hidden="true"
                />
                {/* Subtle gradient overlay to darken edges */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
             </div>

             {/* Foreground Crisp Image (No cropping) */}
             <img 
              src={banner.image} 
              alt={`Promotional Banner ${index + 1}`} 
              className="w-full h-full object-contain relative z-10 drop-shadow-2xl transition-transform duration-700 ease-out hover:scale-[1.02]"
            />
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          {/* Controls Overlay Gradients using Theme colors */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Previous Button */}
          <button 
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-theme-cream-solid/10 text-white backdrop-blur-md border border-white/20 hover:bg-theme-cream-solid/20 opacity-0 lg:group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-xl"
            aria-label="Previous Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 ml-1 flex-shrink-0">
               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Next Button */}
          <button 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-theme-cream-solid/10 text-white backdrop-blur-md border border-white/20 hover:bg-theme-cream-solid/20 opacity-0 lg:group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-xl"
            aria-label="Next Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 mr-1 flex-shrink-0">
               <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          
          {/* Indicators */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-20 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full border border-white/10 shadow-lg">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex 
                    ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-theme-cream-solid shadow-[0_0_10px_rgba(255,255,255,0.7)]' 
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-theme-cream-solid/40 hover:bg-theme-cream-solid/60 hover:scale-110'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
