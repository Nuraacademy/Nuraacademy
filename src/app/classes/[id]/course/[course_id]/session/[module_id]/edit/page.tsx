import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { getSessionById } from "@/controllers/sessionController";
import { notFound } from "next/navigation";
import EditSessionForm from "@/app/classes/[id]/course/[course_id]/session/[module_id]/edit/edit_form";

export default async function EditSessionPage({
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

    // Parse JSON fields safely
    const parseJson = (val: any) => {
        if (!val) return null;
        if (typeof val === 'object') return val;
        try { return JSON.parse(val); } catch { return null; }
    };

    const content = parseJson(session.content) || {};
    const reference = parseJson(session.reference) || [];

    // Ensure reference is an array
    const referenceMaterials = Array.isArray(reference)
        ? reference
        : (reference.name ? [reference] : []);

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: classTitle, href: `/classes/${classId}/overview` },
        { label: courseTitle, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: session.title, href: `/classes/${classId}/course/${courseId}/session/${moduleId}` }
    ];

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* Hero Title */}
                <section className="bg-[#005954] rounded-[1.5rem] p-6 mb-8">
                    <h1 className="text-xl font-bold text-white">
                        Edit Session: {session.title}
                    </h1>
                </section>

                {/* Edit Form */}
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                    <EditSessionForm
                        classId={classId}
                        courseId={courseId}
                        moduleId={moduleId}
                        initialContent={content}
                        initialReference={referenceMaterials}
                    />
                </div>
            </div>
        </main>
    );
}
