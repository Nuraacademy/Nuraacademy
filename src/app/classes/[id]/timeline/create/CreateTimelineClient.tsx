"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"
import { NuraButton } from "@/components/ui/button/button"
import { updateClassSchedule } from "@/app/actions/classes"
import { FeedbackModal } from "@/components/ui/modal/feedback_modal"
import M3DateTimePicker from "@/components/ui/input/datetime_picker"
import Image from "next/image"

type Props = {
    classData: any
}

const EVENTS = [
    { label: "Enrollment", prefix: "Enrollment" },
    { label: "Placement Test", prefix: "Placement Test" },
    { label: "Course Mapping", prefix: "Course Mapping" },
    { label: "Grouping", prefix: "Grouping" },
    { label: "Learning", prefix: "Learning" },
    { label: "Final Project", prefix: "Final Project" },
]

export function CreateTimelineClient({ classData }: Props) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [dates, setDates] = useState<Record<string, Date | null>>(() => {
        const initial: Record<string, Date | null> = {};
        if (classData.timelines) {
            classData.timelines.forEach((t: any) => {
                initial[t.activity] = new Date(t.date);
            });
        }
        return initial;
    })

    const [modal, setModal] = useState<{ open: boolean, type: "success" | "error", title: string, message: string }>({
        open: false,
        type: "success",
        title: "",
        message: ""
    })

    const handleDateChange = (key: string, value: Date | null) => {
        setDates(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        // Validation: End date >= Start date, and sequential starts
        let isValid = true;
        let errorMessage = "";

        if (!isValid) {
            setModal({
                open: true,
                type: "error",
                title: "Validation Error",
                message: errorMessage,
            });
            return;
        }

        setIsSubmitting(true)

        const timelines: { activity: string, date: Date }[] = [];

        EVENTS.forEach(event => {
            const startVal = dates[`${event.prefix} Starts`];
            const endVal = dates[`${event.prefix} Ends`];

            if (startVal) {
                timelines.push({
                    activity: `${event.prefix} Starts`,
                    date: startVal
                });
            }
            if (endVal) {
                timelines.push({
                    activity: `${event.prefix} Ends`,
                    date: endVal
                });
            }
        });

        const res = await updateClassSchedule(classData.id, timelines);

        setIsSubmitting(false);

        if (res.success) {
            setModal({
                open: true,
                type: "success",
                title: "Schedule Saved! 🎉",
                message: "Class timeline has been updated successfully.",
            });
        } else {
            setModal({
                open: true,
                type: "error",
                title: "Save Failed",
                message: res.error || "Failed to save schedule.",
            });
        }
    }

    const closeSuccessModal = () => {
        setModal(m => ({ ...m, open: false }))
        router.push(`/classes/${classData.id}/overview`)
    }
    const closeErrorModal = () => {
        setModal(m => ({ ...m, open: false }))
    }

    const breadcrumbBase = [
        { label: "Home", href: "/classes" },
        { label: classData.title || "Class Overview", href: `/classes/${classData.id}/overview` },
        { label: "Add Class Schedule", href: "#" },
    ];

    return (
        <main className="relative min-h-screen bg-white flex flex-col text-gray-800">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <Image
                    src="/background/OvalBGLeft.svg"
                    alt=""
                    className="absolute top-0 left-0 w-auto h-[30rem] opacity-60"
                    width={500}
                    height={500}
                />
                <Image
                    src="/background/OvalBGRight.svg"
                    alt=""
                    className="absolute bottom-0 right-0 w-auto h-[30rem] opacity-60"
                    width={500}
                    height={500}
                />
            </div>

            <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 relative z-10 flex flex-col">
                <Breadcrumb items={breadcrumbBase} />
                <h1 className="text-xl font-medium mt-6 mb-8">Add Class Schedule</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 w-full mx-auto">
                    {EVENTS.map((event, index) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        // Start date min is always today as per request
                        const startMinDate = today;

                        // End date min is the start date of the same event
                        const eventStart = dates[`${event.prefix} Starts`];
                        const endMinDate = eventStart || today;

                        return (
                            <div key={index} className="space-y-6 contents">
                                {/* Start Date */}
                                <div >
                                    <M3DateTimePicker
                                        label={`${event.label} Start Date`}
                                        value={(dates[`${event.prefix} Starts`] as Date | null | undefined) ?? null}
                                        onChange={(d) => handleDateChange(`${event.prefix} Starts`, d)}
                                        minDate={startMinDate}
                                    />
                                </div>

                                {/* End Date */}
                                <div >
                                    <M3DateTimePicker
                                        label={`${event.label} End Date`}
                                        value={(dates[`${event.prefix} Ends`] as Date | null | undefined) ?? null}
                                        onChange={(d) => handleDateChange(`${event.prefix} Ends`, d)}
                                        minDate={endMinDate}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-12 flex justify-end gap-4 mx-auto border-t border-gray-100 pt-6 w-full">
                    <NuraButton label="Cancel" variant="secondary" onClick={() => router.back()} disabled={isSubmitting} />
                    <NuraButton label={isSubmitting ? "Saving..." : "Save Timeline"} variant="primary" onClick={handleSubmit} disabled={isSubmitting} />
                </div>
            </div>

            <FeedbackModal
                isOpen={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={modal.type === "success" ? closeSuccessModal : closeErrorModal}
                onConfirm={modal.type === "success" ? closeSuccessModal : closeErrorModal}
                confirmText={modal.type === "success" ? "Go to Overview" : "Close"}
                closeText={modal.type === "success" ? "Stay Here" : undefined}
            />
        </main>
    )
}
