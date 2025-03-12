import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token || token !== process.env.ADMIN_API_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ message: "Authorized" });
}