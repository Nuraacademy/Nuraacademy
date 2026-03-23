export default function TitleCard({ title, description, actions }: { title: string, description?: string, actions?: React.ReactNode }) {
    return (
        <section className="bg-[#005954] rounded-xl p-6 mb-8 flex items-center justify-between gap-4">
            <div>
                <h1 className="text-lg font-medium text-white">{title}</h1>
                {description && <p className="text-white/80 text-sm mt-1">{description}</p>}
            </div>
            {actions}
        </section>
    )
}