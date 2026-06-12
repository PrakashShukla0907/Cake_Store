import React, { useEffect, useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';

export default function NotificationToast({ notification, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for transition
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-[100] max-w-sm w-full transform transition-all duration-300 ease-out flex items-center gap-4 p-4 rounded-md shadow-2xl border border-gray-200 bg-white text-black ${visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"}`}>
      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-black text-white shadow-sm">
        <ShoppingBag className="h-5 w-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">New Order Received!</p>
        <p className="text-sm truncate font-bold text-black">
          {notification.message}
        </p>
      </div>

      <button 
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="flex-shrink-0 p-1 rounded-md transition-colors text-gray-400 hover:bg-gray-100 hover:text-black"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
