interface ReferenceMaterial {
    name: string;
    icon?: string;
    description: string;
}

const FILE_ICONS: { ext: string; src: string }[] = [
    { ext: ".csv", src: "/icons/file/CSV.svg" },
    { ext: ".pptx", src: "/icons/file/PPT.svg" },
    { ext: ".pdf", src: "/icons/file/PDF.svg" },
    { ext: ".xlsx", src: "/icons/file/XLS.svg" },
    { ext: ".docx", src: "/icons/file/DOC.svg" },
];

function getIcon(name: string): string | null {
    const match = FILE_ICONS.find(({ ext }) => name.toLowerCase().includes(ext));
    return match ? match.src : null;
}

interface ReferenceMaterialsProps {
    materials: ReferenceMaterial[];
}

export default function ReferenceMaterials({ materials }: ReferenceMaterialsProps) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-900">Reference Materials</h2>
            <div className="flex flex-col gap-4">
                {materials.map((mat, i) => {
                    const icon = getIcon(mat.name);
                    return (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                {icon && (
                                    <img src={icon} alt="file" className="w-5 h-5" />
                                )}
                                <span className="text-sm text-gray-800 font-medium">{mat.name}</span>
                            </div>
                            <p className="text-xs text-gray-600 pl-7 leading-relaxed">
                                {mat.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
