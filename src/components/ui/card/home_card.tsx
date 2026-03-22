interface HomeCardProp {
    header: string,
    description: string
}

export default function HomeCard({
    header, description
}: HomeCardProp) {
    return (
        <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#8FD656] to-[#25735F] rounded-xl p-4 shadow-xl w-full max-w-[300px] aspect-[5/3] text-white text-center">
            <h3 className="text-2xl font-medium mb-4">{header}</h3>
            <p className="text-md font-medium leading-relaxed">{description}</p>
        </div>
    );
}