import { createReadStream } from 'fs';
import { PrismaClient } from '@prisma/client';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

const weaponTypes = {
  Rifle: ["AK-47", "M4A1-S", "AUG", "FAMAS", "SSG 08", "G3SG1", "AWP", "M4A4", "SG 553", "Galil AR", "SCAR-20"],
  Pistol: ["Desert Eagle", "Glock-18", "P250", "R8 Revolver", "Dual Berettas", "Zeus x27", "USP-S", "P2000", "Five-SeveN", "Tec-9", "CZ75-Auto"],
  Smg: ["MP9", "UMP-45", "MP7", "MP5-SD", "MAC-10", "PP-Bizon", "P90"],
  Shotgun: ["XM1014", "MAG-7", "Sawed-Off", "Nova"],
  Machinegun: ["M249", "Negev"],
};

function getWeaponType(weaponName: string): string | null {
  for (const [type, weapons] of Object.entries(weaponTypes)) {
    if (weapons.includes(weaponName)) return type;
  }
  return null;
}

async function seedFromCSV() {
  // Prepara os registros de WeaponType no cache
  const weaponTypeRecords: { [key: string]: { id: number; name: string } } = {};
  for (const type of Object.keys(weaponTypes)) {
    weaponTypeRecords[type] = await prisma.weaponType.upsert({
      where: { name: type },
      update: {},
      create: { name: type },
    });
  }

  const weaponsCache = new Map<string, { id: number; name: string; weaponTypeId: number }>();
  const skinsCache = new Map<string, { id: number; name: string }>();

  // Pré-carrega todas as armas e skins existentes no cache
  const [allWeapons, allSkins] = await Promise.all([
    prisma.weapon.findMany(),
    prisma.skin.findMany(),
  ]);

  allWeapons.forEach(weapon => weaponsCache.set(weapon.name, weapon));
  allSkins.forEach(skin => skinsCache.set(skin.name, skin));

  // Ler o CSV e processar cada linha em lotes
  const results: { Weapon: string; Skin: string }[] = [];
  createReadStream('weapons_skins.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      const skinWeaponsToCreate = [];
      
      for (const { Weapon, Skin } of results) {
        const weaponTypeName = getWeaponType(Weapon);
        console.log(`Weapon: ${Weapon}, Skin: ${Skin}, WeaponType: ${weaponTypeName}`);
        if (!weaponTypeName) {
          console.error(`Tipo de arma desconhecido para: ${Weapon}`);
          continue;
        }

        let weapon = weaponsCache.get(Weapon);
        if (!weapon) {
          // Cria arma caso não exista no cache
          weapon = await prisma.weapon.create({
            data: {
              name: Weapon,
              weaponTypeId: weaponTypeRecords[weaponTypeName].id,
            },
          });
          weaponsCache.set(Weapon, weapon);
        }

        let skin = skinsCache.get(Skin);
        if (!skin) {
          // Cria skin caso não exista no cache
          skin = await prisma.skin.create({
            data: { name: Skin },
          });
          skinsCache.set(Skin, skin);
        }

        // Adiciona o relacionamento a ser criado
        skinWeaponsToCreate.push({
          skinId: skin.id,
          weaponId: weapon.id,
        });
      }

      // Insere todos os relacionamentos SkinWeapon em lote
      await prisma.skinWeapon.createMany({
        data: skinWeaponsToCreate,
        skipDuplicates: true, // Ignora duplicatas
      });

      console.log("Database seeding completed from CSV.");
      await prisma.$disconnect();
    });
}

seedFromCSV().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
