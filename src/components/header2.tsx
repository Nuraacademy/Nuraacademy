"use client"

import { ChevronLeft, Search, List, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"

interface Header2Props {
    classId: string;
}

export const Header2 = ({ classId }: Header2Props) => {
    const router = useRouter();
    return (
        <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-50">
            {/* Left Section: Back Button */}
            <Link 
                href="/courses" 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                aria-label="Back to courses"
            >
                <ChevronLeft size={24} className="text-gray-600" />
            </Link>

            {/* Middle Section: Search Bar */}
            <div className="relative w-full max-w-md mx-4">
                <Search 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    size={18} 
                />
                <input 
                    type="text" 
                    placeholder="Search content" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9F066]/50 focus:border-[#D9F066] transition-all"
                />
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
                <button 
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                >
                    <List size={18} />
                    <span className="hidden sm:inline">Contents</span>
                </button>
                <button
                    onClick={() => router.push(`/discussions/class?id=${classId}`)} 
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                >
                    <MessageSquare size={18} />
                    <span className="hidden sm:inline">Discussion</span>
                </button>
            </div>
        </header>
    );
};