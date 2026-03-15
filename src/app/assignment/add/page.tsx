import { AddAssignmentClient } from "@/app/assignment/add/AddAssignmentClient";
import { getAllClasses } from "@/controllers/classController";

export default async function AddAssignmentPage() {
    const classes = await getAllClasses();
    return <AddAssignmentClient classes={classes} />;
}
