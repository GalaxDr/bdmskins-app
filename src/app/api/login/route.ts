import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const validUsername = process.env.ADMIN_USERNAME; // Defina no .env
  const validPassword = process.env.ADMIN_PASSWORD; // Defina no .env

  if (username === validUsername && password === validPassword) {
    // Retorna o token apenas se as credenciais forem válidas
    return NextResponse.json({ token: process.env.ADMIN_API_TOKEN });
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
