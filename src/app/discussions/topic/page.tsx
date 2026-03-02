import { getTopicWithReplies } from "@/controllers/discussionController";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { TopicDetailWrapper } from "../components/topic_detail_wrapper";
import { formatTimeAgo } from "@/lib/utils";

export default async function DiscussionTopicPage({
    searchParams
}: {
    searchParams: Promise<{ id?: string }>
}) {
    const { id } = await searchParams;

    if (!id) return <div className="p-10 text-center">Topic ID missing</div>;

    const topic = await getTopicWithReplies(id);

    if (!topic) return <div className="p-10 text-center">Topic not found</div>;

    const formattedTopic = {
        id: topic.id,
        author: topic.author?.name || "Anonymous",
        timeAgo: formatTimeAgo(topic.createdAt),
        title: topic.title,
        type: topic.type as any,
        content: topic.content,
        repliesCount: topic.replies.length,
        likeCount: topic.likeCount,
        replies: topic.replies.map(r => ({
            author: r.author?.name || "Anonymous",
            timeAgo: formatTimeAgo(r.createdAt),
            text: r.content
        }))
    };

    return (
        <main className="relative min-h-screen bg-white flex flex-col text-gray-800">
            {/* Background Images */}
            <img
                src="/background/PolygonBGTop.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover top-0 left-0"
            />
            <img
                src="/background/PolygonBGBot.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover bottom-0 right-0"
            />

            <div className="flex-grow mx-auto z-1 w-full max-w-7xl py-8 px-6 md:px-16">
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Forum Diskusi", href: "/discussions" },
                        { label: formattedTopic.title, href: "#" }
                    ]}
                />

                <TopicDetailWrapper topic={formattedTopic} />
            </div>
        </main>
    );
}