import { getTopics } from "@/controllers/discussionController";
import Sidebar from "@/components/ui/sidebar/sidebar";
import DiscussionList from "@/components/discussion_list";
import { DiscussionTopicDialog } from "@/components/discussion_topic_dialog";
import { TopicDialogWrapper } from "./components/topic_dialog_wrapper";

export default async function DiscussionPage() {
    const rawTopics = await getTopics();

    const topics = rawTopics.map(t => ({
        id: t.id,
        author: t.author?.name || "Anonymous",
        timeAgo: formatTimeAgo(t.createdAt),
        title: t.title,
        preview: t.preview || t.content.substring(0, 150),
        likeCount: t.likeCount,
        repliesCount: t._count.replies,
        type: t.type as any
    }));

    return (
        <main className="relative min-h-screen bg-white flex flex-col text-gray-800">
            <TopicDialogWrapper topics={topics} />
        </main>
    );
}

function formatTimeAgo(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
}