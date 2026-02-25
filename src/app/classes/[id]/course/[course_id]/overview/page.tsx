"use client"

import { useState, useEffect } from "react";
import { ChevronRight, Video } from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { PAGE_DATA } from "./constants";
import { useParams, useRouter } from "next/navigation";

interface SectionProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

const CourseSection = ({ icon, title, children }: SectionProps) => (
    <div className="flex flex-col gap-4 py-8 first:pt-0 border-b border-gray-100 last:border-0 last:pb-0">
        <div className="flex items-center gap-3">
            <div className="text-gray-700">
                {icon}
            </div>
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
        </div>
        <div className="pl-9">
            {children}
        </div>
    </div>
);

const SessionTag = ({ label }: { label: string }) => {
    if (label === "None") return null;
    return (
        <span className="ml-3 px-3 py-0.5 text-[10px] font-medium border border-gray-300 rounded-full text-gray-500 bg-gray-50">
            {label}
        </span>
    );
};

export default function CourseOverviewPage() {
    const params = useParams();
    const router = useRouter();
    const classId = params.id as string;
    const courseId = params.course_id as string;

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: PAGE_DATA.classTitle, href: `/classes/${classId}/overview` },
        { label: PAGE_DATA.courseTitle, href: `#` },
    ];

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Hero Title */}
                <section className="bg-[#005954] rounded-[1.5rem] p-6 mb-8">
                    <h1 className="text-xl font-bold text-white">{PAGE_DATA.courseTitle}</h1>
                </section>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col">
                    {/* Course Description */}
                    <CourseSection icon={<img src="/icons/Information.svg" alt="Information" className="w-5 h-5" />} title="Course Description">
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {PAGE_DATA.description}
                        </p>
                    </CourseSection>

                    {/* Learning Objective */}
                    <CourseSection icon={<img src="/icons/Goal.svg" alt="Goal" className="w-5 h-5" />} title="Learning Objective">
                        <div className="flex flex-col gap-3">
                            {PAGE_DATA.learningObjectives.map((obj) => (
                                <div key={obj.id} className="grid grid-cols-[3rem_1fr] text-sm gap-2">
                                    <span className="text-gray-500 font-medium">{obj.id}</span>
                                    <span className="text-gray-700">{obj.text}</span>
                                </div>
                            ))}
                        </div>
                    </CourseSection>

                    {/* Entry Skills */}
                    <CourseSection icon={<img src="/icons/Skill.svg" alt="EntrySkills" className="w-5 h-5" />} title="Entry Skills">
                        <ol className="list-decimal pl-4 flex flex-col gap-3 text-sm text-gray-700">
                            {PAGE_DATA.entrySkills.map((skill, i) => (
                                <li key={i}>{skill}</li>
                            ))}
                        </ol>
                    </CourseSection>

                    {/* Tools */}
                    <CourseSection icon={<img src="/icons/Tool.svg" alt="Tools" className="w-5 h-5" />} title="Tools">
                        <ul className="list-disc pl-4 flex flex-col gap-2 text-sm text-gray-700">
                            {PAGE_DATA.tools.map((tool, i) => (
                                <li key={i}>{tool}</li>
                            ))}
                        </ul>
                    </CourseSection>

                    {/* Sessions & Assignments */}
                    <div className="flex flex-col gap-6 pt-8">
                        {PAGE_DATA.sessions.map((session, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between group cursor-pointer border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                                onClick={() => router.push(`/classes/${classId}/course/${courseId}/session/${session.id}`)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-gray-700">
                                        {session.title.includes("Video") ? <img src="/icons/Video.svg" alt="Video" className="w-5 h-5" /> :
                                            session.title.includes("Zoom") ? <img src="/icons/Zoom.svg" alt="Zoom" className="w-5 h-5" /> :
                                                <img src="/icons/Task.svg" alt="Assignment" className="w-5 h-5" />}
                                    </div>
                                    <div className="flex items-center">
                                        <h3 className="text-sm font-bold text-gray-900">{session.title}</h3>
                                        <SessionTag label={session.type} />
                                    </div>
                                </div>
                                <div className="text-gray-300 group-hover:text-gray-500 transition-colors">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
