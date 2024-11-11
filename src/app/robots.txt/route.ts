import { NextResponse } from "next/server";

export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";

    const robots = `
    User-agent: *
    Disallow: /admin
    Allow: /
    Sitemap: ${siteUrl}/sitemap.xml
    `;

    return new NextResponse(robots, {
    headers: {
        "Content-Type": "text/plain",
    },
});
}
