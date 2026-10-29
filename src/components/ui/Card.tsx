import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-[#0b1118] border border-[#1c2a38] rounded-xl p-4 md:p-5 text-[#e6edf3] transition-all duration-200 ${
        interactive
          ? 'hover:border-[#27d7e6]/50 hover:bg-[#0e1620] cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
