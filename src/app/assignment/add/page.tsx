import { AddAssignmentClient } from "@/app/assignment/add/AddAssignmentClient";
import { getAllClasses } from "@/controllers/classController";
import { getAssignmentById } from "@/controllers/assignmentController";

export default async function AddAssignmentPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string, classId?: string, courseId?: string, sessionId?: string, type?: string }>;
}) {
    const { id, classId, courseId, sessionId, type } = await searchParams;
    const classes = await getAllClasses();

    let initialAssignment = null;
    if (id) {
        const parsed = parseInt(id);
        if (!isNaN(parsed)) {
            initialAssignment = await getAssignmentById(parsed);
        }
    }

    const prefillData = {
        classId: classId ? parseInt(classId) : undefined,
        courseId: courseId ? parseInt(courseId) : undefined,
        sessionId: sessionId ? parseInt(sessionId) : undefined,
        type: type,
    };

    return <AddAssignmentClient classes={classes} initialAssignment={initialAssignment} prefillData={prefillData} />;
}
