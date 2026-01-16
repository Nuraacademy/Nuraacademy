


export default async function CourseQuickTestPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    return (
        <main>
            <h1>Quick Test - {(await params).id}</h1>
        </main>
    )
}