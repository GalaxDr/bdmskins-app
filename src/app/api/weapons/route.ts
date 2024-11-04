import { NextResponse } from 'next/server';
import prisma from 'lib/prisma';

export async function GET() {
  const weapons = await prisma.weapon.findMany({
    include: { weaponType: true },
  });
  return NextResponse.json(weapons);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newWeapon = await prisma.weapon.create({
    data: {
      name: data.name,
      weaponType: { connect: { id: data.weaponTypeId } },
    },
  });
  return NextResponse.json(newWeapon);
}

export async function PUT(request: Request) {
  const { id, name, weaponTypeId } = await request.json();
  const updatedWeapon = await prisma.weapon.update({
    where: { id },
    data: {
      name,
      weaponType: { connect: { id: weaponTypeId } },
    },
  });
  return NextResponse.json(updatedWeapon);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.weapon.delete({
    where: { id },
  });
  return NextResponse.json({ message: 'Weapon deleted' });
}

export async function PATCH(request: Request) {
  const { id, name, weaponTypeId } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const updatedWeapon = await prisma.weapon.update({
    where: { id },
    data: {
      name,
      weaponType: { connect: { id: weaponTypeId } },
    },
  });
  return NextResponse.json(updatedWeapon);
}