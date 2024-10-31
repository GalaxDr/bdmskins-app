import { NextResponse } from 'next/server';
import prisma from 'lib/prisma';

export async function GET() {
  const skins = await prisma.skin.findMany();
  return NextResponse.json(skins);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newSkin = await prisma.skin.create({ data });
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
