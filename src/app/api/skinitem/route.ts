import { NextResponse } from 'next/server';
import prisma from 'lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const weaponId = url.searchParams.get("weaponId");

  const whereCondition = weaponId
    ? { skinWeapon: { weaponId: parseInt(weaponId, 10) } }
    : {};

  try {
    const skinItems = await prisma.skinItem.findMany({
      where: whereCondition,
      include: {
        skinWeapon: {
          include: {
            skin: true,
            weapon: { include: { weaponType: true } },
          },
        },
        wear: true,
      },
    });
    return NextResponse.json(skinItems);
  } catch (error) {
    console.error("GET request failed:", error);
    return NextResponse.json({ error: "Failed to fetch skin items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const data = await request.json();
  const {
    skinWeaponId,
    wearId,
    float,
    price,
    inspectLink,
    imgLink,
    isStatTrak,
    hasStickers,
    hasLowFloat,
    tradeLockStartDate, // Adicionado o campo tradeLockStartDate
  } = data;

  // Validação de campos obrigatórios
  if (
    !skinWeaponId ||
    !wearId ||
    float == null ||
    price == null ||
    !inspectLink ||
    !imgLink ||
    isStatTrak == null ||
    hasStickers == null ||
    hasLowFloat == null
  ) {
    console.error("Missing required fields:", {
      skinWeaponId,
      wearId,
      float,
      price,
      inspectLink,
      imgLink,
      isStatTrak,
      hasStickers,
      hasLowFloat,
      tradeLockStartDate,
    });
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const newSkinItem = await prisma.skinItem.create({
      data: {
        skinWeapon: { connect: { id: skinWeaponId } },
        wear: { connect: { id: wearId } },
        float: parseFloat(float),
        price: parseFloat(price),
        inspectLink,
        imgLink,
        isStatTrak,
        hasStickers,
        hasLowFloat,
        tradeLockStartDate: tradeLockStartDate ? new Date(tradeLockStartDate) : null, // Inclui a data de bloqueio
      },
    });
    return NextResponse.json(newSkinItem);
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item", details: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
