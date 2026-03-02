"use client"

interface ChipProps {
    label: string;
    variant?: "default" | "outline" | "selectable";
    size?: "sm" | "md" | "lg";
    className?: string;
    isSelected?: boolean;
    onClick?: () => void;
}

export default function Chip({ label, variant = "default", size = "md", className, isSelected, onClick }: ChipProps) {
    const base_style = "inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors cursor-pointer"
    const getVariantStyle = () => {
        if (variant === "selectable") {
            return isSelected
                ? "bg-[#005C53] text-white border border-[#005C53]"
                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
        }
        if (variant === "outline") {
            return "bg-transparent border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800"
        }
        return ""
    }
    const size_style = {
        sm: "px-2 py-1 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    }
    const classes = `${base_style} ${getVariantStyle()} ${size_style[size]} ${className}`

    if (onClick) {
        return (
            <button type="button" onClick={onClick} className={classes}>
                {label}
            </button>
        )
    }

    return (
        <span className={classes}>
            {label}
        </span>
    )
}