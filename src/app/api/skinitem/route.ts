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
  const { skinWeaponId, wearId, float, price, inspectLink, imgLink } = data;

  if (!skinWeaponId || !wearId || float == null || price == null || !inspectLink || !imgLink) {
    console.error("Missing required fields:", { skinWeaponId, wearId, float, price, inspectLink, imgLink });
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
      },
    });
    return NextResponse.json(newSkinItem);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating item:", error.message);
      return NextResponse.json({ error: "Failed to create item", details: error.message }, { status: 500 });
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json({ error: "Failed to create item", details: "Unexpected error" }, { status: 500 });
    }
  }
}
