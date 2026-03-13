import { getAllClasses } from "@/controllers/classController"
import ClassesGrid from "./class_grid"
import SidebarWrapper from "./sidebar_wrapper"
import Image from "next/image"
import { hasPermission } from "@/lib/rbac"

import { getSession } from "@/app/actions/auth"
import { prisma } from "@/lib/prisma"

export default async function ClassesPage() {
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

    return (
        <main className="relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 md:pl-8">
            {/* Sidebar State Managed Separately to Avoid Client Wrapper */}
            <SidebarWrapper />

            {/* Background Image */}
            <img
                src="/background/PolygonBGTop.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none opacity-60"
            />
            <img
                src="/background/PolygonBGBot.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none opacity-60"
            />

            {/* Render the interactive grid using Client Component */}
            <ClassesGrid initialClasses={classesWithStatus} canCreate={canCreate} canDelete={canDelete} />
        </main>
    )
}