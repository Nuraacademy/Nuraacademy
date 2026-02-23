import { ChevronRight } from "lucide-react";

interface NuraButtonProp {
  label: string;
  variant?: 'primary' | 'secondary' | 'navigate' | 'medium' | 'mini';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const NuraButton = ({
  label,
  variant = 'primary',
  onClick,
  className = "",
  type = 'button',
}: NuraButtonProp) => {
  const baseStyles = "px-4 py-2 rounded-[1rem] font-medium text-lg transition-all duration-200 active:scale-95 flex items-center justify-center min-w-[60px] max-w-[160px]";

  const variants = {
    primary: "w-full bg-[#D9F55C] text-black hover:bg-[#c8e44a] hover:border-[#c8e44a]",
    secondary: "w-full text-black border-2 border-[#D9F55C] hover:bg-[#D9F55C]/10",
    navigate: "w-full h-8 bg-[#D9F55C] text-black border-2 border-[#D9F55C] text-sm hover:bg-[#c8e44a] hover:border-[#c8e44a]",
    medium: "w-full bg-black text-white hover:bg-gray-800",
    mini: "w-full h-6 bg-black text-white text-xs hover:bg-gray-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {label}
      {variant === "navigate" && <ChevronRight className="w-4 h-4 ml-auto" strokeWidth={3} />}
    </button>
  );
};