import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("🔄 Resetting database...");

  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE user;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE wallet;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE transaction;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE country;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE province;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE city;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE category;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE boat;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE port;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE schedule;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE booking;`);
  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);

  console.log("✅ Database reset complete!");
}

resetDatabase()
  .catch((e) => console.error("❌ Error resetting database:", e))
  .finally(async () => await prisma.$disconnect());
