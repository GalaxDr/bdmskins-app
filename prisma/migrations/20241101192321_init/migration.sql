/*
  Warnings:

  - You are about to drop the `WearSkinWeapon` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WearSkinWeapon" DROP CONSTRAINT "WearSkinWeapon_skinId_fkey";

-- DropForeignKey
ALTER TABLE "WearSkinWeapon" DROP CONSTRAINT "WearSkinWeapon_weaponId_fkey";

-- DropForeignKey
ALTER TABLE "WearSkinWeapon" DROP CONSTRAINT "WearSkinWeapon_wearId_fkey";

-- DropTable
DROP TABLE "WearSkinWeapon";

-- CreateTable
CREATE TABLE "SkinWeapon" (
    "id" SERIAL NOT NULL,
    "skinId" INTEGER NOT NULL,
    "weaponId" INTEGER NOT NULL,

    CONSTRAINT "SkinWeapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkinItem" (
    "id" SERIAL NOT NULL,
    "skinWeaponId" INTEGER NOT NULL,
    "wearId" INTEGER NOT NULL,
    "float" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "inspectLink" TEXT NOT NULL,
    "imgLink" TEXT NOT NULL,

    CONSTRAINT "SkinItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SkinWeapon_skinId_weaponId_key" ON "SkinWeapon"("skinId", "weaponId");

-- AddForeignKey
ALTER TABLE "SkinWeapon" ADD CONSTRAINT "SkinWeapon_skinId_fkey" FOREIGN KEY ("skinId") REFERENCES "Skin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkinWeapon" ADD CONSTRAINT "SkinWeapon_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkinItem" ADD CONSTRAINT "SkinItem_skinWeaponId_fkey" FOREIGN KEY ("skinWeaponId") REFERENCES "SkinWeapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkinItem" ADD CONSTRAINT "SkinItem_wearId_fkey" FOREIGN KEY ("wearId") REFERENCES "Wear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
