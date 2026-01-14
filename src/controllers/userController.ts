import { prisma } from '@/lib/prisma';

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createUser(data: { email: string; name?: string }) {
  return prisma.user.create({
    data,
  });
}

