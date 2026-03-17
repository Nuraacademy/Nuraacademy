import { getAssignmentBySessionAndType } from "@/controllers/assignmentController";
import { NotFoundState } from "@/components/ui/status/not_found_state";
import { redirect } from "next/navigation";

export default async function PostTestPage({
    params
}: {
    params: Promise<{ id: string, course_id: string, module_id: string }>
}) {
    const { module_id: moduleId } = await params;

    const assignment = await getAssignmentBySessionAndType(parseInt(moduleId), 'POSTTEST');

    if (!assignment) {
        return (
            <main className="min-h-screen bg-[#FDFDF7] flex items-center justify-center">
                <NotFoundState
                    title="Post-Test Not Available"
                    message="The post-test for this session is not available at the moment. Please check back later."
                />
            </main>
        )
    }

    redirect(`/assignment/${assignment.id}`);
}
