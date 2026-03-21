"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; 

interface NuraButtonProps {
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
}: NuraButtonProps) => {
  
  // Base styles: Removed hardcoded max-width to allow parent to control layout
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm";

  const variants = {
    primary: "bg-[#D9F55C] text-black hover:bg-[#c8e44a] px-6 py-1.5 text-base",
    secondary: "border-2 border-[#D9F55C] text-[#D9F55C] hover:bg-[#D9F55C]/10 px-6 py-1.5 text-base",
    navigate: "bg-[#D9F55C] text-black px-4 py-2 text-xs hover:bg-[#c8e44a] rounded-full",
    medium: "bg-black text-white hover:bg-zinc-800 px-5 py-2 text-base",
    mini: "bg-black text-white px-3 py-1 text-xs hover:bg-zinc-800",
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      // Note: 'w-full' is moved to className or handled by the caller for better reusability
      className={cn(baseStyles, variants[variant], className)}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Please wait...</span>
        </>
      ) : (
        <>
          {leftIcon}
          <span className="truncate">{label}</span>
          {rightIcon}
          {/* {variant === "navigate" && (
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" strokeWidth={3} />
          )} */}
        </>
      )}
    </button>
  );
};