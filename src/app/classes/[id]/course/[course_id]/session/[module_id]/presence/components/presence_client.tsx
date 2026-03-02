"use client"

import { useRouter } from "next/navigation";
import { NuraButton } from "@/components/ui/button/button";

export function PresenceClient({
    classId,
    courseId,
    moduleId,
    className,
    moduleName,
    studentPresence
}: {
    classId: string,
    courseId: string,
    moduleId: string,
    className: string,
    moduleName: string,
    studentPresence: any[]
}) {
    const router = useRouter();

    const handleBack = () => {
        router.push(`/classes/${classId}/course/${courseId}/session/${moduleId}`);
    };

    return (
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-black">{moduleName}</h2>
                <p className="text-sm text-gray-600 mt-1">{className}</p>
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
                            <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center p-1 cursor-pointer`}>
                                {student.status === "attend" && <div className="w-full h-full bg-black rounded-full" />}
                            </div>
                        </div>
                        <div className="col-span-1.5 flex justify-center">
                            <div className={`w-6 h-6 rounded-full border-1 border-gray-300 flex items-center justify-center p-1 cursor-not-allowed opacity-50`}>
                                {student.status === "sick" && <div className="w-full h-full bg-black rounded-full" />}
                            </div>
                        </div>
                        <div className="col-span-1.5 flex justify-center">
                            <div className={`w-6 h-6 rounded-full border-1 border-gray-300 flex items-center justify-center p-1 cursor-not-allowed opacity-50`}>
                                {student.status === "permit" && <div className="w-full h-full bg-black rounded-full" />}
                            </div>
                        </div>
                        <div className="col-span-1.5 flex justify-center">
                            <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center p-1 cursor-pointer`}>
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

            <style jsx>{`
                .grid-cols-12 {
                    display: grid;
                    grid-template-columns: repeat(12, minmax(0, 1fr));
                }
                .col-span-1\\.5 {
                    grid-column: span 1.5 / span 1.5;
                }
            `}</style>
        </div>
    );
}
