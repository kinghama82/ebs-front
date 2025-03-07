"use server";

import { cookies } from "next/headers";

// ✅ Next.js 서버 쿠키 저장 함수
export const setAuthCookies = async (accessToken, refreshToken) => { // ✅ async 추가
    const cookieStore = cookies();
    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "None",
        maxAge: 10 * 60,
        path: "/",
    });

    cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
    });
};

// ✅ Next.js 서버에서 쿠키 가져오기 (비동기 함수로 변경)
export const getAuthCookies = async () => {
    const cookieStore = await cookies(); // ✅ `await` 추가

    return {
        accessToken: await cookieStore.get("accessToken")?.value || null,
        refreshToken: await cookieStore.get("refreshToken")?.value || null,
    };
};

// ✅ Next.js 서버에서 쿠키 삭제
export const deleteAuthCookies = async () => {  // ✅ async 추가
    const cookieStore = cookies();

    cookieStore.set("accessToken", "", {
        maxAge: -1,
        path: "/",
    });

    cookieStore.set("refreshToken", "", {
        maxAge: -1,
        path: "/",
    });
};
