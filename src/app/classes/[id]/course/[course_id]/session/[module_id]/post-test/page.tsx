import { getSessionDetails } from "@/controllers/courseController";
import { getCourseDetails } from "@/controllers/courseController";
import { getClassDetails } from "@/controllers/classController";
import { getPostTest } from "@/controllers/assessmentController";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { PostTestClient } from "./components/post_test_client";

export default async function PostTestPage({ params }: { params: Promise<{ id: string, course_id: string, module_id: string }> }) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const [session, course, classInfo, postTest] = await Promise.all([
        getSessionDetails(moduleId),
        getCourseDetails(courseId),
        getClassDetails(classId),
        getPostTest(moduleId)
    ]);

    if (!session || !course || !classInfo || !postTest) {
        return <div className="p-10 text-center">Data not found</div>;
    }

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: classInfo.title, href: `/classes/${classId}/overview` },
        { label: course.title, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: session.title, href: `/classes/${classId}/course/${courseId}/session/${moduleId}` },
        { label: postTest.title, href: "#" },
    ];

    const formattedQuestions = postTest.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        points: q.points,
        order: q.order
    }));

    const testData = {
        courseName: course.title,
        sessionName: session.title,
        durationMinutes: postTest.durationMinutes || 30
    };

    return (
        <main className="min-h-screen bg-[#FDFDF7] font-sans pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                <div className="mb-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <section className="bg-[#005954] rounded-[1.5rem] p-6 mb-8 flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-bold text-white">{postTest.title}</h1>
                        <p className="text-xs text-white/80">
                            {classInfo.title} | {course.title} | {session.title}
                        </p>
                    </div>
                </section>

                <PostTestClient
                    classId={classId}
                    testId={postTest.id}
                    questions={formattedQuestions}
                    testData={testData}
                />
            </div>
        </main>
    );
}
