"use client"

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Calendar, Clock, Video } from 'lucide-react'; // Suggested icon library

interface CourseExpanderProp {
    id: string;
    title: string;
    description: string;
    isSynchronous: boolean;
}

export default function CourseExpander({
    id, title, description, isSynchronous
}: CourseExpanderProp) {
    const [isOpen, setIsOpen] = useState(false);

    const course_type = isSynchronous ? "Synchronous" : "Asynchronous";

    return (
        <div className="w-full mb-4">
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`border border-gray-200 rounded-[2rem] p-6 transition-all cursor-pointer bg-white shadow-sm ${isOpen ? 'border-black' : 'hover:border-[#D9F066]'}`}
            >
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        <h4 className="font-bold text-xl mb-2">{title}</h4>
                        <p className="text-gray-500 text-sm mb-4 leading-relaxed max-w-[90%]">
                            {description}
                        </p>
                        <span className="px-4 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-600">
                            {course_type}
                        </span>
                    </div>
                    <div className="text-2xl pt-1">
                        {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                </div>

                {/* Expanded Content Section */}
                {isOpen && (
                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        
                        {/* Banner for Action */}
                        <div className={`flex items-center justify-between p-4 rounded-xl ${isSynchronous ? 'bg-[#FDF9ED]' : 'bg-[#FDF9ED]'}`}>
                            <div className="text-sm">
                                <p className="font-bold text-gray-800">
                                    {isSynchronous ? "Missed the live session?" : "Think you already know this?"}
                                </p>
                                <p className="text-gray-600">
                                    {isSynchronous ? "Watch the recorded class to catch up" : "Try a quick test to find out if you can skip the course"}
                                </p>
                            </div>
                            <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform">
                                {isSynchronous ? "Watch Record" : "Take Test"}
                            </button>
                        </div>

                        {/* Details List */}
                        <div className="space-y-3 mt-2">
                            {isSynchronous ? (
                                // Synchronous Details (Date/Time/Zoom)
                                <>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                        <Calendar size={18} className="text-gray-400" /> 19-21 Januari 2026
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                        <Clock size={18} className="text-gray-400" /> 19:00-21:00 WIB
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                        <Video size={18} className="text-gray-400" /> Zoom
                                    </div>
                                </>
                            ) : (
                                // Asynchronous Details (Curriculum)
                                <>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                        <FileText size={18} className="text-gray-400" /> Konsep Dasar Pemrograman
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                        <FileText size={18} className="text-gray-400" /> Cara Kerja Program (Input-Process-Output)
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                        <FileText size={18} className="text-gray-400" /> Pengenalan Google Colab & Environment Python
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}