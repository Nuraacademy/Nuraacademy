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
        <div className="flex flex-col justify-center items-center rounded-[2rem] p-4 shadow-lg w-full max-w-[300px] aspect-[5/3] text-black text-center gap-4">
            <div className="flex items-center gap-4">
                <img src={image} alt={name} className="w-14 h-14 rounded-[1rem]" />
                <div className="flex flex-col items-start text-left">
                    <h3 className="text-md">{name}</h3>
                    <p className="text-xs">{bootcamp}</p>
                </div>
            </div>
            <hr className="w-full border-gray-200"/>
            <p className="text-xs item-start text-left">{description.slice(0,255)}</p>    
        </div>
    );
}