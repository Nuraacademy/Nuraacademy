


export default async function CourseRecordingPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    return (
        <main>
            <h1>Recording - {(await params).id}</h1>
        </main>
    )
}