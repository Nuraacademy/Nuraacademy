import Image from 'next/image';

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
        <div className="flex flex-col justify-start items-center rounded-xl p-6 shadow-lg w-full max-w-[320px] bg-white text-black gap-4">
            <div className="flex items-center gap-4 w-full">
                <Image
                    src={image}
                    alt={name}
                    width={56}
                    height={56}
                    className="rounded-xl object-cover flex-shrink-0"
                />
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