"use client"

import { Menu, ChevronUp, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { getAssignmentEndpoint, getAssignmentIcon, mapPrismaAssignmentType } from "@/utils/assignment";
import { getSidebarData } from "@/app/actions/sidebar";

interface SidebarProp {
    className?: string
    onOpenChange?: (isOpen: boolean) => void
}

interface SidebarClass {
    id: string
    title: string
    courses: {
        id: string
        title: string
        sessions: {
            id: string
            title: string
        }[]
    }[]
}

interface SidebarAssignment {
    id: string
    name: string
    type: string
    href: string
}

interface SidebarFeedback {
    id: string
    name: string
    type: string
    href: string
}

export default function Sidebar({ className, onOpenChange }: SidebarProp) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    const [myClasses, setMyClasses] = useState<SidebarClass[]>([])
    const [assignments, setAssignments] = useState<SidebarAssignment[]>([])
    const [feedbacks, setFeedbacks] = useState<SidebarFeedback[]>([])
    const [isLearner, setIsLearner] = useState(true)

    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({})

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await getSidebarData()
            if (res.success && res.data) {
                setMyClasses(res.data.myClasses)
                setAssignments(res.data.assignments)
                setFeedbacks(res.data.feedbacks)
                setIsLearner(res.data.isLearner)
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    const toggleSidebar = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (onOpenChange) {
            onOpenChange(newState);
        }
    }

    const toggleItem = (key: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const map_type_to_icon: Record<string, string> = {
        test: "/icons/sidebar/SubTest.svg",
        exercise: "/icons/sidebar/SubExercise.svg",
        project: "/icons/sidebar/SubFinalProject.svg",
        feedback: "/icons/feedback/ClassFeedback.svg",
        reflection: "/icons/feedback/ReflectionFeedback.svg",
        assignment: "/icons/sidebar/SubExercise.svg",
        peer: "/icons/feedback/PeerFeedback.svg",
        class: "/icons/feedback/ClassFeedback.svg"
    }

    return (
        <div className={`fixed top-16 left-0 bottom-0 z-40 flex items-start gap-0 ${className || ""}`}>
            {isOpen && (
                <div className="w-72 h-full bg-white shadow-lg px-4 py-6 space-y-6 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col gap-4 p-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse space-y-2">
                                    <div className="h-6 w-24 bg-gray-200 rounded-xl"></div>
                                    <div className="h-10 w-full bg-gray-100 rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* My Class Section */}
                            <div>
                                <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => router.push("/classes")}>
                                    <img
                                        src="/icons/sidebar/Class.svg"
                                        alt="Class Icon"
                                        width={24}
                                        height={24}
                                    />
                                    <h3 className="font-semibold text-gray-800">My Class</h3>
                                </div>
                                <div className="space-y-1 ml-11">
                                    {myClasses.map((item) => {
                                        const isExpanded = expandedItems[item.id]
                                        const hasCourses = item.courses && item.courses.length > 0

                                        return (
                                            <div key={item.id}>
                                                <button
                                                    onClick={() => hasCourses && toggleItem(item.id)}
                                                    className={`w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors ${hasCourses ? "cursor-pointer" : "cursor-default"
                                                        }`}
                                                >
                                                    <span className="text-sm text-gray-700 text-left truncate pr-2">{item.title}</span>
                                                    {hasCourses && (
                                                        isExpanded ? (
                                                            <ChevronUp size={16} className="text-gray-600 flex-shrink-0" />
                                                        ) : (
                                                            <ChevronDown size={16} className="text-gray-600 flex-shrink-0" />
                                                        )
                                                    )}
                                                </button>
                                                {hasCourses && isExpanded && (
                                                    <div className="ml-4 mt-1 space-y-1">
                                                        {item.courses.map((course) => (
                                                            <div key={course.id}>
                                                                <button
                                                                    onClick={() => router.push(`/classes/${item.id}/course/${course.id}/overview`)}
                                                                    className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors truncate"
                                                                >
                                                                    {course.title}
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                    {myClasses.length === 0 && (
                                        <p className="text-xs text-gray-400 p-2 italic">Not enrolled in any class</p>
                                    )}
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="border-t border-gray-200"></div>

                            {/* Assignment Section */}
                            <div>
                                <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => router.push("/assignment")}>
                                    <img
                                        src="/icons/sidebar/Assignment.svg"
                                        alt="Assignment Icon"
                                        width={24}
                                        height={24}
                                    />
                                    <h3 className="font-semibold text-gray-800">Assignment</h3>
                                </div>
                                <div className="space-y-1 ml-11">
                                    {assignments.map((assignment) => (
                                        <a
                                            key={assignment.id}
                                            href={assignment.href}
                                            className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors min-w-0"
                                        >
                                            <img
                                                src={getAssignmentIcon(mapPrismaAssignmentType(assignment.type))}
                                                alt={assignment.type}
                                                width={24}
                                                height={24}
                                                className="flex-shrink-0"
                                            />
                                            <span className="truncate">{assignment.name}</span>
                                        </a>
                                    ))}
                                    {assignments.length === 0 && (
                                        <p className="text-xs text-gray-400 p-2 italic">No upcoming assignments</p>
                                    )}
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="border-t border-gray-200"></div>

                            {/* Feedback Section */}
                            <div>
                                <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => router.push("/feedback")}>
                                    <img
                                        src="/icons/sidebar/Feedback.svg"
                                        alt="Feedback Icon"
                                        width={24}
                                        height={24}
                                    />
                                    <h3 className="font-semibold text-gray-800">Feedback</h3>
                                </div>
                                <div className="space-y-1 ml-11">
                                    {feedbacks.map((feedback) => (
                                        <a
                                            key={feedback.id}
                                            href={feedback.href}
                                            className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors min-w-0"
                                        >
                                            <img
                                                src={map_type_to_icon[feedback.type]}
                                                alt={feedback.type}
                                                width={24}
                                                height={24}
                                                className="flex-shrink-0"
                                            />
                                            <span className="truncate">{feedback.name}</span>
                                        </a>
                                    ))}
                                    {feedbacks.length === 0 && (
                                        <p className="text-xs text-gray-400 p-2 italic">No feedback yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="border-t border-gray-200"></div>

                            {/* Report & Analytics Section */}
                            <div>
                                <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => router.push("/analytics")}>
                                    <img
                                        src="/icons/sidebar/Report.svg"
                                        alt="Report Icon"
                                        width={24}
                                        height={24}
                                    />
                                    <h3 className="font-semibold text-gray-800">Report & Analytics</h3>
                                </div>
                                <div className="space-y-1 ml-11">
                                    {myClasses.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => router.push(`/classes/${item.id}/analytics`)}
                                            className="w-full flex items-center p-2 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700 text-left truncate"
                                        >
                                            {item.title} Report
                                        </button>
                                    ))}
                                    {myClasses.length === 0 && (
                                        <p className="text-xs text-gray-400 p-2 italic">No reports available</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Toggle button */}
            <button
                onClick={toggleSidebar}
                className="mt-4 flex justify-center items-center w-10 h-10 rounded-r-xl shadow-lg bg-[#D9F55C] hover:bg-[#c9e54c] transition-colors"
            >
                <Menu size={24} className="text-black" />
            </button>
        </div>
    )
}