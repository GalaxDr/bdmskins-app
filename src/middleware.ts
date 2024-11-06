// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const requests = new Map<string, number[]>();
const LIMIT = 5; // Limite de requisições
const WINDOW_MS = 60 * 1000; // Janela de tempo em milissegundos (1 minuto)

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Limpa requisições antigas
  requests.forEach((timestamps, key) => {
    requests.set(key, timestamps.filter((timestamp) => timestamp > windowStart));
    if (requests.get(key)!.length === 0) {
      requests.delete(key);
    }
  });

  // Obter histórico de requisições do IP atual
  const timestamps = requests.get(ip) || [];

  // Verifica se o limite foi excedido
  if (timestamps.length >= LIMIT) {
    return false;
  }

  // Atualiza o histórico de requisições do IP atual
  timestamps.push(now);
  requests.set(ip, timestamps);
  return true;
}

export function middleware(req: NextRequest) {
  // Obtenha o IP do cabeçalho `x-forwarded-for` ou defina como "unknown" se não estiver disponível
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  if (!rateLimit(ip)) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests, please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*", // Aplica o middleware a todas as rotas da API
};
