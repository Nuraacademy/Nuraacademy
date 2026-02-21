import { ChangeEvent } from "react";

interface TextAreaProp {
    label: string;
    placeholder: string;
    value: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
}

export const NuraTextArea = ({
    label,
    placeholder,
    value,
    onChange,
    className
}: TextAreaProp) => {
    return (
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full bg-white rounded-[0.5rem] border border-gray-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-black min-h-[120px] resize-y ${className}`}
        />
    )
}