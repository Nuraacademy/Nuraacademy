"use client"

import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";

export default function PresenceAndSESPage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id as string;
    const courseId = params.course_id as string;
    const moduleId = params.module_id as string;

    const courseData = {
        className: "Foundation to Data Analytics",
        moduleName: "Introduction to Programming",
    };

    const studentPresence = [
        { name: "Learner A", status: "attend", sesScore: 15 },
        { name: "Learner B", status: "sick", sesScore: 0 },
        { name: "Learner C", status: "attend", sesScore: 30 },
    ];

    const handleBack = () => {
        router.push(`/classes/${id}/course/${courseId}/session/${moduleId}`);
    };

    return (
        <main className="min-h-screen bg-[#F5F5EC] font-sans text-gray-800 pb-12">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Class", href: "/classes" },
                            { label: courseData.className, href: `/classes/${id}/overview` },
                            { label: courseData.moduleName, href: `/classes/${id}/course/${courseId}/overview` },
                            { label: "Zoom Session", href: `/classes/${id}/course/${courseId}/session/${moduleId}` },
                            { label: "Presence & SES", href: "" },
                        ]}
                    />
                </div>

                {/* Banner */}
                <div className="bg-[#005954] rounded-2xl p-6 mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-white">Presence & SES</h1>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-black">{courseData.moduleName}</h2>
                        <p className="text-sm text-gray-600 mt-1">{courseData.className}</p>
                    </div>

                    <hr className="border-gray-200 mb-8" />

                    <h3 className="text-lg font-bold text-black mb-6">Student Presence List</h3>

                    {/* Presence Table */}
                    <div className="w-full border border-black rounded-[1.5rem] overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 border-b border-black bg-white px-8 py-5">
                            <div className="col-span-3 text-sm font-semibold text-black text-left">Name</div>
                            <div className="col-span-1.5 text-sm font-semibold text-black text-center">Attend</div>
                            <div className="col-span-1.5 text-sm font-semibold text-black text-center">Sick</div>
                            <div className="col-span-1.5 text-sm font-semibold text-black text-center">Permit</div>
                            <div className="col-span-1.5 text-sm font-semibold text-black text-center">Absent</div>
                            <div className="col-span-3 text-sm font-semibold text-black text-right">SES Score</div>
                        </div>

                        {/* Table Rows */}
                        {studentPresence.map((student, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-12 px-8 py-5 border-black ${index !== studentPresence.length - 1 ? 'border-b' : ''} bg-white items-center`}
                            >
                                <div className="col-span-3 text-sm text-black font-medium">{student.name}</div>

                                {/* Radio Buttons Simulation */}
                                <div className="col-span-1.5 flex justify-center">
                                    <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center p-1`}>
                                        {student.status === "attend" && <div className="w-full h-full bg-black rounded-full" />}
                                    </div>
                                </div>
                                <div className="col-span-1.5 flex justify-center">
                                    <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center p-1`}>
                                        {student.status === "sick" && <div className="w-full h-full bg-black rounded-full" />}
                                    </div>
                                </div>
                                <div className="col-span-1.5 flex justify-center">
                                    <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center p-1`}>
                                        {student.status === "permit" && <div className="w-full h-full bg-black rounded-full" />}
                                    </div>
                                </div>
                                <div className="col-span-1.5 flex justify-center">
                                    <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center p-1`}>
                                        {student.status === "absent" && <div className="w-full h-full bg-black rounded-full" />}
                                    </div>
                                </div>

                                <div className="col-span-3 text-sm text-black text-right pr-4">{student.sesScore}</div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-12 flex justify-center">
                        <NuraButton
                            label="Back to Session"
                            variant="primary"
                            className="min-w-[200px]"
                            onClick={handleBack}
                        />
                    </div>
                </div>
            </div>

            {/* Minor Layout Correction for the Responsive Grid Columns */}
            <style jsx>{`
                .grid-cols-12 {
                    display: grid;
                    grid-template-columns: repeat(12, minmax(0, 1fr));
                }
                .col-span-1\\.5 {
                    grid-column: span 1.5 / span 1.5;
                }
            `}</style>
        </main>
    );
}
