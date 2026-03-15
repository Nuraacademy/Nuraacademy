import AssignmentList from "./assignment_list";
import { getUnfinishedAssignmentsForUser } from "@/controllers/assignmentController";
import { getSession } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function AssignmentPage() {
    const userId = await getSession();
    if (!userId) {
        redirect("/login");
    }

    const assignments = await getUnfinishedAssignmentsForUser(userId);

    return <AssignmentList initialAssignments={assignments} />;
}
