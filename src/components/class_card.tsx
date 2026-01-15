interface ClassCardProp {
    imageUrl?: string;
    title: string;
    duration: number;
    level: string;
    capacity: number;
    description: string;
    price: number;
}

export default function ClassCard({ 
    imageUrl, title, duration, level, capacity, description, price 
}: ClassCardProp) {
    return (
        <div className="flex flex-col bg-white rounded-[2rem] p-5 shadow-xl border border-gray-100 w-full max-w-[400px]">
            {/* Image Container */}
            <div className="mb-4">
                <img
                    src={imageUrl || "/example/dummy.png"}
                    alt={title}
                    className="h-56 w-full object-cover rounded-[1.5rem]"
                />
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-grow gap-3">
                <h3 className="font-bold text-xl text-gray-900 leading-tight">
                    {title}
                </h3>

                {/* Info Row */}
                <div className="flex justify-between items-center text-gray-600">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium">
                        <img src="/icons/Clock.svg" alt="" className="w-4 h-4" />
                        {duration} Jam
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium">
                        <img src="/icons/Level.svg" alt="" className="w-4 h-4" />
                        {level}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium">
                        <img src="/icons/People.svg" alt="" className="w-4 h-4" />
                        {capacity.toLocaleString('id-ID')} Peserta
                    </div>
                </div>

                {/* Description - clamped to 3 lines */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {description}
                </p>
            </div>

            {/* Footer - Pushed to bottom */}
            <div className="mt-6 flex items-center justify-between">
                <span className="font-bold text-gray-900 text-lg">
                    Rp{price.toLocaleString('id-ID')}/bulan
                </span>
                
                <button className="flex items-center gap-2 bg-[#D9F066] hover:bg-[#CCE44B] transition-colors py-2 px-5 rounded-full font-semibold text-sm">
                    See Details
                    <img
                        src="/icons/Next.svg"
                        alt=""
                        className="w-4 h-4"
                    />
                </button>
            </div>
        </div>
    );
}