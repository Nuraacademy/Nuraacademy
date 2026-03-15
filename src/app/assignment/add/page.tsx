import { AddAssignmentClient } from "@/app/assignment/add/AddAssignmentClient";
import { getAllClasses } from "@/controllers/classController";
import { getAssignmentById } from "@/controllers/assignmentController";

export default async function AddAssignmentPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const { id } = await searchParams;
    const classes = await getAllClasses();

    let initialAssignment = null;
    if (id) {
        const parsed = parseInt(id);
        if (!isNaN(parsed)) {
            initialAssignment = await getAssignmentById(parsed);
        }
    }

    return <AddAssignmentClient classes={classes} initialAssignment={initialAssignment} />;
}
