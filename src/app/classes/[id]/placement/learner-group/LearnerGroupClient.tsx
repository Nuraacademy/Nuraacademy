"use client"

import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

interface Course {
    id: number;
    title: string;
}

interface LearnerStatus {
    enrollmentId: number;
    name: string;
    group: string;
    courses: {
        courseId: number;
        isPassed: boolean;
    }[];
}

interface StatusData {
    learners: LearnerStatus[];
    courses: Course[];
}

export default function LearnerGroupClient({
    classId,
    classTitle,
    initialData
}: {
    classId: number;
    classTitle: string;
    initialData: StatusData;
}) {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans text-gray-800 pb-20">
            {/* Background Images */}
            <img src="/background/OvalBGLeft.svg" alt="" className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none" />
            <img src="/background/OvalBGRight.svg" alt="" className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8">
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Placement Test", href: `/classes/${classId}/test` },
                            { label: classTitle, href: `/classes/${classId}/overview` },
                            { label: "Learner Group", href: "#" },
                        ]}
                    />
                </div>

                <div className="bg-[#00524D] rounded-2xl p-6 mb-10">
                    <h1 className="text-2xl font-bold text-white">Learner Group</h1>
                </div>

                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-black">Student Course Pass List</h2>
                    </div>

                    {/* Matrix Table */}
                    <div className="w-full border border-black rounded-[2rem] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-8 py-5 text-sm font-semibold text-black">Name</th>
                                    {initialData.courses.map(course => (
                                        <th key={course.id} className="px-4 py-5 text-sm font-semibold text-black text-center">
                                            {course.title}
                                        </th>
                                    ))}
                                    <th className="px-8 py-5 text-sm font-semibold text-black text-center">Group</th>
                                </tr>
                            </thead>
                            <tbody>
                                {initialData.learners.map((learner, idx) => (
                                    <tr key={learner.enrollmentId} className={idx !== initialData.learners.length - 1 ? "border-b border-gray-100" : ""}>
                                        <td className="px-8 py-6 text-sm text-black font-medium">{learner.name}</td>
                                        {initialData.courses.map(course => {
                                            const status = learner.courses.find(c => c.courseId === course.id);
                                            return (
                                                <td key={course.id} className="px-4 py-6 text-center">
                                                    {status?.isPassed && (
                                                        <div className="inline-flex items-center justify-center w-6 h-6 bg-black rounded-md">
                                                            <Check size={16} className="text-white" />
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="px-8 py-6 text-sm text-black text-center">{learner.group}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <NuraButton
                            label="Create Group"
                            onClick={() => router.push(`/classes/${classId}/placement/create-group`)}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
