-- AlterTable
ALTER TABLE "SkinItem" ADD COLUMN     "tradeLockDurationDays" INTEGER DEFAULT 0,
ADD COLUMN     "tradeLockStartDate" TIMESTAMP(3);
