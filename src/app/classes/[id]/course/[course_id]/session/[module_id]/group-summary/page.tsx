import { notFound, redirect } from "next/navigation";
import { getSessionById } from "@/controllers/sessionController";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import GroupSummaryClient from "@/app/classes/[id]/course/[course_id]/session/[module_id]/group-summary/GroupSummaryClient";
import { getGroupSummaries } from "@/app/actions/groupSummary";
import { getClassGroupsSummary } from "@/controllers/placementController";
import { getFullSession } from "@/app/actions/auth";

export default async function GroupSummaryPage({
    params
}: {
    params: Promise<{ id: string; course_id: string; module_id: string }>
}) {
    const { id: classId, course_id: courseId, module_id: moduleId } = await params;
    const userId = await getCurrentUserId();
    const sessionDetail = await getFullSession();
    const isAdmin = sessionDetail?.role !== 'Learner';

    if (!userId) {
        redirect("/login");
    }

    const session = await getSessionById(parseInt(moduleId));
    if (!session) {
        return notFound();
    }

    // Get all groups and members in the class
    const allGroups = await getClassGroupsSummary(parseInt(classId));

    // Get the current user's enrollment and which groups they are in
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_classId: {
                userId,
                classId: parseInt(classId)
            }
        },
        include: {
            groups: {
                where: { deletedAt: null }
            }
        }
    });

    if (!enrollment && !isAdmin) {
        return notFound();
    }

    const myGroupNames = enrollment?.groups.map(g => g.name).filter(Boolean) as string[] || [];
    
    // Determine which groups to show
    // For admins: all groups. For learners: only their groups.
    const groupsToShow = isAdmin ? allGroups : allGroups.filter(g => myGroupNames.includes(g.name));

    // Fetch existing group summaries
    const summariesRes = await getGroupSummaries(parseInt(moduleId), allGroups.map(g => g.name));
    const initialSummaries = summariesRes.success ? summariesRes.data : [];

    const data = {
        class: session.course?.class,
        course: session.course,
        session: session,
        enrollmentId: enrollment?.id,
        groups: groupsToShow,
        isAdmin
    };

    return (
        <GroupSummaryClient 
            classId={classId}
            courseId={courseId}
            moduleId={moduleId}
            data={data}
            initialSummaries={initialSummaries}
        />
    );
}
