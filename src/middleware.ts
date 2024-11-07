// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const requests = new Map<string, number[]>();
const LIMIT = 20; // Limite de requisições
const WINDOW_MS = 60 * 1000; // Janela de tempo em milissegundos (1 minuto)

// Token de autenticação para operações restritas
const ADMIN_API_TOKEN = process.env.NEXT_PUBLIC_ADMIN_API_TOKEN;

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0] || // Tenta obter o IP real
    req.headers.get("x-real-ip") || // Usa `x-real-ip` se estiver disponível
    "unknown"
  );
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Limpa requisições antigas
  for (const [key, timestamps] of requests.entries()) {
    requests.set(
      key,
      timestamps.filter((timestamp) => timestamp > windowStart)
    );
    if (requests.get(key)!.length === 0) {
      requests.delete(key);
    }
  }

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
  const ip = getClientIP(req);
  const method = req.method;

  // Aplicar limite de requisições a todas as rotas da API
  if (!rateLimit(ip)) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests, please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // Restringir métodos POST, PUT, DELETE com autenticação
  if (["POST", "PUT", "DELETE"].includes(method)) {
    const authToken = req.headers.get("authorization");
    if (!authToken || authToken !== `Bearer ${ADMIN_API_TOKEN}`) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized request" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*", // Aplica o middleware a todas as rotas da API
};
