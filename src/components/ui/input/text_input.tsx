import { HTMLInputTypeAttribute, ChangeEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface TextInputProp {
    label?: string;
    placeholder?: string;
    variant?: HTMLInputTypeAttribute;
    className?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
    color?: string;
    disabled?: boolean;
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
    disabled = false
}: TextInputProp) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = variant === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : variant;

    return (
        <div>
            {label && <label className={`block text-sm font-medium mb-1 text-${color}`}>{label}</label>}
            <div className="relative">
                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={`w-full rounded-[0.5rem] bg-white border border-${color} px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black ${(icon || isPassword) ? "pr-10" : ""
                        } ${className} ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
                />
                {isPassword ? (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors`}
                        disabled={disabled}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                ) : icon && (
                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-${color} [&>svg]:w-4 [&>svg]:h-4`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
} 