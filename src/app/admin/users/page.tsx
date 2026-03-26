import React from "react";
import { prisma } from "@/lib/prisma";
import UsersClient from "./client";
import { RoleController } from "@/controllers/roleController";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "User Management - Admin",
};

export default async function UsersPage() {
    const [users, roles] = await Promise.all([
        prisma.user.findMany({
            where: { deletedAt: null },
            include: {
                role: true,
            },
            orderBy: { id: "desc" }
        }),
        RoleController.getRoles(),
    ]);

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background Image */}
            <Image
                src="/background/PolygonBGTop.svg"
                alt=""
                className="absolute top-0 left-0 -z-10 w-auto h-[30rem] pointer-events-none opacity-60"
                width={500}
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

            <div className="relative z-10 px-4 md:px-16 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-medium text-[#1C3A37] mb-2 tracking-tight">User Management</h1>
                    <p className="text-gray-500 font-medium">
                        Manage user accounts and their assigned roles in the platform.
                    </p>
                </div>

                <React.Suspense fallback={<div className="py-8 text-center text-gray-500">Loading users...</div>}>
                    <UsersClient initialUsers={users} roles={roles} />
                </React.Suspense>
            </div>
        </div>
    );
}
