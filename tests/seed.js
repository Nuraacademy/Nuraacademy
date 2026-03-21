const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding mock data for tests...');
  
  // Create Roles
  const roles = ['LEARNER', 'DESIGNER', 'TRAINER'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName }
    });
  }

  const learnerRole = await prisma.role.findUnique({ where: { name: 'LEARNER' } });
  const designerRole = await prisma.role.findUnique({ where: { name: 'DESIGNER' } });
  const trainerRole = await prisma.role.findUnique({ where: { name: 'TRAINER' } });

  // Create Test Users
  const hashedPassword = await bcrypt.hash('password', 10);
  
  await prisma.user.upsert({
    where: { username: 'testlearner' },
    update: { roleId: learnerRole.id },
    create: {
      email: 'learner@example.com',
      username: 'testlearner',
      password: hashedPassword,
      name: 'Test Learner',
      roleId: learnerRole.id
    }
  });

  await prisma.user.upsert({
    where: { username: 'designer_user' },
    update: { roleId: designerRole.id },
    create: {
      email: 'designer@example.com',
      username: 'designer_user',
      password: hashedPassword,
      name: 'Test Designer',
      roleId: designerRole.id
    }
  });

  await prisma.user.upsert({
    where: { username: 'trainer_user' },
    update: { roleId: trainerRole.id },
    create: {
      email: 'trainer@example.com',
      username: 'trainer_user',
      password: hashedPassword,
      name: 'Test Trainer',
      roleId: trainerRole.id
    }
  });
  console.log(`Created test users: testlearner, designer_user, trainer_user`);

  // Create Test Class
  const testClass = await prisma.class.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'Selenium Test Class',
      description: 'Test class for E2E enrollment',
      isDraft: false
    }
  });
  console.log(`Ensured test class 1 exists: ${testClass.title}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
