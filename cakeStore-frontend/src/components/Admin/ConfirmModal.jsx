import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-md bg-white shadow-2xl transition-all border border-gray-200 animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-black leading-6 mb-2 text-black">
                {title}
              </h3>
              <p className="text-sm font-medium text-gray-500">
                {message}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-md p-1 transition-colors text-gray-400 hover:bg-gray-100 hover:text-gray-500"
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
              className="inline-flex w-full justify-center rounded-md bg-black px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-gray-800 transition-colors sm:w-auto"
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full justify-center rounded-md px-4 py-2.5 text-sm font-bold shadow-sm transition-all sm:w-auto border bg-white text-black border-gray-300 hover:bg-gray-50"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
