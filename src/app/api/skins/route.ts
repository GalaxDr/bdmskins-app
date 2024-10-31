import { NextResponse } from 'next/server';
import prisma from 'lib/prisma';

export async function GET() {
  const skins = await prisma.skin.findMany();
  return NextResponse.json(skins);
}

export async function POST(request: Request) {
    const data = await request.json();
  
    // Converte os valores para Float antes de salvar
    const newSkin = await prisma.skin.create({
      data: {
        ...data,
        price: parseFloat(data.price),
        float: parseFloat(data.float),
      },
    });
    
    return NextResponse.json(newSkin);
  }

export async function PUT(request: Request) {
  const { id, ...data } = await request.json();
  const updatedSkin = await prisma.skin.update({
    where: { id },
    data,
  });
  return NextResponse.json(updatedSkin);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.skin.delete({
    where: { id },
  });
  return NextResponse.json({ message: 'Skin deleted' });
}

export async function PATCH(request: Request) {
    const { id, ...data } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
  
    try {
      const updatedSkin = await prisma.skin.update({
        where: { id },
        data: {
          ...data,
          float: parseFloat(data.float) // Certifique-se de que está convertendo corretamente
        },
      });
      return NextResponse.json(updatedSkin);
    } catch (error) {
      console.error("Update failed:", error);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
  }