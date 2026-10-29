import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from './Button.tsx';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footerActions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-full bg-[#0b1118] border-l border-[#1c2a38] p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 text-[#e6edf3]"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-start justify-between border-b border-[#1c2a38] pb-4">
          <div>
            <h3 className="font-semibold text-lg text-[#e6edf3]">{title}</h3>
            {subtitle && <p className="text-xs text-[#8b9bab] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-[#8b9bab] hover:text-[#e6edf3] p-1.5 rounded-lg hover:bg-[#111a24] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4">
          {children}
        </div>

        {/* Optional Footer */}
        {footerActions && (
          <div className="border-t border-[#1c2a38] pt-4 mt-auto">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
};
