// app/discussion/page.tsx
import { Header2 } from "@/components/header2";
import DiscussionList from "@/components/discussion_list";
import { LimeButton } from "@/components/lime_button";

export default async function DiscussionPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ id?: string }> 
}) {
    const { id } = await searchParams;

    // In a real app, you would fetch this from Prisma:
    // const discussions = await prisma.discussion.findMany({ where: { classId: id } });
    const mockData = {
        classTitle: "Introduction to Programming",
        topics: [
            {
                id: "1",
                author: "Tatang Supratman",
                timeAgo: "12 hours ago",
                title: "A Beginner Journey to Python",
                preview: "As a new student to software engineering we will be learning python starting next semester. I would like to get ahead of the game and study beforehand...",
                replies: 24
            },
            {
                id: "2",
                author: "Tatang Supratman",
                timeAgo: "12 hours ago",
                title: "A Beginner Journey to Python",
                preview: "As a new student to software engineering we will be learning python starting next semester. I would like to get ahead of the game and study beforehand...",
                replies: 20
            }
        ]
    };

    return (
        <main className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
            {/* The Header contains your "Contents" Drawer trigger */}
            <Header2 classId={id ?? ""} />
            
            <div className="flex-grow mx-auto w-full max-w-7xl py-8 px-6 md:px-16">
                {/* Breadcrumbs */}
                <nav className="mb-4 text-[#a2a2a2] text-sm font-medium">
                    {mockData.classTitle} / Forum Diskusi
                </nav>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-black tracking-tight">
                        Forum Diskusi
                    </h1>
                    <LimeButton 
                        label="New Topic"
                        variant="submit"
                    />
                </div>

                {/* List of discussion cards */}
                <DiscussionList topics={mockData.topics} />
            </div>

            
        </main>
    );
}