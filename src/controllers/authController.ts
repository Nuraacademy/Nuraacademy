import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function registerUser(data: {
    email: string;
    name?: string;
    role?: UserRole;
}) {
    return prisma.user.upsert({
        where: { email: data.email },
        update: {
            name: data.name,
            role: data.role ?? UserRole.LEARNER,
        },
        create: {
            email: data.email,
            name: data.name,
            role: data.role ?? UserRole.LEARNER,
        },
    });
}

export async function getUserProfile(email: string) {
    return prisma.user.findUnique({
        where: { email },
        include: {
            enrollments: true,
            groupMembers: {
                include: {
                    group: true,
                },
            },
        },
    });
}
