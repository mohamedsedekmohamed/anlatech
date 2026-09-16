import React from 'react';
import { useScrollLock } from "@/hooks/useScrollLock";
import { useTranslations } from "next-intl";

interface ConfirmDeleteProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ onConfirm, onCancel, title = "Delete Item", description = "Are you sure you want to delete this item? This action cannot be undone." }) => {
  useScrollLock(true);
  const t = useTranslations('admin.table');
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-black/50 p-4"
      onClick={onCancel}
    >
      <div 
        className="relative bg-background p-8 rounded-3xl shadow-xl max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* زر الإغلاق X */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-muted-foreground rtl:right-auto rtl:left-4"
        >
          ✕
        </button>

        {/* أيقونة التحذير مع الخلفية الباهتة */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-4 rounded-2xl">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* النصوص */}
        <h2 className="text-center text-2xl font-bold text-foreground mb-3">{title}</h2>
        <p className="text-center text-muted-foreground mb-8 leading-relaxed">
          {description}
        </p>
        
        {/* الأزرار */}
        <div className="flex gap-3">
          <button 
            onClick={onCancel} 
            className="flex-1 py-3 border border-border rounded-xl font-semibold text-foreground hover:bg-muted transition"
          >
            {t('cancel')}
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 py-3 bg-[#FF4D4F] text-white rounded-xl font-semibold hover:bg-red-600 transition"
          >
            {t('delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
