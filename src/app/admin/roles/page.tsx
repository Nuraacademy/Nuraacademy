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
        <div className="min-h-screen bg-[#F9F9EE] relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full md:w-[60%] h-[40rem] pointer-events-none opacity-40">
                <Image 
                    src="/background/PolygonBGTop.svg" 
                    alt="Background Top" 
                    fill 
                    className="object-cover object-left-top"
                    priority
                />
            </div>
            <div className="absolute bottom-0 right-0 w-full md:w-[60%] h-[40rem] pointer-events-none opacity-40">
                <Image 
                    src="/background/PolygonBGBot.svg" 
                    alt="Background Bottom" 
                    fill 
                    className="object-cover object-right-bottom"
                />
            </div>

            <div className="relative z-10 px-4 md:px-16 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-[#1C3A37] mb-2 tracking-tight">IAM & Admin</h1>
                    <p className="text-gray-500 font-medium">
                        Manage roles, view permissions, and configure access control for the platform.
                    </p>
                </div>

                <RolesClient initialRoles={roles} permissions={permissions} />
            </div>
        </div>
    );
}
