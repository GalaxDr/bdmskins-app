import { NextResponse } from 'next/server';
import prisma from 'lib/prisma';

export async function GET() {
  try {
    // Busca todas as condições de desgaste da tabela Wear
    const wears = await prisma.wear.findMany();
    return NextResponse.json(wears);
  } catch (error) {
    console.error("Erro ao buscar as condições de desgaste:", error);
    return NextResponse.json({ error: "Erro ao buscar as condições de desgaste" }, { status: 500 });
  }
}
