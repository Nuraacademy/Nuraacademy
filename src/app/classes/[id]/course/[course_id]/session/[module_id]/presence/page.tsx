import { getSessionDetails } from "@/controllers/courseController";
import { getCourseDetails } from "@/controllers/courseController";
import { getClassDetails } from "@/controllers/classController";
import { getEnrolledLearners } from "@/controllers/enrollmentController";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { PresenceClient } from "./components/presence_client";

export default async function PresenceAndSESPage({ params }: { params: Promise<{ id: string, course_id: string, module_id: string }> }) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const [session, course, classInfo, learners] = await Promise.all([
        getSessionDetails(moduleId),
        getCourseDetails(courseId),
        getClassDetails(classId),
        getEnrolledLearners(classId)
    ]);

    if (!session || !course || !classInfo) {
        return <div className="p-10 text-center">Data not found</div>;
    }

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: classInfo.title, href: `/classes/${classId}/overview` },
        { label: course.title, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: session.title, href: `/classes/${classId}/course/${courseId}/session/${moduleId}` },
        { label: "Presence & SES", href: "" },
    ];

    const studentPresence = learners.map(l => ({
        id: l.user.id,
        name: l.user.name || "Anonymous",
        status: (session as any).presences.find((p: any) => p.userId === l.user.id)?.present ? "attend" : "absent",
        sesScore: 0 // Mock as it's not in schema
    }));

    return (
        <main className="min-h-screen bg-[#F5F5EC] font-sans text-gray-800 pb-12">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Banner */}
                <div className="bg-[#005954] rounded-2xl p-6 mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-white">Presence & SES</h1>
                </div>

                {/* Content Card */}
                <PresenceClient
                    classId={classId}
                    courseId={courseId}
                    moduleId={moduleId}
                    className={classInfo.title}
                    moduleName={session.title}
                    studentPresence={studentPresence}
                />
            </div>
        </main>
    );
}
