import { createReadStream } from 'fs';
import { PrismaClient } from '@prisma/client';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

// Definição dos tipos de arma
const weaponTypes = {
  Rifle: ["AK-47", "M4A1-S", "AUG", "FAMAS", "SSG 08", "G3SG1", "AWP", "M4A4", "SG 553", "Galil AR", "SCAR-20"],
  Pistol: ["Desert Eagle", "Glock-18", "P250", "R8 Revolver", "Dual Berettas", "Zeus x27", "USP-S", "P2000", "Five-SeveN", "Tec-9", "CZ75-Auto"],
  Smg: ["MP9", "UMP-45", "MP7", "MP5-SD", "MAC-10", "PP-Bizon", "P90"],
  Shotgun: ["XM1014", "MAG-7", "Sawed-Off", "Nova"],
  Machinegun: ["M249", "Negev"],
};

// Função para determinar o tipo de arma
function getWeaponType(weaponName: string): string | null {
  for (const [type, weapons] of Object.entries(weaponTypes)) {
    if (weapons.includes(weaponName)) return type;
  }
  return null;
}

async function seedFromCSV() {
  // Criar ou buscar WeaponTypes no banco
  const weaponTypeRecords: { [key: string]: any } = {};
  for (const type of Object.keys(weaponTypes)) {
    weaponTypeRecords[type] = await prisma.weaponType.upsert({
      where: { name: type },
      update: {},
      create: { name: type },
    });
  }

  // Ler o CSV e processar cada linha
  const results: { Weapon: string; Skin: string }[] = [];
  createReadStream('weapons_skins.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const { Weapon, Skin } of results) {
        const weaponTypeName = getWeaponType(Weapon);
        if (!weaponTypeName) {
          console.error(`Tipo de arma desconhecido para: ${Weapon}`);
          continue;
        }

        // Busca ou cria a arma com o tipo correto
        const weapon = await prisma.weapon.upsert({
            where: { name: Weapon }, // Agora pode usar `name` como chave única
            update: {},
            create: {
              name: Weapon,
              weaponTypeId: weaponTypeRecords[weaponTypeName].id,
            },
          });

        // Busca ou cria a skin
        const skin = await prisma.skin.upsert({
          where: { name: Skin },
          update: {},
          create: { name: Skin },
        });

        // Cria a relação entre arma e skin em SkinWeapon
        await prisma.skinWeapon.upsert({
          where: {
            skinId_weaponId: {
              skinId: skin.id,
              weaponId: weapon.id,
            },
          },
          update: {},
          create: {
            skinId: skin.id,
            weaponId: weapon.id,
          },
        });
      }

      console.log("Database seeding completed from CSV.");
      await prisma.$disconnect();
    });
}

seedFromCSV().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
