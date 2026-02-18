import { ChevronRight } from "lucide-react";

interface NuraButtonProp {
  label: string;
  variant?: 'primary' | 'secondary' | 'navigate' | 'medium' | 'mini';
  onClick?: () => void;
  className?: string;
}

export const NuraButton = ({ 
  label, 
  variant = 'primary', 
  onClick, 
  className = "" 
}: NuraButtonProp) => {
  // Base styles matching the high-border-radius pill shape
  const baseStyles = "px-4 py-2 rounded-[1rem] font-medium text-lg transition-all duration-200 active:scale-95 flex items-center justify-center min-w-[60px] max-w-[160px]";
  
  // Specific styles for Solid vs Outline variants
  const variants = {
    primary: "w-160 bg-[#D9F55C] text-black hover:bg-[#c8e64b] border-2 border-[#D9F55C]",
    secondary: "w-160 text-black border-2 border-[#D9F55C] hover:bg-[#D9F55C]/10",
    navigate: "w-140 h-8 bg-[#D9F55C] text-black border-2 border-[#D9F55C] justify-start text-sm",
    medium: "w-80 bg-black text-white",
    mini: "w-60 h-6 bg-black text-white text-xs",
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {label}
      {variant === "navigate" && <ChevronRight className="w-4 h-4 ml-auto" strokeWidth={3} />}
    </button>
  );
};