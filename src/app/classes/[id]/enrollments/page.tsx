import { getEnrollmentsByClassId } from "@/controllers/enrollmentController";
import { getClassById } from "@/controllers/classController";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { notFound } from "next/navigation";
import Image from "next/image";
import EnrollmentTableClient from "./EnrollmentTableClient";

export default async function ClassEnrollmentsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const classId = parseInt(id);
    if (isNaN(classId)) notFound();

    const classData = await getClassById(classId) as any;
    if (!classData) notFound();

    const enrollments = await getEnrollmentsByClassId(classId) as any[];

    return (
        <main className="min-h-screen bg-[#FDFDF8] p-6 lg:p-12 text-[#1C3A37]">
            <div className="max-w-[1600px] mx-auto">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-4">
                        <Breadcrumb
                            items={[
                                { label: "Dashboard", href: "/classes" },
                                { label: classData.title, href: `/classes/${id}/overview` },
                                { label: "Enrollment Roster", href: `/classes/${id}/enrollments` },
                            ]}
                        />
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black drop-shadow-sm">Learner Roster</h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col items-end mr-4">
                            <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Total Enrolled</span>
                            <span className="text-sm font-bold text-gray-800">{enrollments.length || 0}</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm text-gray-400">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                    </div>
                </div>

                <section className="bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-blue-900/5 min-h-[70vh] border border-gray-50 flex flex-col">
                    <EnrollmentTableClient enrollments={enrollments} />
                </section>
                
                <footer className="mt-12 text-center opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Nura Academy • Advanced Class Management System</p>
                </footer>
            </div>
        </main>
    );
}
