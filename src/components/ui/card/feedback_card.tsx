"use client"

import { useRouter } from "next/navigation";

export type FeedbackType = 'Reflection' | 'Assignment' | 'Peer' | 'Class' | 'Trainer';

interface FeedbackCardProps {
    id: string;
    title: string;
    type: FeedbackType;
    className?: string;
    classTitle: string;
    href: string;
}

export const FeedbackCard = ({
    id,
    title,
    type,
    className = "",
    classTitle,
    href
}: FeedbackCardProps) => {
    const router = useRouter();

    const getIcon = (type: FeedbackType) => {
        switch (type) {
            case 'Assignment':
                return "/icons/feedback/AssignmentFeedback.svg";
            case 'Class':
                return "/icons/feedback/ClassFeedback.svg";
            case 'Peer':
                // Assuming ClassFeedback.svg is used for both for now, or check if Peer exists
                return "/icons/feedback/ClassFeedback.svg"; 
            case 'Reflection':
            case 'Trainer':
                return "/icons/feedback/ReflectionFeedback.svg";
            default:
                return "/icons/feedback/ReflectionFeedback.svg";
        }
    };

    return (
        <div
            className={`flex items-center justify-between gap-4 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-400 hover:shadow-md cursor-pointer group relative ${className}`}
            onClick={() => router.push(href)}
        >
            <div className="flex flex-1 items-center gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                    <img src={getIcon(type)} alt={title} className="h-12 w-12" />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <h3 className="text-lg font-medium text-black">{title}</h3>
                    <p className="text-sm text-gray-500 font-medium">
                        {type} Feedback
                        {classTitle && (
                            <span className="ml-2 text-gray-400">· {classTitle}</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};
