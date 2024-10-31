import { NextResponse } from 'next/server';

// Array em memória para armazenar as skins (substitua por um banco de dados em produção)
let skins = [
  {
    id: 1,
    name: "★ Karambit | Rust Coat",
    price: "R$899.99",
    float: "0.45721983",
    wear: "Battle-Scarred",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mLXKQrZwttSaViL9u0v76mNH6mYAQY.png"
  },
  {
    id: 2,
    name: "AK-47 | Bloodsport",
    price: "R$299.99",
    float: "0.15328947",
    wear: "Field-Tested",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-d837TYtpMLCqzm0RNqy3SbXah1EMMX.png"
  }
];

export async function GET() {
  return NextResponse.json(skins);
}

export async function POST(request: Request) {
  const newSkin = await request.json();
  newSkin.id = skins.length ? skins[skins.length - 1].id + 1 : 1; // Gera um novo ID
  skins.push(newSkin);
  return NextResponse.json(newSkin);
}

export async function PUT(request: Request) {
  const updatedSkin = await request.json();
  const index = skins.findIndex((skin) => skin.id === updatedSkin.id);

  if (index === -1) return NextResponse.json({ error: 'Skin not found' }, { status: 404 });

  skins[index] = { ...skins[index], ...updatedSkin };
  return NextResponse.json(skins[index]);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  skins = skins.filter((skin) => skin.id !== id);
  return NextResponse.json({ message: 'Skin deleted' });
}