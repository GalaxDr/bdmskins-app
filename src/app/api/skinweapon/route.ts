import { NextResponse } from 'next/server';
import prisma from 'lib/prisma';

export async function GET(request: Request) {
  // Obtém os parâmetros `weaponId` e `skinId` da URL
  const url = new URL(request.url);
  const weaponId = url.searchParams.get("weaponId");
  const skinId = url.searchParams.get("skinId");

  // Verifica se ambos os parâmetros foram fornecidos
  if (!weaponId || !skinId) {
    return NextResponse.json(
      { error: "Parâmetros weaponId e skinId são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    // Converte os parâmetros para número
    const parsedWeaponId = parseInt(weaponId);
    const parsedSkinId = parseInt(skinId);

    // Busca o registro correspondente na tabela `SkinWeapon`
    const skinWeapon = await prisma.skinWeapon.findFirst({
      where: {
        weaponId: parsedWeaponId,
        skinId: parsedSkinId,
      },
    });

    if (skinWeapon) {
      // Retorna o ID se o registro for encontrado
      return NextResponse.json({ id: skinWeapon.id });
    } else {
      // Retorna erro se o registro não for encontrado
      return NextResponse.json(
        { error: "Combinação de weaponId e skinId não encontrada." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao buscar skinWeapon:", error);
    return NextResponse.json(
      { error: "Erro ao buscar skinWeapon" },
      { status: 500 }
    );
  }
}
