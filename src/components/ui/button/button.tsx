import { ChevronRight } from "lucide-react";

interface NuraButtonProp {
  label: string;
  variant?: 'primary' | 'secondary' | 'navigate' | 'medium' | 'mini';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  id?: string;
}

export const NuraButton = ({
  label,
  variant = 'primary',
  onClick,
  className = "",
  type = 'button',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  id,
}: NuraButtonProp) => {
  const baseStyles = "px-4 py-2 rounded-[1rem] text-lg transition-all duration-200 active:scale-95 flex items-center justify-center min-w-[60px] max-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary: "w-full bg-[#D9F55C] text-black hover:bg-[#c8e44a] hover:border-[#c8e44a]",
    secondary: "w-full text-black border-2 border-[#D9F55C] hover:bg-[#D9F55C]/10",
    navigate: "w-full h-8 bg-[#D9F55C] text-black border-2 border-[#D9F55C] text-sm hover:bg-[#c8e44a] hover:border-[#c8e44a]",
    medium: "w-full bg-black text-white hover:bg-gray-800",
    mini: "w-full h-6 bg-black text-white text-xs hover:bg-gray-800",
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <span>Submitting...</span>
        </div>
      ) : (
        <>
        <div className="flex items-center gap-2">
          {leftIcon}
          {label}
          {rightIcon}
          {variant === "navigate" && <ChevronRight className="w-4 h-4 ml-auto" strokeWidth={3} />}
        </div>
        </>
      )}
    </button>
  );
};