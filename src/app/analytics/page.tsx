import { prisma } from '@/lib/prisma';
import { getFullSession } from '@/app/actions/auth';
import LearnerClassSelection from '@/app/analytics/LearnerClassSelection';
import AnalyticsDashboardClient from '@/app/analytics/AnalyticsDashboardClient';

export default async function AnalyticsDashboardPage() {
    const session = await getFullSession();
    if (!session) return null;

    const isAdmin = session.role === 'Admin';
    const isStaff = ['Trainer', 'Instructor', 'Instructur', 'Learning Designer'].includes(session.role);

    if (isAdmin) {
        // Admin view: show the global stats dashboard
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

    if (isStaff) {
        // Show assigned classes for staff
        const classFilter = {
            OR: [
                { trainerId: session.id },
                { createdBy: session.id },
                { courses: { some: { createdBy: session.id } } },
                { courses: { some: { sessions: { some: { createdBy: session.id } } } } }
            ]
        };

        const assignedClasses = await prisma.class.findMany({
            where: { deletedAt: null, ...classFilter },
            select: { id: true, title: true, imgUrl: true }
        });

        return <LearnerClassSelection classes={assignedClasses} />;
    }

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
