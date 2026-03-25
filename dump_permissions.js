
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const role = await prisma.role.findUnique({
            where: { name: 'Learner' },
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });
        
        if (!role) {
            console.log("Learner role not found");
            return;
        }
        
        console.log("Permissions for Learner:");
        role.permissions.forEach(rp => {
            console.log(`${rp.permission.resource}:${rp.permission.action}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
