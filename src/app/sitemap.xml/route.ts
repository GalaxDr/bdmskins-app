import { NextResponse } from "next/server";

export const runtime = "edge"; // Opcional, para desempenho otimizado.

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";

  const urls = [
    { loc: `${siteUrl}/`, lastmod: new Date().toISOString() },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      ({ loc, lastmod }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemap.trim(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
