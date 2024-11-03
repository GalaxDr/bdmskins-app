import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const wearValues = [
    { name: "Factory New" },
    { name: "Minimal Wear" },
    { name: "Field-Tested" },
    { name: "Well-Worn" },
    { name: "Battle-Scarred" },
  ];

  for (const wear of wearValues) {
    await prisma.wear.upsert({
      where: { name: wear.name },
      update: {},
      create: wear,
    });
  }

  console.log("Default wear values seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });