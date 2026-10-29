import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#27d7e6]/50 active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'min-h-[36px] px-3 py-1.5 text-xs gap-1.5',
    md: 'min-h-[40px] px-4 py-2 text-sm gap-2',
    lg: 'min-h-[46px] px-5 py-2.5 text-base gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-[#27d7e6] text-[#05080c] hover:bg-[#20b8c5] font-semibold shadow-sm hover:shadow-[0_0_15px_rgba(39,215,230,0.3)]',
    secondary:
      'bg-[#111a24] text-[#e6edf3] border border-[#1c2a38] hover:bg-[#162230] hover:border-[#27d7e6]/40',
    danger:
      'bg-[#ff4d5e] text-white hover:bg-[#e03d4d] font-semibold shadow-sm hover:shadow-[0_0_15px_rgba(255,77,94,0.3)]',
    ghost:
      'bg-transparent text-[#8b9bab] hover:text-[#e6edf3] hover:bg-[#111a24]',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
