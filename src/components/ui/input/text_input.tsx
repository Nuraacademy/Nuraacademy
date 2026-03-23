"use client"

import { HTMLInputTypeAttribute, ChangeEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextInputProp {
    label?: string;
    placeholder?: string;
    variant?: HTMLInputTypeAttribute;
    className?: string;
    value?: string | number; // Added number support
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
    color?: string;
    disabled?: boolean;
    id?: string;
}

export const NuraTextInput = ({
    label = "",
    placeholder = "",
    variant = 'text',
    className = "",
    value = "",
    onChange,
    onKeyDown,
    onBlur,
    icon,
    color = "black",
    disabled = false,
    id
}: TextInputProp) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = variant === 'password';
    
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : variant;

    return (
        <div className="w-full">
            {label && (
                <label className={cn("block text-sm mb-1", `text-${color}`)}>
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={id}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onBlur={onBlur}
                    disabled={disabled}
                    onWheel={(e) => e.currentTarget.blur()}
                    className={cn(
                        "w-full rounded-xl bg-white border px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-black",
                        `border-${color}`,
                        (icon || isPassword) ? "pr-10" : "",
                        disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "",
                        // CSS to hide number arrows (spinners)
                        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                        className
                    )}
                />
                
                {isPassword ? (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                        disabled={disabled}
                    >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                ) : icon && (
                    <div className={cn("absolute right-3 top-1/2 -translate-y-1/2 [&>svg]:w-4 [&>svg]:h-4", `text-${color}`)}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};