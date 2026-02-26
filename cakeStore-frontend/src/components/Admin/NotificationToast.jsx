import React, { useEffect, useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function NotificationToast({ notification, onClose }) {
  const { theme } = useTheme();
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
    <div className={classNames(
      "fixed bottom-6 right-6 z-[100] max-w-sm w-full transform transition-all duration-300 ease-out flex items-center gap-4 p-4 rounded-2xl shadow-2xl border",
      visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95",
      theme === "dark" ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-rose-100 text-gray-900"
    )}>
      <div className={classNames(
        "flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20"
      )}>
        <ShoppingBag className="h-5 w-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold uppercase tracking-wider text-rose-500 mb-1">New Order Received!</p>
        <p className={classNames(
            "text-sm truncate font-medium",
            theme === "dark" ? "text-slate-300" : "text-gray-600"
        )}>
          {notification.message}
        </p>
      </div>

      <button 
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className={classNames(
          "flex-shrink-0 p-1 rounded-lg transition-colors",
          theme === "dark" ? "text-slate-500 hover:bg-slate-800 hover:text-slate-300" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
