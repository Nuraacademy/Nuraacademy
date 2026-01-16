


export default async function DiscussionTopicPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    return (
        <main>
            <h1>Discussion - {(await params).id}</h1>
        </main>
    )
}