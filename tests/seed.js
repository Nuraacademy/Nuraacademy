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
  
  // Clean up old test data
  await prisma.user.deleteMany({
    where: {
      username: { in: ['testlearner', 'existinguser', 'newuser123'] }
    }
  });
  
  // Create Test User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'learner@example.com',
      username: 'existinguser',
      password: hashedPassword,
      name: 'Test Learner',
      whatsapp: '08123456789'
    }
  });
  console.log(`Created test user: ${user.username}`);

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
