import React, { useState, useEffect } from "react";
import { getBanners } from "../api/banner.api";

export default function OfferBanner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getBanners();
        setBanners(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };
    fetchBanners();
  }, []);

  // Auto-slide every 5s — no manual controls
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    /* Outer container: horizontal rectangle with rounded corners, hidden overflow */
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
        {/* Slide track */}
        <div
          className="flex w-full aspect-2/1 sm:aspect-21/9 md:aspect-10/3 transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner._id}
              className="min-w-full h-full relative flex items-center justify-center bg-gray-50"
            >
              {/* Soft blurred backdrop to fill empty space if any */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  src={banner.image}
                  alt=""
                  className="w-full h-full object-cover scale-110 opacity-20 blur-xl"
                  aria-hidden="true"
                />
              </div>
              {/* Crisp foreground image - changed to object-contain so it never crops */}
              <img
                src={banner.image}
                alt={`Promotional Banner ${index + 1}`}
                className="w-full h-full object-cover relative z-10"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
