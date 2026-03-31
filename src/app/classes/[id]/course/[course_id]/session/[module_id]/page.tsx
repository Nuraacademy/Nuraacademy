import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { getAssignmentBySessionAndType } from "@/controllers/assignmentController";
import { getSessionById } from "@/controllers/sessionController";
import { notFound, redirect } from "next/navigation";
import SessionContent from "./session_content";
import Link from "next/link";
import { hasPermission } from "@/lib/rbac";
import TitleCard from "@/components/ui/card/title_card";
import Image from "next/image";
import { getSession } from "@/app/actions/auth";
import { getEnrollment } from "@/controllers/enrollmentController";
import { NotFoundState } from "@/components/ui/status/not_found_state";

export default async function SessionPage({
    params
}: {
    params: Promise<{ id: string; course_id: string; module_id: string }>
}) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const [session, preTest, postTest, currentUserId, canUpdateSession] = await Promise.all([
        getSessionById(parseInt(moduleId)),
        getAssignmentBySessionAndType(parseInt(moduleId), "PRETEST"),
        getAssignmentBySessionAndType(parseInt(moduleId), "POSTTEST"),
        getSession(),
        hasPermission("Session", "UPDATE_SESSION")
    ]);

    // Check if user is enrolled or has admin permission
    const enrollment = currentUserId ? await getEnrollment(currentUserId, parseInt(classId)) : null;
    const isEnrolled = !!enrollment;

    if (!isEnrolled && !canUpdateSession) {
        return <NotFoundState
            title="Not Enrolled"
            message="You are not enrolled in this class. Please enroll to access this session."
            href={`/classes/${classId}/enrollment`}
        />
    }

    if (!session) {
        return notFound();
    }

    const classTitle = session.course?.class?.title || "Class";
    const courseTitle = session.course?.title || "Course";
    const isAsync = session.isSynchronous === false;

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
        { label: "Home", href: "/classes" },
        { label: classTitle, href: `/classes/${classId}/overview` },
        { label: courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: session.title, href: "#" },
    ];

    return (
        <main className="min-h-screen bg-[#FDFDF7]  pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <TitleCard
                    title={session.title}
                    actions={
                        canUpdateSession && (
                            <Link
                                href={`/classes/${classId}/course/${courseId}/session/${moduleId}/edit`}
                                className="flex items-center gap-2 bg-white text-[#005954] px-4 py-2 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                            >
                                <Image src="/icons/Edit.svg" alt="Edit" width={20} height={20} />
                                Edit Session
                            </Link>
                        )
                    }
                />

                {/* Main Content Card */}
                <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 flex flex-col gap-8">
                    {/* Time Section */}
                    <div>
                        <p className="text-sm">
                            <span className="font-medium text-gray-900 mr-2">Time:</span>
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
                        isAdmin={canUpdateSession}
                        preTestId={preTest?.id}
                        postTestId={postTest?.id}
                    />
                </div>
            </div>
        </main>
    );
}
