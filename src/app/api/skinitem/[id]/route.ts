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
  } catch (error: any) {
    console.error("Error creating item:", error.message || error);
    return NextResponse.json({ error: "Failed to create item", details: error.message || error }, { status: 500 });
  }
}

// Modifica a função PUT para utilizar a rota dinâmica
export async function PUT(request: Request, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  const id = parseInt(params.id, 10);
  const data = await request.json();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const updatedSkinItem = await prisma.skinItem.update({
      where: { id },
      data: {
        skinWeapon: data.skinWeaponId ? { connect: { id: data.skinWeaponId } } : undefined,
        wear: data.wearId ? { connect: { id: data.wearId } } : undefined,
        float: data.float !== undefined ? parseFloat(data.float) : undefined,
        price: data.price !== undefined ? parseFloat(data.price) : undefined,
        inspectLink: data.inspectLink || undefined,
        imgLink: data.imgLink || undefined,
      },
    });
    return NextResponse.json(updatedSkinItem);
  } catch (error) {
    console.error("PUT request failed:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
  
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
  
    try {
      await prisma.skinItem.delete({
        where: { id },
      });
      return NextResponse.json({ message: 'Skin item deleted' });
    } catch (error) {
      console.error("DELETE request failed:", error);
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
  }
  
