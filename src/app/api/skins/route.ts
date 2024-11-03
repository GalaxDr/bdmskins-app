import { NextResponse } from 'next/server';
import prisma from 'lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  // Obtém o parâmetro `search` da URL
  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  // Condição de filtro: se `search` estiver presente, busca por nome parcial
  const whereCondition = search
    ? {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive // Ignora maiúsculas/minúsculas
        }
      }
    : {};

  try {
    // Busca as skins que correspondem ao `search`, se aplicável
    const skins = await prisma.skin.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
      },
      take: 10, // Limita o número de resultados para melhorar desempenho
    });

    return NextResponse.json(skins);
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    // Cria um novo registro na tabela `SkinWeapon`
    const newSkinWeapon = await prisma.skinWeapon.create({
      data: {
        skin: { connect: { id: data.skinId } },
        weapon: { connect: { id: data.weaponId } },
      },
    });

    return NextResponse.json(newSkinWeapon);
  } catch (error) {
    console.error("Create failed:", error);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id, skinId, weaponId } = await request.json();

  try {
    // Atualiza um registro existente em `SkinWeapon`
    const updatedSkinWeapon = await prisma.skinWeapon.update({
      where: { id },
      data: {
        skin: { connect: { id: skinId } },
        weapon: { connect: { id: weaponId } },
      },
    });

    return NextResponse.json(updatedSkinWeapon);
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    await prisma.skinWeapon.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Skin weapon association deleted' });
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
    const updatedSkinWeapon = await prisma.skinWeapon.update({
      where: { id },
      data: {
        skin: { connect: { id: data.skinId } },
        weapon: { connect: { id: data.weaponId } },
      },
    });

    return NextResponse.json(updatedSkinWeapon);
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
