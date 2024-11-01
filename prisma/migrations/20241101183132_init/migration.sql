/*
  Warnings:

  - You are about to drop the column `float` on the `Skin` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Skin` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Skin` table. All the data in the column will be lost.
  - You are about to drop the column `wear` on the `Skin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Skin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Skin" DROP COLUMN "float",
DROP COLUMN "image",
DROP COLUMN "price",
DROP COLUMN "wear";

-- CreateTable
CREATE TABLE "Wear" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Wear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WeaponType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weapon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weaponTypeId" INTEGER NOT NULL,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WearSkinWeapon" (
    "id" SERIAL NOT NULL,
    "wearId" INTEGER NOT NULL,
    "skinId" INTEGER NOT NULL,
    "weaponId" INTEGER NOT NULL,
    "float" DOUBLE PRECISION NOT NULL,
    "inspectLink" TEXT NOT NULL,
    "imgLink" TEXT NOT NULL,

    CONSTRAINT "WearSkinWeapon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wear_name_key" ON "Wear"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WeaponType_name_key" ON "WeaponType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WearSkinWeapon_wearId_skinId_weaponId_key" ON "WearSkinWeapon"("wearId", "skinId", "weaponId");

-- CreateIndex
CREATE UNIQUE INDEX "Skin_name_key" ON "Skin"("name");

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_weaponTypeId_fkey" FOREIGN KEY ("weaponTypeId") REFERENCES "WeaponType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WearSkinWeapon" ADD CONSTRAINT "WearSkinWeapon_wearId_fkey" FOREIGN KEY ("wearId") REFERENCES "Wear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WearSkinWeapon" ADD CONSTRAINT "WearSkinWeapon_skinId_fkey" FOREIGN KEY ("skinId") REFERENCES "Skin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WearSkinWeapon" ADD CONSTRAINT "WearSkinWeapon_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
