import { getExerciseDetails } from "@/controllers/courseController";
import Sidebar from "@/components/ui/sidebar/sidebar";
import { SidebarWrapper } from "./components/sidebar_wrapper";
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";

export default async function ExercisePage({ params }: { params: Promise<{ id: string, course_id: string, module_id: string }> }) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;

    const exercise = await getExerciseDetails(moduleId);

    if (!exercise) {
        return <div className="p-10 text-center">Exercise not found</div>;
    }

    const { session } = exercise;
    const { course } = session;
    const { class: classInfo } = course;

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: classInfo.title, href: `/classes/${classId}/overview` },
        { label: course.title, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: "Exercise", href: "#" },
    ];

    return (
        <SidebarWrapper
            classId={classId}
            courseId={courseId}
            breadcrumbItems={breadcrumbItems}
            exerciseTitle={exercise.title}
            exerciseDetail={exercise.detail || "No details provided."}
        />
    );
}
