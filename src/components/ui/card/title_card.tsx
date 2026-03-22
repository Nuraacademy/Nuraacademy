export default function TitleCard({ title, actions }: { title: string, actions?: React.ReactNode }) {
    return (
        <section className="bg-[#005954] rounded-xl p-6 mb-8 flex items-center justify-between gap-4">
            <h1 className="text-lg font-medium text-white">{title}</h1>
            {actions}
        </section>
    )
}