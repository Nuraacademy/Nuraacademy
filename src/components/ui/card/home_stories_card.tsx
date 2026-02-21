interface HomeStoriesCardProp {
    image: string,
    name: string,
    bootcamp: string,
    description: string,
}

export default function HomeStoriesCard({
    image, name, bootcamp, description
}: HomeStoriesCardProp) {
    return (
        <div className="flex flex-col justify-start items-center rounded-[2rem] p-6 shadow-lg w-full max-w-[320px] bg-white text-black gap-4">
            <div className="flex items-center gap-4 w-full">
                <img src={image} alt={name} className="w-14 h-14 rounded-[1rem] object-cover flex-shrink-0" />
                <div className="flex flex-col items-start text-left">
                    <h3 className="text-sm font-semibold">{name}</h3>
                    <p className="text-xs text-gray-500">{bootcamp}</p>
                </div>
            </div>
            <hr className="w-full border-gray-200" />
            <p className="text-xs text-gray-600 text-left leading-relaxed line-clamp-5">
                {description}
            </p>
        </div>
    );
}