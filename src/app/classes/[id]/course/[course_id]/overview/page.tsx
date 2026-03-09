import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { getCourseById } from "@/controllers/courseController";
import { notFound } from "next/navigation";
import CourseSessionLink from "./course_session_links";
import AddSessionButton from "./add_session_button";
import { hasPermission } from "@/lib/rbac";

interface SectionProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

const CourseSection = ({ icon, title, children }: SectionProps) => (
    <div className="flex flex-col gap-4 py-8 first:pt-0 border-b border-gray-100 last:border-0 last:pb-0">
        <div className="flex items-center gap-3">
            <div className="text-gray-700">
                {icon}
            </div>
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
        </div>
        <div className="pl-9">
            {children}
        </div>
    </div>
);

const SessionTag = ({ label }: { label: string }) => {
    if (label === "None" || !label) return null;
    return (
        <span className="ml-3 px-3 py-0.5 text-[10px] font-medium border border-gray-300 rounded-full text-gray-500 bg-gray-50">
            {label}
        </span>
    );
};

export default async function CourseOverviewPage({
    params
}: {
    params: Promise<{ id: string; course_id: string }>
}) {
    const { id: classId, course_id: courseId } = await params;

    const course = await getCourseById(parseInt(courseId));
    if (!course) {
        return notFound();
    }

    const classTitle = course.class?.title || "Class";
    const canCreateSession = await hasPermission("Session", "CREATE_SESSION");
    const canUpdateSession = await hasPermission("Session", "UPDATE_SESSION");

    // Parse JSON-like string fields if they were stored as JSON strings
    const parseLearningObjectives = (raw: string | null): { id: string; text: string }[] => {
        if (!raw) return [];
        try { return JSON.parse(raw); } catch { return [{ id: "1", text: raw }]; }
    };

    const parseStringList = (raw: string | null): string[] => {
        if (!raw) return [];
        try { return JSON.parse(raw); } catch { return [raw]; }
    };

    const learningObjectives = parseLearningObjectives(course.learningObjectives);
    const entrySkills = parseStringList(course.entrySkills);
    const tools = parseStringList(course.tools);

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: classTitle, href: `/classes/${classId}/overview` },
        { label: course.title, href: `#` },
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
                    <h1 className="text-xl font-bold text-white">{course.title}</h1>
                </section>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col">
                    {/* Course Description */}
                    {course.description && (
                        <CourseSection icon={<img src="/icons/Information.svg" alt="Information" className="w-5 h-5" />} title="Course Description">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {course.description}
                            </p>
                        </CourseSection>
                    )}

                    {/* Learning Objective */}
                    {learningObjectives.length > 0 && (
                        <CourseSection icon={<img src="/icons/Goal.svg" alt="Goal" className="w-5 h-5" />} title="Learning Objective">
                            <div className="flex flex-col gap-3">
                                {learningObjectives.map((obj, index) => (
                                    <div key={obj.id || index} className="grid grid-cols-[3rem_1fr] text-sm gap-2">
                                        <span className="text-gray-500 font-medium">{obj.id}</span>
                                        <span className="text-gray-700">{obj.text}</span>
                                    </div>
                                ))}
                            </div>
                        </CourseSection>
                    )}

                    {/* Entry Skills */}
                    {entrySkills.length > 0 && (
                        <CourseSection icon={<img src="/icons/Skill.svg" alt="EntrySkills" className="w-5 h-5" />} title="Entry Skills">
                            <ol className="list-decimal pl-4 flex flex-col gap-3 text-sm text-gray-700">
                                {entrySkills.map((skill, i) => (
                                    <li key={i}>{skill}</li>
                                ))}
                            </ol>
                        </CourseSection>
                    )}

                    {/* Tools */}
                    {tools.length > 0 && (
                        <CourseSection icon={<img src="/icons/Tool.svg" alt="Tools" className="w-5 h-5" />} title="Tools">
                            <ul className="list-disc pl-4 flex flex-col gap-2 text-sm text-gray-700">
                                {tools.map((tool, i) => (
                                    <li key={i}>{tool}</li>
                                ))}
                            </ul>
                        </CourseSection>
                    )}

                    {/* Sessions & Assignments */}
                    <div className="flex flex-col gap-6 pt-8">
                        {course.sessions?.map((session) => (
                            <CourseSessionLink
                                key={session.id}
                                classId={classId}
                                courseId={courseId}
                                session={{
                                    id: String(session.id),
                                    title: session.title,
                                    type: session.isSynchronous === true ? "Synchronous" : session.isSynchronous === false ? "Asynchronous" : "None"
                                }}
                                isAdmin={canUpdateSession}
                            />
                        ))}
                        {(!course.sessions || course.sessions.length === 0) && (
                            <p className="text-sm text-gray-500 italic">No sessions added yet.</p>
                        )}

                        {canCreateSession && (
                            <div className="flex justify-center mt-6">
                                <AddSessionButton classId={classId} courseId={courseId} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
