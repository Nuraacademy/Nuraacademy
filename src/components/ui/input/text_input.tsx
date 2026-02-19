import { HTMLInputTypeAttribute, ChangeEvent } from "react";

interface TextInputProp {
    label: string;
    placeholder?: string;
    variant?: HTMLInputTypeAttribute;
    className?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const NuraTextInput = ({
    label,
    placeholder = "",
    variant = 'text',
    className = "",
    value,
    onChange,
}: TextInputProp) => {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
                type={variant}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black ${className}`}
            />
        </div>
    )
} 