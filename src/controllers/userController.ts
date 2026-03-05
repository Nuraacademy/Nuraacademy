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
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      username: data.username,
      password: data.password || '',
      whatsapp: data.whatsapp,
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
  return await prisma.user.create({
    data: {
      name: data.fullName,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      whatsapp: data.whatsapp,
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
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return user;
}
