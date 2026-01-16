

export default async function DiscussionPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ id?: string }> 
}) {
    const { id } = await searchParams;

    return (
        <main className="p-10">
            <h1 className="text-2xl font-bold">Discussion - {id || "No ID provided"}</h1>
        </main>
    );
}