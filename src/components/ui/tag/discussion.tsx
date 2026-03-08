interface ForumTagProp {
    type?: "Technical Help" | "Learning Resource" | "Learning Partner" | "Course Discussion" | "Career & Portos";
    label?: string;
    color?: string;
    className?: string;
}

export default function ForumTag({ type, label, color, className }: ForumTagProp) {
    const base_style = "inline-flex items-center px-4 py-1 rounded-full text-[13px] font-semibold";
    if (type !== null) {
        let color_style = "";
        if (type === "Technical Help") {
            color_style = "bg-[#8FF6FF] text-black";
        } else if (type === "Learning Resource") {
            color_style = "bg-[#FFC06E] text-black";
        } else if (type === "Learning Partner") {
            color_style = "bg-[#95FFA5] text-black";
        } else if (type === "Course Discussion") {
            color_style = "bg-[#9C8FFF] text-black";
        } else if (type === "Career & Portos") {
            color_style = "bg-[#FFAF8F] text-black";
        }
        return (
            <div className={`${base_style} ${color_style} ${className}`}>
                {type}
            </div>
        );
    }
    let color_style = `bg-[#${color}]`
    return (
        <div className={`${base_style} ${color_style} ${className}`}>
            {label}
        </div>
    );
}