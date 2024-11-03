import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Apaga dados de SkinWeapon
    await prisma.skinWeapon.deleteMany();
    console.log("Deleted all data from SkinWeapon.");

    // Apaga dados de Weapon e Skin
    await prisma.weapon.deleteMany();
    console.log("Deleted all data from Weapon.");
    
    await prisma.skin.deleteMany();
    console.log("Deleted all data from Skin.");

    // Apaga dados de WeaponType
    await prisma.weaponType.deleteMany();
    console.log("Deleted all data from WeaponType.");
  } catch (error) {
    console.error("Error deleting data:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Database cleanup complete.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });