import { test as teardown } from '@playwright/test';
import { prisma } from '@/lib/prisma';

teardown('delete database', async () => {
  await prisma.user.deleteMany();
  await prisma.session.deleteMany();
  await prisma.$disconnect();
});
