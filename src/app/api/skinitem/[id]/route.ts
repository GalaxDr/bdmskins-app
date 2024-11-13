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
  const { skinWeaponId, wearId, float, price, inspectLink, imgLink, isStatTrak, hasStickers, hasLowFloat, tradeLockStartDate } = data;

  if (!skinWeaponId || !wearId || float == null || price == null || !inspectLink || !imgLink || isStatTrak == null || hasStickers == null || hasLowFloat == null) {
    console.error("Missing required fields:", { skinWeaponId, wearId, float, price, inspectLink, imgLink, isStatTrak, hasStickers, hasLowFloat });
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
        tradeLockStartDate: tradeLockStartDate ? new Date(tradeLockStartDate) : null, // Adiciona o campo de data de bloqueio
      },
    });
    return NextResponse.json(newSkinItem);
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ error: "Failed to create item", details: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  const parsedId = id ? parseInt(id, 10) : null;
  const data = await request.json();

  if (!parsedId) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const updatedSkinItem = await prisma.skinItem.update({
      where: { id: parsedId },
      data: {
        skinWeapon: data.skinWeaponId ? { connect: { id: data.skinWeaponId } } : undefined,
        wear: data.wearId ? { connect: { id: data.wearId } } : undefined,
        float: data.float !== undefined ? parseFloat(data.float) : undefined,
        price: data.price !== undefined ? parseFloat(data.price) : undefined,
        inspectLink: data.inspectLink || undefined,
        imgLink: data.imgLink || undefined,
        isStatTrak: data.isStatTrak !== undefined ? data.isStatTrak : undefined,
        hasStickers: data.hasStickers !== undefined ? data.hasStickers : undefined,
        hasLowFloat: data.hasLowFloat !== undefined ? data.hasLowFloat : undefined,
        tradeLockStartDate: data.tradeLockStartDate ? new Date(data.tradeLockStartDate) : undefined, // Atualiza o campo de data de bloqueio
      },
    });
    return NextResponse.json(updatedSkinItem);
  } catch (error) {
    console.error("PUT request failed:", error);
    return NextResponse.json({ error: "Update failed", details: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  const parsedId = id ? parseInt(id, 10) : null;

  if (!parsedId) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await prisma.skinItem.delete({
      where: { id: parsedId },
    });
    return NextResponse.json({ message: 'Skin item deleted' });
  } catch (error) {
    console.error("DELETE request failed:", error);
    return NextResponse.json({ error: "Delete failed", details: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
