import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { getSessionById, getSessionPresence } from "@/controllers/sessionController";
import { notFound } from "next/navigation";
import PresenceClient from "./presence_client";
import { hasPermission } from "@/lib/rbac";
import TitleCard from "@/components/ui/card/title_card";

export default async function PresenceAndSESPage({
    params
}: {
    params: Promise<{ id: string, course_id: string, module_id: string }>
}) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const [session, enrollments, canEdit] = await Promise.all([
        getSessionById(parseInt(moduleId)),
        getSessionPresence(parseInt(moduleId)),
        hasPermission('Presence', 'CREATE_UPDATE_PRESENCE_SES')
    ]);

    if (!session) {
        return notFound();
    }

    const classTitle = session.course?.class?.title || "Class";
    const courseTitle = session.course?.title || "Course";

    const STATUS_SCORES: Record<string, number> = {
        "attend": 4,
        "sick": 3,
        "permit": 2,
        "absent": 0
    };

    const studentPresence = enrollments.map(enrollment => {
        const ses = enrollment.ses[0]; // Get the SES for this session
        const status = ses?.status || "absent";
        return {
            enrollmentId: enrollment.id,
            name: enrollment.user?.name || enrollment.user?.username || "Unknown",
            status: status,
            sesScore: STATUS_SCORES[status] || 0
        };
    });

    const breadcrumbItems = [
        { label: "Home", href: "/classes" },
        { label: classTitle, href: `/classes/${classId}/overview` },
        { label: courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: session.title, href: `/classes/${classId}/course/${courseId}/session/${moduleId}` },
        { label: "Presence & SES", href: "" },
    ];

    return (
        <main className="min-h-screen bg-[#F5F5EC]  text-gray-800 pb-12">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <TitleCard title="Presence & SES" />

                {/* Content Card */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="mb-8">
                        <h2 className="text-xl font-medium text-black">{session.title}</h2>
                        <p className="text-sm text-gray-600 mt-1">{classTitle}</p>
                    </div>

                    <hr className="border-gray-200 mb-8" />

                    <h3 className="text-lg font-medium text-black mb-6">Student Presence List</h3>

                    {/* Interactive Table via Client Component */}
                    <PresenceClient
                        classId={classId}
                        courseId={courseId}
                        moduleId={moduleId}
                        initialStudents={studentPresence}
                        canEdit={canEdit}
                    />
                </div>
            </div>
        </main>
    );
}
