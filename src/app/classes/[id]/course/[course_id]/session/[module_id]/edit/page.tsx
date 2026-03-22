import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { getSessionById } from "@/controllers/sessionController";
import { getCourseById } from "@/controllers/courseController";
import { notFound } from "next/navigation";
import EditSessionForm from "@/app/classes/[id]/course/[course_id]/session/[module_id]/edit/edit_form";
import TitleCard from "@/components/ui/card/title_card";

export default async function EditSessionPage({
    params
}: {
    params: Promise<{ id: string; course_id: string; module_id: string }>
}) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const isNew = moduleId === "new";

    let sessionTitle = "New Session";
    let classTitle = "Class";
    let courseTitle = "Course";
    let schedule: any = null;
    let content: any = {};
    let referenceMaterials: any[] = [];
    let initialIsSynchronous = false;

    if (isNew) {
        const course = await getCourseById(parseInt(courseId));
        if (!course) return notFound();
        courseTitle = course.title;
        classTitle = course.class?.title || "Class";
    } else {
        const session = await getSessionById(parseInt(moduleId));
        if (!session) return notFound();

        sessionTitle = session.title;
        classTitle = session.course?.class?.title || "Class";
        courseTitle = session.course?.title || "Course";
        initialIsSynchronous = session.isSynchronous || false;

        // Parse JSON fields safely
        const parseJson = (val: any) => {
            if (!val) return null;
            if (typeof val === 'object') return val;
            try { return JSON.parse(val); } catch { return null; }
        };

        schedule = parseJson(session.schedule);
        content = parseJson(session.content) || {};
        const reference = parseJson(session.reference) || [];

        // Ensure reference is an array
        referenceMaterials = Array.isArray(reference)
            ? reference
            : (reference.name ? [reference] : []);
    }

    const breadcrumbItems = [
        { label: "Home", href: "/classes" },
        { label: classTitle, href: `/classes/${classId}/overview` },
        { label: courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: isNew ? "New Session" : sessionTitle, href: isNew ? "#" : `/classes/${classId}/course/${courseId}/session/${moduleId}` }
    ];

    return (
        <main className="min-h-screen bg-[#FDFDF7]  pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Hero Title */}
                <TitleCard title={isNew ? "Create New Session" : `Edit Session: ${sessionTitle}`} />

                {/* Edit Form */}
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                    <EditSessionForm
                        classId={classId}
                        courseId={courseId}
                        moduleId={moduleId}
                        initialTitle={isNew ? "" : sessionTitle}
                        initialIsSynchronous={initialIsSynchronous}
                        initialSchedule={schedule}
                        initialContent={content}
                        initialReference={referenceMaterials}
                    />
                </div>
            </div>
        </main>
    );
}
