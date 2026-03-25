import { RoleController } from "@/controllers/roleController";
import RolesClient from "./client";
import Image from "next/image";

export const metadata = {
    title: "Role Management - Admin",
};

export default async function RolesPage() {
    const [roles, permissions] = await Promise.all([
        RoleController.getRoles(),
        RoleController.getPermissions(),
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
                    <h1 className="text-4xl font-medium text-[#1C3A37] mb-2 tracking-tight">IAM & Admin</h1>
                    <p className="text-gray-500 font-medium">
                        Manage roles, view permissions, and configure access control for the platform.
                    </p>
                </div>

                <RolesClient initialRoles={roles} permissions={permissions} />
            </div>
        </div>
    );
}
