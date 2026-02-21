import { HTMLInputTypeAttribute, ChangeEvent } from "react";

interface TextInputProp {
    label?: string;
    placeholder?: string;
    variant?: HTMLInputTypeAttribute;
    className?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
    color?: string;
}

export const NuraTextInput = ({
    label = "",
    placeholder = "",
    variant = 'text',
    className = "",
    value,
    onChange,
    icon,
    color = "black"
}: TextInputProp) => {
    return (
        <div>
            {label && <label className={`block text-sm font-medium mb-1 text-${color}`}>{label}</label>}
            <div className="relative">
                <input
                    type={variant}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full rounded-[0.5rem] border border-${color} px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black ${icon ? "pr-10" : ""
                        } ${className}`}
                />
                {icon && (
                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-${color} [&>svg]:w-4 [&>svg]:h-4`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
} 