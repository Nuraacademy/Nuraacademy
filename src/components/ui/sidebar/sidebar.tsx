"use client"

import { Menu, ChevronUp, ChevronDown, BookOpen, FileText, MessageSquare, BarChart } from "lucide-react"
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
        "UI/UX Design Placement Test",
        "Data Analytics Pre-test",
        "Data Analytics Post-test",
        "Python Assignment",
        "Python Exercise",
        "Programming Final Project"
    ]

    const feedbacks = [
        "Python Assignment Feedback",
        "Python Peer Feedback",
        "Data Analytics Class Feedback",
        "Python Trainer Feedback",
        "UI/UX Design Reflection",
        "UI/UX Design Reflection Feedback"
    ]

    return (
        <div className={`fixed top-0 left-0 h-screen z-50 flex items-start gap-0 ${className || ""}`}>
            {isOpen && (
                <div className="w-72 h-full bg-white shadow-lg px-4 py-6 space-y-6 overflow-y-auto">
                    {/* My Class Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen size={20} className="text-gray-700" />
                            <h3 className="font-semibold text-gray-800">My Class</h3>
                        </div>
                        <div className="space-y-1 ml-7">
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

                    {/* Assignment Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FileText size={20} className="text-gray-700" />
                            <h3 className="font-semibold text-gray-800">Assignment</h3>
                        </div>
                        <div className="space-y-1 ml-7">
                            {assignments.map((assignment, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="block p-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                >
                                    {assignment}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <MessageSquare size={20} className="text-gray-700" />
                            <h3 className="font-semibold text-gray-800">Feedback</h3>
                        </div>
                        <div className="space-y-1 ml-7">
                            {feedbacks.map((feedback, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="block p-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                >
                                    {feedback}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Report & Analytics Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <BarChart size={20} className="text-purple-600" />
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