"use client"

import { Menu, ChevronUp, ChevronDown, FileText, BarChart, TrendingUp, ClipboardList, Star, Zap, Hand, Presentation, Building2, User, Monitor } from "lucide-react"
import { useState } from "react"

interface SidebarProp {
    className?: string
    onOpenChange?: (isOpen: boolean) => void
}

interface ExpandableItem {
    title: string
    children?: string[]
}

export default function Sidebar({ className, onOpenChange }: SidebarProp) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (onOpenChange) {
            onOpenChange(newState);
        }
    }

    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({
        "intro-programming": true,
        "foundation-data": false
    })

    const toggleItem = (key: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const myClasses: ExpandableItem[] = [
        {
            title: "Introduction to Programming",
            children: [
                "Pengenalan Pemrograman & Google Colab",
                "Dasar Python & Variabel"
            ]
        },
        {
            title: "Foundation to Data Analytics",
            children: []
        }
    ]

    const assignments = [
        { name: "UI/UX Design Placement Test", type: "test" },
        { name: "Data Analytics Pre-test", type: "test" },
        { name: "Data Analytics Post-test", type: "test" },
        { name: "Python Assignment", type: "assignment" },
        { name: "Python Exercise", type: "exercise" },
        { name: "Programming Final Project", type: "project" }
    ]

    const feedbacks = [
        { name: "Python Assignment Feedback", type: "feedback" },
        { name: "Python Peer Feedback", type: "feedback" },
        { name: "Data Analytics Class Feedback", type: "feedback" },
        { name: "Python Trainer Feedback", type: "feedback" },
        { name: "UI/UX Design Reflection", type: "reflection" },
        { name: "UI/UX Design Reflection Feedback", type: "reflection" }
    ]

    const map_type_to_icon: Record<string, string> = {
        test: "/icons/sidebar/SubTest.svg",
        assignment: "/icons/sidebar/SubAssignment.svg",
        exercise: "/icons/sidebar/SubExercise.svg",
        project: "/icons/sidebar/SubFinalProject.svg",
        feedback: "/icons/sidebar/SubFeedback.svg",
        reflection: "/icons/sidebar/SubReflection.svg"
    }

    return (
        <div className={`fixed top-0 left-0 h-screen z-50 flex items-start gap-0 ${className || ""}`}>
            {isOpen && (
                <div className="w-72 h-full bg-white shadow-lg px-4 py-6 space-y-6 overflow-y-auto">
                    {/* My Class Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src="/icons/sidebar/Class.svg"
                                alt="Class Icon"
                                width={24}
                                height={24}
                            />
                            <h3 className="font-semibold text-gray-800">My Class</h3>
                        </div>
                        <div className="space-y-1 ml-11">
                            {myClasses.map((item, index) => {
                                const key = index === 0 ? "intro-programming" : "foundation-data"
                                const isExpanded = expandedItems[key]
                                const hasChildren = item.children && item.children.length > 0

                                return (
                                    <div key={index}>
                                        <button
                                            onClick={() => hasChildren && toggleItem(key)}
                                            className={`w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors ${hasChildren ? "cursor-pointer" : "cursor-default"
                                                }`}
                                        >
                                            <span className="text-sm text-gray-700 text-left">{item.title}</span>
                                            {hasChildren && (
                                                isExpanded ? (
                                                    <ChevronUp size={16} className="text-gray-600 flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown size={16} className="text-gray-600 flex-shrink-0" />
                                                )
                                            )}
                                        </button>
                                        {hasChildren && isExpanded && (
                                            <div className="ml-4 mt-1 space-y-1">
                                                {item.children!.map((child, childIndex) => (
                                                    <a
                                                        key={childIndex}
                                                        href="#"
                                                        className="block p-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                                    >
                                                        {child}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-gray-200"></div>

                    {/* Assignment Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src="/icons/sidebar/Assignment.svg"
                                alt="Assignment Icon"
                                width={24}
                                height={24}
                            />
                            <h3 className="font-semibold text-gray-800">Assignment</h3>
                        </div>
                        <div className="space-y-1 ml-11">
                            {assignments.map((assignment, index) => {
                                return (
                                    <a
                                        key={index}
                                        href="#"
                                        className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                    >
                                        <img
                                            src={map_type_to_icon[assignment.type]}
                                            alt={assignment.type}
                                            width={24}
                                            height={24}
                                        />
                                        <span>{assignment.name}</span>
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-gray-200"></div>

                    {/* Feedback Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src="/icons/sidebar/Feedback.svg"
                                alt="Feedback Icon"
                                width={24}
                                height={24}
                            />
                            <h3 className="font-semibold text-gray-800">Feedback</h3>
                        </div>
                        <div className="space-y-1 ml-11">
                            {feedbacks.map((feedback, index) => {
                                return (
                                    <a
                                        key={index}
                                        href="#"
                                        className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                    >
                                        <img
                                            src={map_type_to_icon[feedback.type]}
                                            alt={feedback.type}
                                            width={24}
                                            height={24}
                                        />
                                        <span>{feedback.name}</span>
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-gray-200"></div>

                    {/* Report & Analytics Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src="/icons/sidebar/Report.svg"
                                alt="Report Icon"
                                width={24}
                                height={24}
                            />
                            <h3 className="font-semibold text-gray-800">Report & Analytics</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle button */}
            <button
                onClick={toggleSidebar}
                className="mt-20 flex justify-center items-center w-10 h-10 rounded-r-xl shadow-lg bg-[#D9F55C] hover:bg-[#c9e54c] transition-colors"
            >
                <Menu size={24} className="text-black" />
            </button>
        </div>
    )
}