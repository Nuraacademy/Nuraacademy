import { getCourseDetails } from "@/controllers/courseController";
import { ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import Link from "next/link";

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

export default async function CourseOverviewPage({ params }: { params: Promise<{ id: string, course_id: string }> }) {
    const { id: classId, course_id: courseId } = await params;

    const course = await getCourseDetails(courseId);

    if (!course) {
        return <div className="p-10 text-center">Course not found</div>;
    }

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Class Overview", href: `/classes/${classId}/overview` },
        { label: course.title, href: `#` },
    ];

    const getSessionIcon = (title: string) => {
        const lower = title.toLowerCase();
        if (lower.includes("video")) return <img src="/icons/Video.svg" alt="Video" className="w-5 h-5" />;
        if (lower.includes("zoom") || lower.includes("synch")) return <img src="/icons/Zoom.svg" alt="Zoom" className="w-5 h-5" />;
        return <img src="/icons/Task.svg" alt="Assignment" className="w-5 h-5" />;
    };

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
                    <CourseSection icon={<img src="/icons/Information.svg" alt="Information" className="w-5 h-5" />} title="Course Description">
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {course.description}
                        </p>
                    </CourseSection>

                    {/* Learning Objective */}
                    {course.learningObjectives.length > 0 && (
                        <CourseSection icon={<img src="/icons/Goal.svg" alt="Goal" className="w-5 h-5" />} title="Learning Objective">
                            <div className="flex flex-col gap-3">
                                {course.learningObjectives.map((obj: any, index: number) => (
                                    <div key={obj.id} className="grid grid-cols-[3rem_1fr] text-sm gap-2">
                                        <span className="text-gray-500 font-medium">{index + 1}</span>
                                        <span className="text-gray-700">{obj.text}</span>
                                    </div>
                                ))}
                            </div>
                        </CourseSection>
                    )}

                    {/* Entry Skills */}
                    {course.entrySkills.length > 0 && (
                        <CourseSection icon={<img src="/icons/Skill.svg" alt="EntrySkills" className="w-5 h-5" />} title="Entry Skills">
                            <ol className="list-decimal pl-4 flex flex-col gap-3 text-sm text-gray-700">
                                {course.entrySkills.map((skill: any) => (
                                    <li key={skill.id}>{skill.text}</li>
                                ))}
                            </ol>
                        </CourseSection>
                    )}

                    {/* Tools */}
                    {course.tools.length > 0 && (
                        <CourseSection icon={<img src="/icons/Tool.svg" alt="Tools" className="w-5 h-5" />} title="Tools">
                            <ul className="list-disc pl-4 flex flex-col gap-2 text-sm text-gray-700">
                                {course.tools.map((tool: any) => (
                                    <li key={tool.id}>{tool.name}</li>
                                ))}
                            </ul>
                        </CourseSection>
                    )}

                    {/* Sessions & Assignments */}
                    <div className="flex flex-col gap-6 pt-8">
                        {course.sessions.map((session: any) => (
                            <Link
                                key={session.id}
                                href={`/classes/${classId}/course/${courseId}/session/${session.id}`}
                                className="flex items-center justify-between group cursor-pointer border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-gray-700">
                                        {getSessionIcon(session.title)}
                                    </div>
                                    <div className="flex items-center">
                                        <h3 className="text-sm font-bold text-gray-900">{session.title}</h3>
                                        <SessionTag label={session.type} />
                                    </div>
                                </div>
                                <div className="text-gray-300 group-hover:text-gray-500 transition-colors">
                                    <ChevronRight size={20} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
