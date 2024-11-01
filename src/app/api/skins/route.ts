import { NextResponse } from 'next/server';
import prisma from 'lib/prisma';

export async function GET() {
  // Inclui as relações de `skin`, `wear`, `weapon`, e `weapon_type` para retorno completo
  const skins = await prisma.skinItem.findMany({
    include: {
      skinWeapon: {
        include: {
          skin: true,
          weapon: {
            include: {
              weaponType: true,
            },
          },
        },
      },
      wear: true,
    },
  });
  return NextResponse.json(skins);
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    // Cria o registro na tabela `skin_item` e conecta aos dados de `skin_weapon` e `wear`
    const newSkinItem = await prisma.skinItem.create({
      data: {
        skinWeapon: { connect: { id: data.skinWeaponId } },
        wear: { connect: { id: data.wearId } },
        float: parseFloat(data.float),
        price: parseFloat(data.price),
        inspectLink: data.inspectLink,
        imgLink: data.imgLink,
      },
    });
    return NextResponse.json(newSkinItem);
  } catch (error) {
    console.error("Create failed:", error);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id, ...data } = await request.json();

  try {
    // Atualiza um item de skin existente e converte os valores adequados
    const updatedSkinItem = await prisma.skinItem.update({
      where: { id },
      data: {
        skinWeapon: { connect: { id: data.skinWeaponId } },
        wear: { connect: { id: data.wearId } },
        float: parseFloat(data.float),
        price: parseFloat(data.price),
        inspectLink: data.inspectLink,
        imgLink: data.imgLink,
      },
    });
    return NextResponse.json(updatedSkinItem);
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    await prisma.skinItem.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Skin item deleted' });
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { id, ...data } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const updatedSkinItem = await prisma.skinItem.update({
      where: { id },
      data: {
        skinWeapon: { connect: { id: data.skinWeaponId } },
        wear: { connect: { id: data.wearId } },
        float: parseFloat(data.float),
        price: parseFloat(data.price),
        inspectLink: data.inspectLink,
        imgLink: data.imgLink,
      },
    });
    return NextResponse.json(updatedSkinItem);
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
