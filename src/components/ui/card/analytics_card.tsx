"use client"

import { useNuraRouter } from "@/components/providers/navigation-provider";
import { BarChart3, Users, MessageSquare, Briefcase } from "lucide-react";

export type AnalyticsReportType = 'Learner' | 'Class' | 'Trainer' | 'Feedback';

interface AnalyticsCardProps {
    title: string;
    description?: string;
    type: AnalyticsReportType;
    className?: string;
    href: string;
}

export const AnalyticsCard = ({
    title,
    description,
    type,
    className = "",
    href
}: AnalyticsCardProps) => {
    const router = useNuraRouter();

    const getIcon = (type: AnalyticsReportType) => {
        switch (type) {
            case 'Learner':
                return <Users className="w-6 h-6 text-[#1C3A37]" />;
            case 'Class':
                return <Briefcase className="w-6 h-6 text-[#1C3A37]" />;
            case 'Trainer':
                return <BarChart3 className="w-6 h-6 text-[#1C3A37]" />;
            case 'Feedback':
                return <MessageSquare className="w-6 h-6 text-[#1C3A37]" />;
            default:
                return <BarChart3 className="w-6 h-6 text-[#1C3A37]" />;
        }
    };

    const getBgColor = (type: AnalyticsReportType) => {
        switch (type) {
            case 'Learner': return "bg-blue-50";
            case 'Class': return "bg-[#DAEE49]/20";
            case 'Trainer': return "bg-orange-50";
            case 'Feedback': return "bg-purple-50";
            default: return "bg-gray-50";
        }
    };

    return (
        <div
            className={`flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md cursor-pointer group relative ${className}`}
            onClick={() => router.push(href)}
        >
            <div className="flex flex-1 items-center gap-6">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${getBgColor(type)}`}>
                    {getIcon(type)}
                </div>
                <div className="flex flex-col gap-0.5 w-full">
                    <h3 className="text-lg font-medium text-black">{title}</h3>
                    <p className="text-sm text-gray-500 font-medium">
                        {description || `${type} Report`}
                    </p>
                </div>
            </div>
            <div className="text-gray-300 group-hover:text-[#DAEE49] transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:translate-x-1 transition-transform">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
    );
};
