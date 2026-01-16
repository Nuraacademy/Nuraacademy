"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, FileText, Calendar, Clock, Video, Book } from 'lucide-react'; 

interface CourseExpanderProp {
    classId: string;
    courseId: string;
    title: string;
    description: string;
    isSynchronous: boolean;
}

interface SynchronousCourseProp{
    datetime : Date;
    liveURL : string;
}

interface AsynchronousModuleProp{
    moduleId: string;
    title: string;
    isAssignment: boolean;
}

interface AsynchronousCourseProp{
    modules: AsynchronousModuleProp[];
}

export default function CourseExpander({
    classId, courseId, title, description, isSynchronous
}: CourseExpanderProp) {
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    const course_type = isSynchronous ? "Synchronous" : "Asynchronous";

    /* Get this from BE where courseId = courseId and classId = classId */
    const mockSynchronousCourses: SynchronousCourseProp = {
        datetime: new Date('1970-01-01T00:00:00'),
        liveURL: "https://zoom.us/j/123456789",
    };

    /* Get this from BE where courseId = courseId and classId = classId */
    const mockAsynchronousCourses: AsynchronousCourseProp = 
    { 
        "modules": 
            [
                {
                    moduleId: "1",
                    title: "Konsep Dasar Pemrograman",
                    isAssignment: false
                },
                {
                    moduleId: "2",
                    title: "Cara Kerja Program (Input-Process-Output)",
                    isAssignment: false
                },
                {
                    moduleId: "3",
                    title: "Pengenalan Google Colab & Environment Python",
                    isAssignment: false
                },
                {
                    moduleId: "4",
                    title: "Tugas Akhir",
                    isAssignment: true
                },
            ]
    };

    const synchronousCourses = mockSynchronousCourses;
    const asynchronousCourses = mockAsynchronousCourses;

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const handleButtonRedirect = () => {
        const testURL = `/course/quick-test/${courseId}`
        const recordingURL = `/course/recording/${courseId}`
        const target = isSynchronous ? recordingURL : testURL;
        router.push(target)
    }

    return (
        <div className="w-full mb-4">
            <div 
                className={`border border-gray-200 rounded-[2rem] p-6 transition-all cursor-pointer bg-white shadow-sm ${isOpen ? 'border-black' : 'hover:border-[#D9F066]'}`}
            >
                {/* Header Section */}
                <div 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex justify-between items-start"
                >
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
                            <button 
                                className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform"
                                onClick={() => handleButtonRedirect()}
                            >
                                {isSynchronous ? "Watch Record" : "Take Test"}
                            </button>
                        </div>

                        {/* Details List */}
                        <div className="space-y-3 mt-2">
                            {isSynchronous ? (
                                // Synchronous Details (Date/Time/Zoom)
                                <>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                        <Calendar size={18} className="text-gray-400" /> {formatDate(synchronousCourses.datetime)}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                        <Clock size={18} className="text-gray-400" /> {formatTime(synchronousCourses.datetime)} WIB
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                        <Video size={18} className="text-gray-400" /> 
                                        <a href={synchronousCourses.liveURL} target='_blank' className='text-blue-600 hover:text-blue-800'><u>{synchronousCourses.liveURL}</u></a>
                                    </div>
                                </>
                            ) : (
                                // Asynchronous Details (Curriculum)
                                <>
                                {
                                    asynchronousCourses.modules.map((asynchronousCourse, index) => 
                                        (
                                            <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                                {
                                                    asynchronousCourse.isAssignment ? (
                                                        <FileText size={18} className="text-gray-400" />
                                                    ) : (
                                                        <Book size={18} className="text-gray-400" />
                                                    )
                                                }
                                                <a href={`/module/${classId}/${courseId}/${asynchronousCourse.moduleId}`} target='_blank' className='hover:text-blue-800'><u>{asynchronousCourse.title}</u></a>
                                            </div>
                                        )
                                    )
                                }
                                    
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

