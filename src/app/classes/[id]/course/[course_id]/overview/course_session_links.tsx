"use client"

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteSession } from "@/app/actions/session";
import { useState } from "react";
import { ConfirmModal } from "@/components/ui/modal/confirmation_modal";

interface CourseSessionLinkProps {
    classId: string;
    courseId: string;
    session: {
        id: string;
        title: string;
        type: string;
    };
    isAdmin?: boolean;
}

const SessionTag = ({ label }: { label: string }) => {
    if (label === "None" || !label) return null;
    return (
        <span className="ml-3 px-3 py-0.5 text-[10px] font-medium border border-gray-300 rounded-full text-gray-500 bg-gray-50">
            {label}
        </span>
    );
};

export default function CourseSessionLink({ classId, courseId, session, isAdmin }: CourseSessionLinkProps) {
    const router = useRouter();

    const getIcon = () => {
        if (session.title.includes("Video") || session.type === "Asynchronous") {
            return <img src="/icons/Video.svg" alt="Video" className="w-5 h-5" />;
        }
        if (session.title.includes("Zoom") || session.type === "Synchronous") {
            return <img src="/icons/Zoom.svg" alt="Zoom" className="w-5 h-5" />;
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/classes/${classId}/course/${courseId}/session/${session.id}/edit`);
    };

    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await deleteSession(parseInt(session.id), classId);
            if (!res.success) {
                alert("Failed to delete session: " + res.error);
            } else {
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to delete session due to an unexpected error.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div
                className="flex items-center justify-between group cursor-pointer border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                onClick={() => router.push(`/classes/${classId}/course/${courseId}/session/${session.id}`)}
            >
                <div className="flex items-center gap-3">
                    <div className="text-gray-700">
                        {getIcon()}
                    </div>
                    <div className="flex items-center">
                        <h3 className="text-sm font-bold text-gray-900">{session.title}</h3>
                        <SessionTag label={session.type} />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <div className="flex items-center gap-2 text-gray-400">
                            <button
                                className={`p-1.5 rounded transition-colors z-10 ${isDeleting ? 'text-gray-300' : 'hover:bg-gray-100 hover:text-red-500'}`}
                                onClick={handleDeleteClick}
                                disabled={isDeleting}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                            <button
                                className="p-1.5 hover:bg-gray-100 rounded hover:text-gray-900 transition-colors z-10"
                                onClick={handleEdit}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>
                            </button>
                        </div>
                    )}
                    {
                        !isAdmin && (
                            <div className="text-gray-300 group-hover:text-gray-500 transition-colors">
                                <ChevronRight size={20} />
                            </div>
                        )
                    }
                </div>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                title="Delete Session"
                message={`Are you sure you want to delete the session "${session.title}"?`}
                onConfirm={confirmDelete}
                onCancel={() => setIsModalOpen(false)}
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </>
    );
}
