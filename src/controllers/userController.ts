import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { id: 'desc' },
  });
}

export async function createUser(data: { email: string; name?: string; username: string; password?: string; whatsapp?: string }) {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  const defaultRole = await prisma.role.findUnique({ where: { name: 'Learner' } });
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      username: data.username,
      password: data.password || '',
      whatsapp: data.whatsapp,
      roleId: defaultRole?.id || null,
    },
  });
}

export async function registerUser(data: {
  fullName: string;
  username: string;
  email: string;
  password: string;
  whatsapp: string;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const defaultRole = await prisma.role.findUnique({ where: { name: 'Learner' } });
  return await prisma.user.create({
    data: {
      name: data.fullName,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      whatsapp: data.whatsapp,
      roleId: defaultRole?.id || null,
    },
  });
}

export async function loginUser(identifier: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier },
      ],
      deletedAt: null,
    },
    include: {
      role: true
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  // Lazy role assignment: if user has no role, make them a Learner
  if (!user.roleId) {
    const defaultRole = await prisma.role.findUnique({ where: { name: 'Learner' } });
    if (defaultRole) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { roleId: defaultRole.id },
        include: { role: true }
      });
      return updatedUser;
    }
  }

  return user;
}
