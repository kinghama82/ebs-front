import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { token } = await req.json(); // 클라이언트에서 JWT 토큰을 전달
        if (!token) return NextResponse.json({ error: "토큰이 없습니다." }, { status: 400 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "", { ignoreExpiration: true });
        return NextResponse.json({ decoded });

    } catch (error) {
        console.error("JWT 디코딩 실패:", error);
        return NextResponse.json({ error: "유효하지 않은 토큰" }, { status: 401 });
    }
}
