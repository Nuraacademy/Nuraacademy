import { getAllClasses } from "@/controllers/classController"
import ClassesGrid from "./class_grid"
import Image from "next/image"
import { hasPermission } from "@/lib/rbac"

import { getSession } from "@/app/actions/auth"
import { prisma } from "@/lib/prisma"

export default async function ClassesPage({ searchParams }: { searchParams: Promise<{ enrolled?: string }> }) {
    const params = await searchParams;
    const isEnrolledView = params.enrolled === 'true';
    
    // Fetch live data from the database
    const classes = await getAllClasses()
    const userId = await getSession()

    const canCreate = await hasPermission('Class', 'CREATE_UPDATE_CLASS')
    const canDelete = await hasPermission('Class', 'DELETE_CLASS')

    let classesWithStatus = classes;

    if (userId) {
        // Check enrollment for each class
        const enrolledClassIds = await prisma.enrollment.findMany({
            where: {
                userId,
                classId: { in: classes.map((c: any) => c.id) }
            },
            select: { classId: true }
        }).then((res: any) => res.map((r: any) => r.classId));

        classesWithStatus = classes.map((c: any) => ({
            ...c,
            isEnrolled: enrolledClassIds.includes(c.id)
        }));
    } else {
        classesWithStatus = classes.map((c: any) => ({
            ...c,
            isEnrolled: false
        }));
    }

    // Handle view based on searchParams or permissions
    if (isEnrolledView && userId) {
        // Show ONLY enrolled and active classes
        const enrollments = await prisma.enrollment.findMany({
            where: {
                userId,
                status: 'ACTIVE',
                deletedAt: null
            },
            select: { classId: true }
        });
        const enrolledIds = enrollments.map(en => en.classId);
        classesWithStatus = classesWithStatus.filter((c: any) => enrolledIds.includes(c.id));
    } else if (!canCreate) {
        // Catalog view for learners: Only show started classes
        classesWithStatus = classesWithStatus.filter((c: any) => c.startDate && new Date(c.startDate) <= new Date());
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 md:pl-8">
            {/* Background Image */}
            <Image
                src="/background/PolygonBGTop.svg"
                alt=""
                className="absolute top-0 left-0 -z-10 w-auto h-[30rem] pointer-events-none opacity-60"
                width={500} // Increased to prevent distortion
                height={500}
                priority
            />

            {/* Bottom Right Background */}
            <Image
                src="/background/PolygonBGBot.svg"
                alt=""
                className="absolute bottom-0 right-0 -z-10 w-auto h-[30rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />

            {/* Render the interactive grid using Client Component */}
            <ClassesGrid initialClasses={classesWithStatus} canCreate={canCreate} canDelete={canDelete} isEnrolledView={isEnrolledView} />
        </div>
    )
}