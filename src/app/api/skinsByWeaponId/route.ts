// src/app/api/skinsByWeaponId/route.ts
import { NextResponse } from 'next/server';
import prisma from 'lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const weaponId = url.searchParams.get("weaponId");

  if (!weaponId) {
    return NextResponse.json({ error: "weaponId is required" }, { status: 400 });
  }

  try {
    // Busque as skins relacionadas ao weaponId fornecido
    const skins = await prisma.skinWeapon.findMany({
      where: {
        weaponId: parseInt(weaponId, 10),
      },
      include: {
        skin: true,
      },
    });

    // Transforme a resposta para incluir apenas os dados necessários da skin
    const formattedSkins = skins.map(skinWeapon => ({
      id: skinWeapon.skin.id,
      name: skinWeapon.skin.name,
      weaponId: skinWeapon.weaponId,
    }));

    return NextResponse.json(formattedSkins);
  } catch (error) {
    console.error("GET request failed:", error);
    return NextResponse.json({ error: "Failed to fetch skins by weaponId" }, { status: 500 });
  }
}
