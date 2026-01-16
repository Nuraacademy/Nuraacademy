


export default async function ModulePage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    return (
        <main>
            <h1>Module - {(await params).id}</h1>
        </main>
    )
}