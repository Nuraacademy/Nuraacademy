"use client"

import { useState, useEffect, use } from "react";
import { getBlogByIdAction, toggleLikeBlogAction, trackBlogViewAction } from "@/app/actions/blog";
import { CommentSection } from "@/components/ui/blog/comment_section";
import { getSession } from "@/app/actions/auth";
import { hasPermission } from "@/lib/rbac";
import { User, Calendar, Clock, Heart, MessageCircle, Send, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SidebarWrapper from "@/app/classes/sidebar_wrapper";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { ShareModal } from "@/components/ui/modal/share_modal";
import Image from "next/image";

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [blog, setBlog] = useState<any>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | undefined>();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const userId = await getSession();
            setCurrentUserId(userId || undefined);

            const admin = await hasPermission('Blogs', 'POST_EDIT');
            setIsAdmin(admin);

            const result = await getBlogByIdAction(parseInt(id));
            if (result.success && result.data) {
                setBlog(result.data);
                // Track view
                trackBlogViewAction(result.data.id, { userId: userId || undefined });
            }
            setIsLoading(false);
        };
        init();
    }, [id]);

    const handleToggleLike = async () => {
        if (!blog) return;
        const result: any = await toggleLikeBlogAction(blog.id);
        if (result.success && result.liked !== undefined) {
            setBlog({
                ...blog,
                isLikedByCurrentUser: result.liked,
                _count: {
                    ...blog._count,
                    likes: blog._count.likes + (result.liked ? 1 : -1)
                }
            });
        } else if (!result.success) {
            toast.error(result.error || "Failed to like post");
        }
    };

    if (isLoading) return <div className="min-h-screen bg-white" />;
    if (!blog) return <div className="min-h-screen flex items-center justify-center">Post not found</div>;

    const breadcrumbItems = [
        { label: "Home", href: "/classes" },    
        { label: "Posts", href: "/blogs" },
        { label: blog.title, href: "#" }
    ];

    return (
        <main className="relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 md:pl-8">
            <SidebarWrapper />

            {/* Background Image */}
            <Image
                src="/background/PolygonBGTop.svg"
                alt=""
                className="absolute top-0 left-0 -z-10 w-auto h-[20rem] pointer-events-none opacity-40"
                width={500}
                height={500}
                priority
            />
            <Image
                src="/background/PolygonBGBot.svg"
                alt=""
                className="absolute bottom-0 right-0 -z-10 w-auto h-[20rem] pointer-events-none opacity-40"
                width={500}
                height={500}
            />

            <div className="max-w-4xl mx-auto px-6 pt-6 md:pl-16 relative z-10">
                <div className="w-full">
                    <div className="mb-6">
                        <div className="scale-90 origin-left opacity-80">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-medium text-gray-900 mb-6 leading-tight tracking-tight">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between mb-8">
                        <div className="flex items-center gap-5 text-gray-500 text-xs font-medium opacity-80">
                            <div className="flex items-center gap-1.5">
                                <User size={15} strokeWidth={1.5} className="text-gray-900" />
                                <span>{blog.user.name || blog.user.username}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={15} strokeWidth={1.5} className="text-gray-900" />
                                <span>{format(new Date(blog.createdAt), "dd MMMM yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={15} strokeWidth={1.5} className="text-gray-900" />
                                <span>5 minutes</span>
                            </div>
                        </div>

                        {/* Admin Controls */}
                        {(currentUserId === blog.author || isAdmin) && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => router.push(`/blogs/${blog.id}/edit`)}
                                    className="p-2 text-gray-400 hover:text-gray-900 transition-all"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-500 transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Banner */}
                {blog.bannerUrl && (
                    <div className="w-full rounded-[40px] overflow-hidden mb-12 shadow-sm border border-gray-100">
                        <img src={blog.bannerUrl} alt={blog.title} className="w-full h-auto object-cover max-h-[700px]" />
                    </div>
                )}

                {/* Content */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="space-y-8">
                        {typeof blog.content === "string" ? (
                            <div
                                className="prose prose-p:text-gray-700 prose-p:leading-[1.7] prose-p:text-base max-w-none"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        ) : (
                            (blog.content as any[]).map((section: any, idx: number) => (
                                <div key={idx} className="animate-in fade-in duration-500">
                                    {section.type === "text" ? (
                                        <div
                                            className="prose prose-p:text-gray-700 prose-p:leading-[1.7] prose-p:text-base max-w-none"
                                            dangerouslySetInnerHTML={{ __html: section.content }}
                                        />
                                    ) : (
                                        <div className="rounded-[32px] overflow-hidden my-8">
                                            <img src={section.content} alt={`Section ${idx}`} className="w-full h-auto" />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Interactions Bar - Exactly as Image */}
                    <div className="flex items-center gap-8 py-8 mt-12 border-b border-gray-100/60">
                        <button
                            onClick={handleToggleLike}
                            className={`flex items-center gap-2 transition-all ${blog.isLikedByCurrentUser ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                        >
                            <Heart size={20} strokeWidth={1.5} className={blog.isLikedByCurrentUser ? 'fill-current' : ''} />
                            <span className="text-xs font-medium text-gray-500">{blog._count.likes} likes</span>
                        </button>
                        <div className="flex items-center gap-2 text-gray-500">
                            <MessageCircle size={20} strokeWidth={1.5} />
                            <span className="text-xs font-medium">{blog._count.comments} comment</span>
                        </div>
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-all"
                        >
                            <Send size={20} strokeWidth={1.5} />
                            <span className="text-xs font-medium">{Math.floor((blog._count?.views || 0) / 4)} shares</span>
                        </button>
                    </div>
                </div>

                {/* Share Modal */}
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    shareUrl={typeof window !== 'undefined' ? window.location.href : ""}
                    title="Share Post"
                />

                {/* Comments Section */}
                <div className="max-w-4xl mx-auto pb-24">
                    <CommentSection
                        blogId={blog.id}
                        comments={blog.comments}
                        currentUserId={currentUserId}
                        isAdmin={isAdmin}
                    />
                </div>
            </div>
        </main>
    );
}
