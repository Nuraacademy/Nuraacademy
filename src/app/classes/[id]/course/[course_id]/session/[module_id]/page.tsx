import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { getSessionById } from "@/controllers/sessionController";
import { notFound } from "next/navigation";
import SessionContent from "./session_content";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { hasPermission } from "@/lib/rbac";

export default async function SessionPage({
    params
}: {
    params: Promise<{ id: string; course_id: string; module_id: string }>
}) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const session = await getSessionById(parseInt(moduleId));
    if (!session) {
        return notFound();
    }

    const classTitle = session.course?.class?.title || "Class";
    const courseTitle = session.course?.title || "Course";
    const isAsync = session.isSynchronous === false;
    const canUpdateSession = await hasPermission("Session", "UPDATE_SESSION");

    // Parse JSON fields safely
    const parseJson = (val: any) => {
        if (!val) return null;
        if (typeof val === 'object') return val;
        try { return JSON.parse(val); } catch { return null; }
    };

    const content = parseJson(session.content);
    const schedule = parseJson(session.schedule);
    const reference = parseJson(session.reference);

    // Build time string from schedule
    const timeString = schedule?.date
        ? new Date(schedule.date).toLocaleString("en-US", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "TBA";

    // Build reference materials array
    const referenceMaterials: { name: string; description: string; url: string }[] = [];
    if (reference) {
        if (Array.isArray(reference)) {
            referenceMaterials.push(...reference);
        } else if (reference.name) {
            referenceMaterials.push(reference);
        }
    }

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: classTitle, href: `/classes/${classId}/overview` },
        { label: courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: session.title, href: "#" },
    ];

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Hero Title with Badge & Admin Edit */}
                <section className="bg-[#005954] rounded-[1.5rem] p-6 mb-8 flex items-center justify-between gap-4">
                    <h1 className="text-xl font-bold text-white">
                        {session.title}
                    </h1>
                    {canUpdateSession && (
                        <Link
                            href={`/classes/${classId}/course/${courseId}/session/${moduleId}/edit`}
                            className="flex items-center gap-2 bg-white text-[#005954] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            <Pencil size={18} />
                            Edit Session
                        </Link>
                    )}
                </section>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col gap-8">
                    {/* Time Section */}
                    <div>
                        <p className="text-sm">
                            <span className="font-bold text-gray-900 mr-2">Time:</span>
                            <span className="text-gray-700">{timeString}</span>
                        </p>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Type-specific content rendered via Client Component */}
                    <SessionContent
                        classId={classId}
                        courseId={courseId}
                        moduleId={moduleId}
                        isSynchronous={session.isSynchronous}
                        content={content}
                        referenceMaterials={referenceMaterials}
                    />
                </div>
            </div>
        </main>
    );
}
