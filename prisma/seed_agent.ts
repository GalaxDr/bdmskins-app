import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const agents = [
  { skin: "Sir Bloody Miami Darryl", weapon: "The Professionals" },
  { skin: "Sir Bloody Darryl Royale", weapon: "The Professionals" },
  { skin: "Sir Bloody Loudmouth Darryl", weapon: "The Professionals" },
  { skin: "Cmdr. Davida 'Goggles' Fernandez", weapon: "SEAL Frogman" },
  { skin: "Cmdr. Frank 'Wet Sox' Baroud", weapon: "SEAL Frogman" },
  { skin: "Sir Bloody Skullhead Darryl", weapon: "The Professionals" },
  { skin: "Sir Bloody Silent Darryl", weapon: "The Professionals" },
  { skin: "Vypa Sista of the Revolution", weapon: "Guerrilla Warfare" },
  { skin: "'Medium Rare' Crasswater", weapon: "Guerrilla Warfare" },
  { skin: "Special Agent Ava", weapon: "FBI" },
  { skin: "Crasswater The Forgotten", weapon: "Guerrilla Warfare" },
  { skin: "Lt. Commander Ricksaw", weapon: "NSWC SEAL" },
  { skin: "Chef d'Escadron Rouchard", weapon: "Gendarmerie Nationale" },
  { skin: "Cmdr. Mae 'Dead Cold' Jamison", weapon: "SWAT" },
  { skin: "'The Doctor' Romanov", weapon: "Sabre" },
  { skin: "The Elite Mr. Muhlik", weapon: "Elite Crew" },
  { skin: "Number K", weapon: "The Professionals" },
  { skin: "Bloody Darryl The Strapped", weapon: "The Professionals" },
  { skin: "Elite Trapper Solman", weapon: "Guerrilla Warfare" },
  { skin: "Safecracker Voltzmann", weapon: "The Professionals" },
  { skin: "Chem-Haz Capitaine", weapon: "Gendarmerie Nationale" },
  { skin: "Lieutenant Rex Krikey", weapon: "SEAL Frogman" },
  { skin: "Arno The Overgrown", weapon: "Guerrilla Warfare" },
  { skin: "Michael Syfers", weapon: "FBI Sniper" },
  { skin: "1st Lieutenant Farlow", weapon: "SWAT" },
  { skin: "Blackwolf", weapon: "Sabre" },
  { skin: "Rezan the Redshirt", weapon: "Sabre" },
  { skin: "Rezan The Ready", weapon: "Sabre" },
  { skin: "'Two Times' McCoy", weapon: "TACP Cavalry" },
  { skin: "Prof. Shahmat", weapon: "Elite Crew" },
  { skin: "'Two Times' McCoy", weapon: "USAF TACP" },
  { skin: "Getaway Sally", weapon: "The Professionals" },
  { skin: "Little Kev", weapon: "The Professionals" },
  { skin: "Col. Mangos Dabisi", weapon: "Guerrilla Warfare" },
  { skin: "Trapper", weapon: "Guerrilla Warfare" },
  { skin: "Officer Jacques Beltram", weapon: "Gendarmerie Nationale" },
  { skin: "'Blueberries' Buckshot", weapon: "NSWC SEAL" },
  { skin: "Lieutenant 'Tree Hugger' Farlow", weapon: "SWAT" },
  { skin: "Sergeant Bombson", weapon: "SWAT" },
  { skin: "Slingshot", weapon: "Phoenix" },
  { skin: "John 'Van Healen' Kask", weapon: "SWAT" },
  { skin: "Markus Delrow", weapon: "FBI HRT" },
  { skin: "Sous-Lieutenant Medic", weapon: "Gendarmerie Nationale" },
  { skin: "Osiris", weapon: "Elite Crew" },
  { skin: "Buckshot", weapon: "NSWC SEAL" },
  { skin: "Dragomir", weapon: "Sabre" },
  { skin: "Maximus", weapon: "Sabre" },
  { skin: "D Squadron Officer", weapon: "NZSAS" },
  { skin: "Primeiro Tenente", weapon: "Brazilian 1st Battalion" },
  { skin: "Jungle Rebel", weapon: "Elite Crew" },
];

async function seedAgents() {
  try {
    // Adiciona o WeaponType "Agent" se ainda não existir
    const agentWeaponType = await prisma.weaponType.upsert({
      where: { name: "Agent" },
      update: {},
      create: { name: "Agent" },
    });

    for (const { skin, weapon } of agents) {
      // Adiciona ou atualiza a arma
      const weaponRecord = await prisma.weapon.upsert({
        where: { name: weapon },
        update: {},
        create: {
          name: weapon,
          weaponTypeId: agentWeaponType.id,
        },
      });

      // Adiciona ou atualiza a skin
      const skinRecord = await prisma.skin.upsert({
        where: { name: skin },
        update: {},
        create: { name: skin },
      });

      // Cria a relação entre Skin e Weapon
      await prisma.skinWeapon.upsert({
        where: {
          skinId_weaponId: {
            skinId: skinRecord.id,
            weaponId: weaponRecord.id,
          },
        },
        update: {},
        create: {
          skinId: skinRecord.id,
          weaponId: weaponRecord.id,
        },
      });
    }

    console.log("Agents seeded successfully.");
  } catch (error) {
    console.error("Error seeding agents:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAgents();
