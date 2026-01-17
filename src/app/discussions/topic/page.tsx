


export default async function DiscussionTopicPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ id?: string }> 
}) {
    const { id } = await searchParams;
    return (
        <main>
            <h1>Discussion - {id}</h1>
        </main>
    )
}