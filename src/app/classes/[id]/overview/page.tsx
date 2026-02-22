"use client"

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";

export default function CourseOverviewPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const [id, setId] = useState("");
    const router = useRouter();
    useEffect(() => {
        params.then(p => setId(p.id)).catch(() => { });
    }, [params]);

    const imageUrl = "https://www.lackawanna.edu/wp-content/uploads/2024/08/male-tutor-teaching-university-students-in-classro-2023-11-27-05-16-59-utc.webp";

    const classData = {
        title: "Foundation to Data Analytics",
        hours: 55,
        modules: 5,
        methods: "Flipped blended classroom",
        scheduleStart: "22/2/2026",
        scheduleEnd: "31/5/2026",
        description:
            "Kelas Introduction to Programming dirancang untuk pemula yang ingin memahami dasar-dasar pemrograman menggunakan Python. Peserta akan mempelajari konsep fundamental seperti variabel, tipe data, selection statement, looping, function, serta pengolahan file dan data sederhana. Kelas ini menekankan pada pemahaman logika berpikir komputasional dan praktik langsung agar peserta mampu membangun program sederhana secara terstruktur dan sistematis.",
        whatYouWillLearn: [
            "Konsep dasar pemrograman dan aturan penulisan kode Python",
            "Penggunaan variabel dan tipe data",
            "Selection statement (if, elif, else)",
            "Looping statement (for, while)",
            "Pembuatan dan penggunaan function",
            "Pengolahan flat files (CSV) menggunakan Python",
            "Modifikasi array (list) menggunakan function",
            "Manipulasi dan modifikasi DataFrame menggunakan pandas",
            "Best practices dalam menulis kode yang rapi dan reusable",
            "Dasar logika pemrograman untuk analisis data",
        ],
        courses: [
            {
                id: "1",
                title: "Final Project",
                description: "Proyek akhir yang menguji pemahaman peserta terhadap keseluruhan course yang telah diikuti",
            },
        ],
    };

    return (
        <main className="min-h-screen bg-[#F5F5EC] font-sans text-gray-800">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">

                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Class", href: "/classes" },
                            { label: classData.title, href: `/classes/${id}/overview` },
                        ]}
                    />
                </div>

                {/* Hero Card */}
                <section className="relative bg-gradient-to-r from-[#005954] to-[#94B546] rounded-[2rem] overflow-hidden mb-8 flex flex-col md:flex-row items-stretch gap-0">
                    {/* Image */}
                    <div className="w-full md:w-[280px] shrink-0">
                        <img
                            src={imageUrl}
                            alt="Course"
                            className="w-full h-full object-cover"
                            style={{ minHeight: "220px" }}
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-grow p-8 text-white">
                        <h1 className="text-2xl font-bold mb-3">{classData.title}</h1>

                        {/* Hours & Modules */}
                        <div className="flex items-center gap-5 text-sm mb-5">
                            <div className="flex items-center gap-1.5">
                                <img
                                    src="/icons/ClockWhite.svg"
                                    alt="Clock"
                                    className="w-4 h-4"
                                />
                                <span>{classData.hours} hours</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <img
                                    src="/icons/Modules.svg"
                                    alt="Modules"
                                    className="w-4 h-4"
                                />
                                <span>{classData.modules} modules</span>
                            </div>
                        </div>

                        {/* Methods & Schedules */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm mb-5">
                            <div>
                                <p className="font-semibold text-white/80 mb-0.5">Methods</p>
                                <p>{classData.methods}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-white/80 mb-0.5">Schedules</p>
                                <p>{classData.scheduleStart} - {classData.scheduleEnd}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="text-sm leading-relaxed text-white/90">
                            <p className="font-semibold text-white/80 mb-1">Description</p>
                            <p>{classData.description}</p>
                        </div>
                    </div>
                </section>

                {/* Main Grid: Left + Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column */}
                    <aside className="lg:col-span-4 flex flex-col gap-6">
                        {/* What You Will Learn */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-4">What You Will Learn</h2>
                            <ol className="list-decimal ml-5 text-sm text-gray-700 space-y-2">
                                {classData.whatYouWillLearn.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ol>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold">Timeline</h2>
                            <NuraButton label="Add Timeline" variant="primary" />
                        </div>
                    </aside>

                    {/* Right Column */}
                    <section className="lg:col-span-8 flex flex-col gap-6">
                        {/* Placement Test */}
                        <div className="bg-[#1C3A37] rounded-[2rem] px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Placement Test</h2>
                            <NuraButton label="Create Test" variant="primary" onClick={() => router.push(`/classes/${id}/test/create`)} />
                        </div>

                        {/* Courses */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Courses</h2>
                                <NuraButton label="Add Course" variant="primary" />
                            </div>

                            <div className="flex flex-col gap-4">
                                {classData.courses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="border border-gray-200 rounded-[1.5rem] p-5"
                                    >
                                        <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                                        <p className="text-sm text-gray-600">{course.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}