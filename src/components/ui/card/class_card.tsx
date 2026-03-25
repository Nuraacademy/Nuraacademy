import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, BookText, BarChart3 } from 'lucide-react';
import { NuraButton } from '../button/button';
import Chip from '../chip/chip';
import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteClassAction } from '@/app/actions/classes';
import { ConfirmModal } from '../modal/confirmation_modal';
import { toast } from 'sonner';

interface ClassCardProp {
    id: string,
    imageUrl?: string,
    title: string,
    method: string,
    scheduleStart?: Date,
    scheduleEnd?: Date,
    description: string,
    duration: number,
    courses: number,
    isEnrolled: boolean,
    canEdit?: boolean,
    canDelete?: boolean,
    canViewAnalytics?: boolean,
    onClick: () => void
}

export default function ClassCard({
    id, imageUrl, title, method, scheduleStart, scheduleEnd, description, duration, courses, isEnrolled, canEdit, canDelete, canViewAnalytics, onClick
}: ClassCardProp) {
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const formatDate = (date?: Date) =>
        date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : "TBA";

    const getStatus = () => {
        const now = new Date();
        let status;
        if (!scheduleStart || !scheduleEnd) {
            status = "Upcoming";
        } else if (now >= scheduleStart && now <= scheduleEnd) {
            status = "Ongoing";
        } else if (now < scheduleStart) {
            status = "Not Started";
        } else {
            status = "Ended";
        }

        let style;
        if (status === "Ongoing") {
            style = 'bg-[#B8FFA2] text-grey-400';
        } else if (status === "Not Started" || status === "Upcoming") {
            style = 'bg-[#8FF6FF] text-grey-400';
        } else {
            style = 'bg-[#A2A2A2] text-grey-700';
        }

        return <Chip label={status} variant="default" size="sm" className={style} />;
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await deleteClassAction(Number(id));
            if (!res.success) {
                toast.error(res.error || "Failed to delete class");
            } else {
                toast.success("Class deleted successfully");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/classes/${id}/edit`);
    };

    return (
        <div
            className="flex flex-col bg-white rounded-xl p-5 shadow-sm border border-gray-100 w-full max-w-[400px] hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={onClick}
        >
            {/* Image */}
            <div className="mb-4 relative h-44 w-full">
                <Image
                    src={imageUrl || "/example/dummy.png"}
                    alt={title}
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow gap-4">
                <div className="flex flex-row items-center justify-between gap-3">
                    <h3 className="font-medium text-base text-gray-900 text-left leading-snug">
                        {title}
                    </h3>

                    {getStatus()}
                </div>

                {/* Method & Schedule */}
                <div className="grid grid-cols-2 text-gray-700 gap-4">
                    <div className="flex flex-col items-start text-left text-xs gap-1">
                        <span className="text-gray-900 text-sm">Methods</span>
                        <div className="text-light text-gray-700" dangerouslySetInnerHTML={{ __html: method }} />
                    </div>
                    <div className="flex flex-col items-start text-left text-xs gap-1">
                        <span className="text-gray-900 text-sm">Schedules</span>
                        <span className="text-light text-gray-700">{formatDate(scheduleStart)} - {formatDate(scheduleEnd)}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="text-left text-xs text-gray-700 flex flex-col gap-1">
                    <span className="text-gray-900 text-sm">Description</span>
                    <div className="text-light leading-relaxed line-clamp-4" dangerouslySetInnerHTML={{ __html: description }} />
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-row items-center justify-between gap-4 mt-5">
                <div className="flex flex-row gap-4 items-center">
                    <div className="flex flex-row items-center gap-1.5 text-xs text-gray-600">
                        <Image src="/icons/Clock.svg" alt="Clock" width={16} height={16} />
                        <span>{duration} hours</span>
                    </div>
                    <div className="flex flex-row items-center gap-1.5 text-xs text-gray-600">
                        <Image src="/icons/Modules.svg" alt="Modules" width={16} height={16} />
                        <span>{courses} courses</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {canDelete && (
                        <button
                            onClick={handleDeleteClick}
                            className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                            <Image src="/icons/Trash.svg" alt="Delete" width={16} height={16} />
                        </button>
                    )}
                    {canEdit && (
                        <button
                            onClick={handleEdit}
                            className="p-2 rounded-lg bg-[#D9F55C] text-black hover:bg-[#c8e44a] transition-all"
                        >
                            <Image src="/icons/Edit.svg" alt="Edit" width={16} height={16} />
                        </button>
                    )}
                    {canViewAnalytics && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/classes/${id}/analytics`);
                            }}
                            className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-[#1C3A37] hover:bg-gray-50 transition-all"
                            title="Class Analytics"
                        >
                            <BarChart3 size={16} />
                        </button>
                    )}
                    { !canEdit && (
                        <NuraButton
                            label={isEnrolled ? "View Class" : "Enroll Now"}
                            variant="navigate"
                            className="min-w-[100px]"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(isEnrolled ? `/classes/${id}/overview` : `/classes/${id}/enrollment`);
                            }}
                        />
                    )}
                </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    title="Delete Class"
                    message="Are you sure you want to delete this class? This action cannot be undone."
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    isLoading={isDeleting}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </div>
        </div>
    );
}