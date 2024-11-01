import { NextResponse } from 'next/server';
import prisma from 'lib/prisma';

export async function GET() {
  const weaponTypes = await prisma.weaponType.findMany();
  return NextResponse.json(weaponTypes);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newWeaponType = await prisma.weaponType.create({
    data: {
      name: data.name,
    },
  });
  return NextResponse.json(newWeaponType);
}

export async function PUT(request: Request) {
  const { id, name } = await request.json();
  const updatedWeaponType = await prisma.weaponType.update({
    where: { id },
    data: { name },
  });
  return NextResponse.json(updatedWeaponType);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.weaponType.delete({
    where: { id },
  });
  return NextResponse.json({ message: 'Weapon type deleted' });
}

export async function PATCH(request: Request) {
  const { id, name } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const updatedWeaponType = await prisma.weaponType.update({
    where: { id },
    data: { name },
  });
  return NextResponse.json(updatedWeaponType);
}
