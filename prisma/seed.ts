/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */

import { PrismaClient } from '@prisma/client';
import { hashPass } from '../src/server/lib/auth';
const prisma = new PrismaClient();

async function main() {
  await prisma.account.upsert({
    where: {
      id: 1,
    },
    create: {
      role: 'ADMIN',
      email: 'soulsam480@gmail.com',
      password: await hashPass('sambit'),
      name: 'Sambit Sahoo',
    },
    update: {},
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
