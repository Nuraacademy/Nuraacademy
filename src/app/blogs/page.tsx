"use client"

import { useState, useEffect } from "react";
import { BlogCard } from "@/components/ui/card/blog_card";
import { NuraTextInput } from "@/components/ui/input/text_input";
import { NuraButton } from "@/components/ui/button/button";
import { getBlogsAction } from "@/app/actions/blog";
import { hasPermission } from "@/lib/rbac";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Search } from "lucide-react";
import SidebarWrapper from "@/app/classes/sidebar_wrapper";
import Image from "next/image";

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [canAddBlog, setCanAddBlog] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkPerms = async () => {
            const canPost = await hasPermission('Blogs', 'POST_CREATE');
            setCanAddBlog(canPost);
        };
        checkPerms();
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            setIsLoading(true);
            const result = await getBlogsAction({ search });
            if (result.success && result.data) {
                setBlogs(result.data);
            }
            setIsLoading(false);
        };
        fetchBlogs();
    }, [search]);

    return (
        <main className="relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 md:pl-8">
            <SidebarWrapper />

            {/* Background Image */}
            <Image
                src="/background/PolygonBGTop.svg"
                alt=""
                className="absolute top-0 left-0 -z-10 w-auto h-[40rem] pointer-events-none opacity-60"
                width={500}
                height={500}
                priority
            />
            <Image
                src="/background/PolygonBGBot.svg"
                alt=""
                className="absolute bottom-0 right-0 -z-10 w-auto h-[40rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />

            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-black mb-10 w-full max-w-screen-2xl mx-auto md:pl-16 relative z-10">
                <h1 className="text-3xl font-medium tracking-tight">
                    Explore Our Blogs
                </h1>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <NuraTextInput
                            placeholder="Search blog"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={<Search strokeWidth={1.5} />}
                        />
                    </div>
                    {canAddBlog && (
                        <NuraButton
                            label="Add Blog"
                            variant="primary"
                            onClick={() => router.push("/blogs/add")}
                            className="shrink-0"
                        />
                    )}
                </div>
            </div>

            {/* Blog Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-2xl mx-auto md:pl-16 relative z-10">
                {isLoading ? (
                    <>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[450px] bg-white/50 rounded-[32px] animate-pulse border border-gray-100" />
                        ))}
                    </>
                ) : blogs.length > 0 ? (
                    <>
                        {blogs.map((blog) => (
                            <BlogCard
                                key={blog.id}
                                id={blog.id}
                                title={blog.title}
                                description={blog.description || ""}
                                bannerUrl={blog.bannerUrl}
                                authorName={blog.user.name || blog.user.username}
                                date={format(new Date(blog.createdAt), "dd MMMM yyyy")}
                                readTime="5 minutes"
                            />
                        ))}
                    </>
                ) : (
                    <div className="col-span-full border border-dashed rounded-lg flex items-center justify-center p-8 bg-white/50 w-full min-h-32">
                        <p className="text-black/50">No blogs found.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
