-- CreateTable
CREATE TABLE "Skin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "float" DOUBLE PRECISION NOT NULL,
    "wear" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "inspect" TEXT NOT NULL,

    CONSTRAINT "Skin_pkey" PRIMARY KEY ("id")
);
