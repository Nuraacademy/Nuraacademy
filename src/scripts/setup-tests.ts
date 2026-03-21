import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Ensure 'Learner' role exists
  const learnerRole = await prisma.role.upsert({
    where: { name: 'Learner' },
    update: {},
    create: { name: 'Learner' },
  });

  // Create test user 'existinguser'
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { username: 'existinguser' },
    update: { password: hashedPassword },
    create: {
      username: 'existinguser',
      email: 'existing@example.com',
      password: hashedPassword,
      name: 'Existing User',
      roleId: learnerRole.id,
    },
  });

  // Create test class with ID 1
  await prisma.class.upsert({
    where: { id: 1 },
    update: { capacity: 100 },
    create: {
      id: 1,
      title: 'Test Class 1',
      description: 'A test class for unit testing',
      hours: 10,
      methods: 'Online',
      capacity: 100,
    },
  });

  console.log('Database setup complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
