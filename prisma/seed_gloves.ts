import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();

async function main() {
  const gloves: { weaponType: string; weapon: string; skin: string }[] = [];

  // Lê o CSV e armazena cada linha
  fs.createReadStream('gloves.csv')
    .pipe(csv())
    .on('data', (row) => {
      gloves.push({ weaponType: row.WeaponType, weapon: row.Weapon, skin: row.Skin });
    })
    .on('end', async () => {
      // Remove duplicatas para `WeaponType`, `Weapon`, e `Skin`
      const weaponTypes = Array.from(new Set(gloves.map((g) => g.weaponType))).map((name) => ({ name }));
      const weapons = Array.from(new Set(gloves.map((g) => g.weapon))).map((name) => ({ name }));
      const skins = Array.from(new Set(gloves.map((g) => g.skin))).map((name) => ({ name }));

      // Insere `WeaponType` em lote
      await prisma.weaponType.createMany({
        data: weaponTypes,
        skipDuplicates: true, // Evita duplicatas
      });

      // Obtenha os IDs de `WeaponType` após a inserção
      const weaponTypeMap = await prisma.weaponType.findMany().then((types) =>
        types.reduce((acc, type) => {
          acc[type.name] = type.id;
          return acc;
        }, {} as Record<string, number>)
      );

      // Insere `Weapon` em lote, associando ao `weaponTypeId`
      await prisma.weapon.createMany({
        data: weapons.map((weapon) => ({
          name: weapon.name,
          weaponTypeId: weaponTypeMap[gloves.find((g) => g.weapon === weapon.name)?.weaponType!],
        })),
        skipDuplicates: true,
      });

      // Insere `Skin` em lote
      await prisma.skin.createMany({
        data: skins,
        skipDuplicates: true,
      });

      // Obtenha os IDs de `Weapon` e `Skin`
      const weaponMap = await prisma.weapon.findMany().then((weapons) =>
        weapons.reduce((acc, weapon) => {
          acc[weapon.name] = weapon.id;
          return acc;
        }, {} as Record<string, number>)
      );

      const skinMap = await prisma.skin.findMany().then((skins) =>
        skins.reduce((acc, skin) => {
          acc[skin.name] = skin.id;
          return acc;
        }, {} as Record<string, number>)
      );

      // Insere associações em `SkinWeapon` em lote
      const skinWeapons = gloves.map((glove) => ({
        weaponId: weaponMap[glove.weapon],
        skinId: skinMap[glove.skin],
      }));

      await prisma.skinWeapon.createMany({
        data: skinWeapons,
        skipDuplicates: true,
      });

      console.log("Glove skins and relationships imported from CSV in batches.");
      await prisma.$disconnect();
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
