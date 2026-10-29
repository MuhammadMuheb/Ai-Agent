import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'hara' | 'peela' | 'laal' | 'cyan' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
  }[size];

  const variantStyles = {
    hara: 'bg-[#2ee59d]/15 text-[#2ee59d] border-[#2ee59d]/30',
    peela: 'bg-[#f5b83d]/15 text-[#f5b83d] border-[#f5b83d]/30',
    laal: 'bg-[#ff4d5e]/15 text-[#ff4d5e] border-[#ff4d5e]/30',
    cyan: 'bg-[#27d7e6]/15 text-[#27d7e6] border-[#27d7e6]/30',
    neutral: 'bg-[#111a24] text-[#8b9bab] border-[#1c2a38]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-md border ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};
