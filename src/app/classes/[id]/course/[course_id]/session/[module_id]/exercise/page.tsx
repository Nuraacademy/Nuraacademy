"use client"

import Sidebar from "@/components/ui/sidebar/sidebar";
import { useState } from "react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { useRouter, useParams } from "next/navigation";

export default function ExercisePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    return (
        <main className={`relative bg-[#FDFDF7] min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 ${isSidebarOpen ? "md:pl-80" : "md:pl-8"}`}>
            {/* Sidebar */}
            <Sidebar onOpenChange={setIsSidebarOpen} />

            {/* Content */}
            <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] md:px-12 w-full max-w-screen-2xl mx-auto gap-4 z-10 relative">
                <div className="flex-none flex-col items-end justify-between space-y-4">
                    <div>
                        <Breadcrumb
                            items={[
                                { label: "Home", href: "/" },
                                { label: "Foundation of Data Analytics", href: `/classes/${params.id}/overview` },
                                { label: "Introduction to Programming", href: `/classes/${params.id}/course/${params.course_id}/overview` },
                                { label: "Exercise", href: "#" },
                            ]}
                        />
                        <h1 className="text-4xl font-bold mt-6 text-black">
                            Exercise
                        </h1>
                    </div>
                    {/* Main Content Card */}
                    <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-8">
                        {/* Dates */}
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-bold text-black">
                                    Print
                                </h1>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-700">
                                    In this exercise, you will learn how to print text to the console.
                                </p>
                            </div>
                        </div>
    
                        <div className="border-t border-gray-100"></div>
    
                        {/* Detail Tugas */}
                        <div className="flex flex-col gap-2 text-sm">
                            <span className="font-bold text-gray-900">Detail Tugas</span>
                            <p className="text-gray-700 leading-relaxed">Kunjungi Google Colab lalu kerjakan exercise yang ada di dalamnya. Apabila anda ingin tahu jawabannya, exercise tidak akan dinilai jadi jangan takut salah!</p>
                        </div>
    
                        {/* Footer Buttons */}
                        <div className="flex justify-center gap-6 pt-4">
                            <button
                                className="text-sm font-semibold text-gray-900 hover:text-gray-700"
                                onClick={() => router.back()}
                            >
                                Back
                            </button>
                            <NuraButton
                                label="Open in Colab"
                                variant="primary"
                                onClick={() => window.open("https://colab.research.google.com/github/Nuraacademy/Exercise/blob/main/example_notebook.ipynb", "_blank")}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
