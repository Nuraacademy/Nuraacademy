
import { prisma } from "./src/lib/prisma";

async function main() {
    const role = await prisma.role.findFirst({
        where: { name: 'Learner' },
        include: {
            permissions: {
                include: { permission: true }
            }
        }
    });

    if (!role) {
        console.log("No Learner role found");
        return;
    }

    console.log("Learner Permissions:");
    role.permissions.forEach((p: any) => {
        console.log(`- ${p.permission.resource}:${p.permission.action}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
