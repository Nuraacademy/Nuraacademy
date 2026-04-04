"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getNotificationsAction, AppNotification } from "@/app/actions/notifications";
import { Bell, BookOpen, Clock, Calendar, FileText, AlertCircle, CheckCircle2, X } from "lucide-react";

const typeConfig: Record<AppNotification["type"], { icon: React.ReactNode; color: string; bg: string }> = {
    class_started: {
        icon: <CheckCircle2 size={16} />,
        color: "text-green-600",
        bg: "bg-green-50",
    },
    class_ending: {
        icon: <AlertCircle size={16} />,
        color: "text-amber-600",
        bg: "bg-amber-50",
    },
    session_soon: {
        icon: <Clock size={16} />,
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    assignment_due: {
        icon: <FileText size={16} />,
        color: "text-red-600",
        bg: "bg-red-50",
    },
    timeline_today: {
        icon: <Calendar size={16} />,
        color: "text-purple-600",
        bg: "bg-purple-50",
    },
    reflection_pending: {
        icon: <BookOpen size={16} />,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
    },
    placement_test_soon: {
        icon: <Calendar size={16} />,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    placement_test_ending: {
        icon: <AlertCircle size={16} />,
        color: "text-rose-600",
        bg: "bg-rose-50",
    },
};

export function NotificationDropdown() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());
    const dropdownRef = useRef<HTMLDivElement>(null);

    const visible = notifications.filter(n => !dismissed.has(n.id));

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Fetch on open
    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);
        getNotificationsAction()
            .then(res => { if (res.success) setNotifications(res.data); })
            .finally(() => setIsLoading(false));
    }, [isOpen]);

    const handleNotificationClick = (href: string) => {
        setIsOpen(false);
        router.push(href);
    };

    const dismiss = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDismissed(prev => new Set([...prev, id]));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell button */}
            <button
                onClick={() => setIsOpen(o => !o)}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
            >
                <Bell size={22} strokeWidth={1.8} className="text-gray-700" />
                {visible.length > 0 && (
                    <span className="absolute top-1 right-1 min-w-[17px] h-[17px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                        {visible.length > 9 ? "9+" : visible.length}
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                            {visible.length > 0 && (
                                <p className="text-xs text-gray-500 mt-0.5">{visible.length} pending</p>
                            )}
                        </div>
                        {visible.length > 0 && (
                            <button
                                onClick={() => setDismissed(new Set(notifications.map(n => n.id)))}
                                className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {/* Body */}
                    <div className="max-h-[420px] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3">
                                <div className="w-8 h-8 border-3 border-gray-200 border-t-lime-500 rounded-full animate-spin" />
                                <p className="text-xs text-gray-400">Checking for notifications...</p>
                            </div>
                        ) : visible.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                    <Bell size={22} strokeWidth={1.5} className="text-gray-300" />
                                </div>
                                <p className="text-sm font-medium text-gray-500">You're all caught up!</p>
                                <p className="text-xs text-gray-400">No pending notifications.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {visible.map(n => {
                                    const cfg = typeConfig[n.type];
                                    return (
                                        <div
                                            key={n.id}
                                            onClick={() => handleNotificationClick(n.href)}
                                            className="flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                                        >
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center mt-0.5`}>
                                                {cfg.icon}
                                            </div>

                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 leading-snug">{n.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                                            </div>

                                            {/* Dismiss */}
                                            <button
                                                onClick={(e) => dismiss(e, n.id)}
                                                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-gray-200 text-gray-400"
                                            >
                                                <X size={13} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
