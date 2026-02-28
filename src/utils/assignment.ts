export type AssignmentType = "Placement" | "Pre" | "Post" | "Assignment" | "Exercise" | "Final Project";

export const getAssignmentIcon = (type: AssignmentType | string): string => {
    if (type === "Placement") {
        return "/icons/assignment/PlacementTest.svg";
    } else if (type === "Pre") {
        return "/icons/assignment/PreTest.svg";
    } else if (type === "Post") {
        return "/icons/assignment/PostTest.svg";
    } else if (type === "Assignment") {
        return "/icons/assignment/Assignment.svg";
    } else if (type === "Exercise") {
        return "/icons/assignment/Exercise.svg";
    } else if (type === "Final Project") {
        return "/icons/assignment/FinalProject.svg";
    } else {
        return "";
    }
};

export const getAssignmentEndpoint = (
    classId: string,
    courseId: string,
    sessionId: string,
    type: AssignmentType | string
): string => {
    if (type === "Placement") {
        return `/classes/${classId}/test`;
    } else if (type === "Pre") {
        return `/classes/${classId}/course/${courseId}/session/${sessionId}/pre-test`;
    } else if (type === "Post") {
        return `/classes/${classId}/course/${courseId}/session/${sessionId}/post-test`;
    } else if (type === "Assignment") {
        return `/classes/${classId}/course/${courseId}/assignment`;
    } else if (type === "Exercise") {
        return `/classes/${classId}/course/${courseId}/session/${sessionId}/exercise`;
    } else if (type === "Final Project") {
        return `/classes/${classId}/course/${courseId}/assignment`;
    } else {
        return "";
    }
};
