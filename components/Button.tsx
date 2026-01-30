import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
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
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-toffee-brown focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-toffee-brown text-white hover:bg-[#85573D]",
    secondary: "bg-white border border-toffee-brown text-toffee-brown hover:bg-parchment",
    ghost: "bg-transparent text-slate-grey hover:bg-platinum hover:text-deep-space-blue",
    icon: "bg-transparent text-slate-grey hover:bg-mint-cream hover:text-toffee-brown p-2 rounded-full",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  const finalClass = `${baseStyle} ${variants[variant]} ${variant !== 'icon' ? sizes[size] : ''} ${className}`;

  return (
    <button className={finalClass} {...props}>
      {children}
    </button>
  );
};
