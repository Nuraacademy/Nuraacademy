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
            className="flex flex-col bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 w-full hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => router.push(`/blogs/${id}`)}
        >
            {/* Banner Image */}
            <div className="mb-4 relative h-44 w-full">
                <img 
                    src={bannerUrl || "/placeholder-blog.jpg"} 
                    alt={title} 
                    className="w-full h-full object-cover rounded-2xl"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 gap-4">
                <div className="flex flex-col gap-1.5">
                    <h3 className="font-bold text-base text-gray-900 leading-snug line-clamp-2">
                        {title}
                    </h3>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500 font-medium">
                        <div className="flex items-center gap-1">
                            <User size={14} strokeWidth={1.5} className="text-lime-600" />
                            <span>{authorName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={14} strokeWidth={1.5} className="text-lime-600" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock size={14} strokeWidth={1.5} className="text-lime-600" />
                            <span>{readTime}</span>
                        </div>
                    </div>
                </div>

                <div className="text-left text-xs text-gray-700 flex flex-col gap-1.5">
                    <span className="font-bold text-gray-900">Description</span>
                    <p className="leading-relaxed line-clamp-3">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};
