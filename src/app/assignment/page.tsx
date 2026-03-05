import AssignmentList from "./assignment_list";
import { getAssignments } from "@/controllers/assignmentController";

export default async function AssignmentPage() {
    const assignments = await getAssignments();

    return <AssignmentList initialAssignments={assignments} />;
}
