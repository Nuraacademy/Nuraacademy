import React from 'react';

interface LimeButtonProps {
  label: string;
  variant?: 'solid' | 'outline' | 'submit';
  onClick?: () => void;
  className?: string;
}

export const LimeButton = ({ 
  label, 
  variant = 'solid', 
  onClick, 
  className = "" 
}: LimeButtonProps) => {
  // Base styles matching the high-border-radius pill shape
  const baseStyles = "px-8 py-2 rounded-full font-medium text-lg transition-all duration-200 active:scale-95 flex items-center justify-center min-w-[160px]";
  
  // Specific styles for Solid vs Outline variants
  const variants = {
    solid: "bg-[#D9F55C] text-black hover:bg-[#c8e64b] border-2 border-[#D9F55C]",
    outline: "bg-white text-black border-2 border-[#D9F55C] hover:bg-[#D9F55C]/10",
    submit: "bg-[#D9F55C] text-black hover:bg-[#c8e64b] border-2 border-[#D9F55C] border-xl text-sm",
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
};