// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const requests = new Map<string, number[]>();
const LIMIT = 15; // Limite de requisições
const WINDOW_MS = 60 * 1000; // Janela de tempo em milissegundos (1 minuto)
const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0] || 
    req.headers.get("x-real-ip") || 
    "unknown"
  );
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  for (const [key, timestamps] of requests.entries()) {
    requests.set(
      key,
      timestamps.filter((timestamp) => timestamp > windowStart)
    );
    if (requests.get(key)!.length === 0) {
      requests.delete(key);
    }
  }

  const timestamps = requests.get(ip) || [];
  if (timestamps.length >= LIMIT) {
    return false;
  }

  timestamps.push(now);
  requests.set(ip, timestamps);
  return true;
}

export function middleware(req: NextRequest) {
  const ip = getClientIP(req);
  const method = req.method;
  const url = req.nextUrl.pathname;

  // Permite POST /login sem restrições adicionais
  if (url === "/api/login" && method === "POST") {
    return NextResponse.next();
  }

  // Restringe métodos na URL base "/"
  if (url === "/") {
    if (!["GET", "HEAD"].includes(method)) {
      return new NextResponse(
        JSON.stringify({ error: `Method ${method} not allowed on the base URL` }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Restringir métodos OPTIONS na API
  if (url.startsWith("/api")) {
    if (method === "OPTIONS") {
      return new NextResponse(
        JSON.stringify({ error: "Method OPTIONS not allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!rateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests, please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
      const authToken = req.headers.get("authorization");
    
      if (!authToken) {
        return new NextResponse(
          JSON.stringify({ error: "Authorization token is missing" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
    
      const tokenParts = authToken.split(" ");
      if (tokenParts[0] !== "Bearer" || tokenParts[1] !== ADMIN_API_TOKEN) {
        return new NextResponse(
          JSON.stringify({ error: "Invalid or malformed token" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/api/:path*"], 
};
