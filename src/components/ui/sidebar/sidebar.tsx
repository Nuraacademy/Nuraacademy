"use client"

import { Menu, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { getAssignmentIcon, mapPrismaAssignmentType } from "@/utils/assignment";
import { getSidebarData } from "@/app/actions/sidebar";
import Image from "next/image";

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
        <div className={`fixed top-16 left-0 bottom-0 z-40 pointer-events-none ${className || ""}`}>
            {/* Transition Wrapper */}
            <div 
                className={`relative h-full transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-72"
                }`}
            >
                {/* Sidebar Panel */}
                <div className="w-72 h-full bg-white shadow-[10px_0_30px_rgba(0,0,0,0.03)] px-4 py-6 space-y-6 overflow-y-auto custom-scrollbar pointer-events-auto border-r border-gray-100">
                    {loading ? (
                        <div className="flex flex-col gap-4 p-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="animate-pulse space-y-2">
                                    <div className="h-6 w-24 bg-gray-200 rounded-xl"></div>
                                    <div className="h-10 w-full bg-gray-100 rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* My Class Section */}
                            <div className="group/section">
                                <div 
                                    className="flex items-center gap-3 mb-3 cursor-pointer" 
                                    onClick={() => router.push(isLearner ? "/classes?enrolled=true" : "/classes")}
                                >
                                    <div className="p-2 transition-colors duration-200">
                                        <Image src="/icons/sidebar/Class.svg" alt="Class" width={20} height={20} />
                                    </div>
                                    <h3 className="font-semibold text-gray-800 text-sm">My Class</h3>
                                </div>
                                <div className="space-y-1 ml-4 border-l-2 border-gray-50 pl-6">
                                    {myClasses.map((item) => {
                                        const isExpanded = expandedItems[item.id]
                                        const hasCourses = item.courses && item.courses.length > 0

                                        return (
                                            <div key={item.id} className="group/item">
                                                <button
                                                    onClick={() => hasCourses && toggleItem(item.id)}
                                                    className={`w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-all ${
                                                        hasCourses ? "cursor-pointer" : "cursor-default"
                                                    } ${isExpanded ? "bg-gray-50/50" : ""}`}
                                                >
                                                    <span className="text-xs font-medium text-gray-700 text-left truncate pr-2">{item.title}</span>
                                                    {hasCourses && (
                                                        <ChevronDown 
                                                            size={14} 
                                                            className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} 
                                                        />
                                                    )}
                                                </button>
                                                {hasCourses && (
                                                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                                                        <div className="space-y-1 py-1">
                                                            {item.courses.map((course) => (
                                                                <button
                                                                    key={course.id}
                                                                    onClick={() => router.push(`/classes/${item.id}/course/${course.id}/overview`)}
                                                                    className="w-full text-left p-2 pl-3 text-[11px] text-gray-500 hover:text-black hover:bg-gray-100/50 rounded-lg transition-all truncate"
                                                                >
                                                                    {course.title}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                    {myClasses.length === 0 && (
                                        <p className="text-[11px] text-gray-400 p-2 italic">Not enrolled in any class</p>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 mx-2"></div>

                            {/* Assignment Section */}
                            <div className="group/section">
                                <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => router.push("/assignment")}>
                                    <div className="p-2 transition-colors duration-200">
                                        <Image src="/icons/sidebar/Assignment.svg" alt="Assignment" width={20} height={20} />
                                    </div>
                                    <h3 className="font-semibold text-gray-800 text-sm">Assignment</h3>
                                </div>
                                <div className="space-y-1 ml-4 border-l-2 border-gray-50 pl-6">
                                    {assignments.map((assignment) => (
                                        <a
                                            key={assignment.id}
                                            href={assignment.href}
                                            className="flex items-center gap-3 p-2 text-xs text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-all min-w-0"
                                        >
                                            <Image
                                                src={getAssignmentIcon(mapPrismaAssignmentType(assignment.type))}
                                                alt={assignment.type}
                                                width={18}
                                                height={18}
                                                className="flex-shrink-0 opacity-70"
                                            />
                                            <span className="truncate">{assignment.name}</span>
                                        </a>
                                    ))}
                                    {assignments.length === 0 && (
                                        <p className="text-[11px] text-gray-400 p-2 italic">No upcoming assignments</p>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 mx-2"></div>

                            {/* Feedback Section */}
                            <div className="group/section">
                                <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => router.push("/feedback")}>
                                    <div className="p-2 transition-colors duration-200">
                                        <Image src="/icons/sidebar/Feedback.svg" alt="Feedback" width={20} height={20} />
                                    </div>
                                    <h3 className="font-semibold text-gray-800 text-sm">Feedback</h3>
                                </div>
                                <div className="space-y-1 ml-4 border-l-2 border-gray-50 pl-6">
                                    {feedbacks.map((feedback) => (
                                        <a
                                            key={feedback.id}
                                            href={feedback.href}
                                            className="flex items-center gap-3 p-2 text-xs text-gray-600 hover:text-black hover:bg-gray-50 rounded-xl transition-all min-w-0"
                                        >
                                            <Image
                                                src={map_type_to_icon[feedback.type]}
                                                alt={feedback.type}
                                                width={18}
                                                height={18}
                                                className="flex-shrink-0 opacity-70"
                                            />
                                            <span className="truncate">{feedback.name}</span>
                                        </a>
                                    ))}
                                    {feedbacks.length === 0 && (
                                        <p className="text-[11px] text-gray-400 p-2 italic">No feedback yet</p>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 mx-2"></div>

                            {/* Report & Analytics Section */}
                            <div className="group/section">
                                <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => router.push("/analytics")}>
                                    <div className="p-2 transition-colors duration-200">
                                        <img src="/icons/sidebar/Report.svg" alt="Report" width={20} height={20} />
                                    </div>
                                    <h3 className="font-semibold text-gray-800 text-sm">Report & Analytics</h3>
                                </div>
                                <div className="space-y-1 ml-4 border-l-2 border-gray-50 pl-6">
                                    {!isLearner && (
                                        <div className="space-y-1">
                                            <button onClick={() => router.push(`/analytics/trainer`)} className="w-full flex items-center p-2 rounded-xl hover:bg-gray-50 transition-all text-xs text-gray-600 hover:text-black text-left truncate">
                                                Trainer Analytics
                                            </button>
                                            <button onClick={() => router.push(`/analytics/classes`)} className="w-full flex items-center p-2 rounded-xl hover:bg-gray-50 transition-all text-xs text-gray-600 hover:text-black text-left truncate">
                                                Class Analytics
                                            </button>
                                            <button onClick={() => router.push(`/analytics/user`)} className="w-full flex items-center p-2 rounded-xl hover:bg-gray-50 transition-all text-xs text-gray-600 hover:text-black text-left truncate">
                                                Learner Analytics
                                            </button>
                                        </div>
                                    )}
                                    {isLearner && myClasses.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => router.push(`/classes/${item.id}/analytics`)}
                                            className="w-full flex items-center p-2 rounded-xl hover:bg-gray-50 transition-all text-xs text-gray-600 hover:text-black text-left truncate"
                                        >
                                            {item.title} Report
                                        </button>
                                    ))}
                                    {isLearner && myClasses.length === 0 && (
                                        <p className="text-[11px] text-gray-400 p-2 italic">No reports available</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Toggle button - Attached to the side */}
                <button
                    onClick={toggleSidebar}
                    className="absolute top-4 left-full flex justify-center items-center w-10 h-10 rounded-r-xl shadow-[5px_0_15px_rgba(0,0,0,0.05)] bg-[#D9F55C] hover:bg-[#c9e54c] transition-all duration-300 ease-in-out pointer-events-auto"
                >
                    <div className={`transition-transform duration-500 ${isOpen ? "rotate-180" : "rotate-0"}`}>
                        <Menu size={20} className="text-black" />
                    </div>
                </button>
            </div>
        </div>
    )
}