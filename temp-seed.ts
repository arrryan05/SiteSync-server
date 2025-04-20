// temp-seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      name: 'Test User',
    },
  });

  const project = await prisma.project.create({
    data: {
      website: 'https://example.com',
      userId: user.id,
    },
  });

  console.log('Seeded user:', user.id);
  console.log('Seeded project:', project.id);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
