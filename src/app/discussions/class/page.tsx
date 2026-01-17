// app/discussion/page.tsx
import { Header2 } from "@/components/header2";
import DiscussionClientWrapper from "./discussion_client_wrapper";

export default async function DiscussionPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ id?: string }> 
}) {
    const { id } = await searchParams;

    // Simulate fetching data on the server
    const mockData = {
        classTitle: "Introduction to Programming",
        topics: [
            {
                id: "1",
                author: "Tatang Supratman",
                timeAgo: "12 hours ago",
                title: "A Beginner Journey to Python",
                preview: "As a new student to software engineering...",
                replies: 24
            }, 
            {
                id: "2",
                author: "Tatang Supratman",
                timeAgo: "12 hours ago",
                title: "A Beginner Journey to Python",
                preview: "As a new student to software engineering...",
                replies: 24
            }
        ]
    };

    return (
        <main className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
            <Header2 classId={id ?? ""} />
            <div className="flex-grow mx-auto w-full max-w-7xl py-8 px-6 md:px-16">
                <nav className="mb-4 text-[#a2a2a2] text-sm font-medium">
                    {mockData.classTitle} / Forum Diskusi
                </nav>
                
                {/* Move all state-dependent UI into this Client Component */}
                <DiscussionClientWrapper topics={mockData.topics} />
            </div>
        </main>
    );
}