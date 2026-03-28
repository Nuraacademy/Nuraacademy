import { hasPermission } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { getFullSession } from '@/app/actions/auth';
import LearnerClassSelection from '@/app/analytics/LearnerClassSelection';
import AnalyticsDashboardClient from '@/app/analytics/AnalyticsDashboardClient';

export default async function AnalyticsDashboardPage() {
    const session = await getFullSession();
    if (!session) return null;

    const isStaff = await hasPermission('Analytics', 'ANALYTICS_REPORT_LEARNER');

    if (!isStaff || session.role === 'Learner') {
        // Learner view: show their enrolled classes for selection
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: session.id, deletedAt: null, status: 'ACTIVE' },
            include: { class: true }
        });
        
        const myClasses = enrollments.map(en => ({
            id: en.classId,
            title: en.class.title,
            imgUrl: en.class.imgUrl
        }));

        return <LearnerClassSelection classes={myClasses} />;
    }

    // Staff view: show the global stats dashboard
    const [enrollmentCount, classCount, feedbackCount, discussionCount] = await Promise.all([
        prisma.enrollment.count({ where: { deletedAt: null } }),
        prisma.class.count({ where: { deletedAt: null } }),
        prisma.classFeedback.count({ where: { deletedAt: null } }),
        prisma.discussion.count({ where: { deletedAt: null } })
    ]);

    const stats = {
        enrollmentCount,
        classCount,
        feedbackCount,
        discussionCount
    };

    return <AnalyticsDashboardClient stats={stats} />;
}
