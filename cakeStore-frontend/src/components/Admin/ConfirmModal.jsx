import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={classNames(
        "relative w-full max-w-md transform overflow-hidden rounded-2xl shadow-2xl transition-all border animate-in fade-in zoom-in duration-300",
        theme === "dark" ? "bg-slate-900 border-slate-700 shadow-slate-950/50" : "bg-white border-rose-100 shadow-rose-200/50"
      )}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={classNames(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
              theme === "dark" ? "bg-rose-500/10 text-rose-500" : "bg-rose-100 text-rose-600"
            )}>
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            
            <div className="flex-1">
              <h3 className={classNames(
                "text-lg font-bold leading-6 mb-2",
                theme === "dark" ? "text-white" : "text-gray-900"
              )}>
                {title}
              </h3>
              <p className={classNames(
                "text-sm",
                theme === "dark" ? "text-slate-400" : "text-gray-500"
              )}>
                {message}
              </p>
            </div>

            <button
              onClick={onClose}
              className={classNames(
                "rounded-lg p-1 transition-colors",
                theme === "dark" ? "text-slate-500 hover:bg-slate-800 hover:text-slate-400" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              )}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="inline-flex w-full justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-rose-500 transition-colors sm:w-auto"
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={classNames(
                "inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition-all sm:w-auto border",
                theme === "dark" 
                  ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white" 
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
