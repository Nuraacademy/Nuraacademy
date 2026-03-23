"use client"

import { useRouter } from "next/navigation";
import { User, Calendar, Clock } from "lucide-react";

interface BlogCardProps {
    id: number;
    title: string;
    description: string;
    bannerUrl?: string;
    authorName: string;
    date: string;
    readTime?: string;
}

export const BlogCard = ({
    id,
    title,
    description,
    bannerUrl,
    authorName,
    date,
    readTime = "5 minutes"
}: BlogCardProps) => {
    const router = useRouter();

    return (
        <div
            className="flex flex-col bg-white rounded-xl p-5 shadow-sm border border-gray-100 w-full hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => router.push(`/blogs/${id}`)}
        >
            {/* Banner Image */}
            <div className="mb-4 relative h-44 w-full">
                <img
                    src={bannerUrl || "/placeholder-blog.jpg"}
                    alt={title}
                    className="w-full h-full object-cover rounded-xl"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 gap-4">
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-xl font-medium text-gray-900 leading-tight line-clamp-2">
                        {title}
                    </h3>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium opacity-80">
                        <div className="flex items-center gap-1.5">
                            <User size={15} strokeWidth={1.5} className="text-lime-600" />
                            <span>{authorName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={15} strokeWidth={1.5} className="text-lime-600" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={15} strokeWidth={1.5} className="text-lime-600" />
                            <span>{readTime}</span>
                        </div>
                    </div>
                </div>

                <div className="text-left text-gray-600 flex flex-col gap-2">
                    <span className="font-semibold text-xs text-gray-900 uppercase tracking-wider">Description</span>
                    <p className="text-sm leading-relaxed line-clamp-3">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};
