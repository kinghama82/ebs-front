"use server";

import { cookies } from "next/headers";

// ✅ Next.js 서버 쿠키 저장 함수
export const setAuthCookies = (accessToken, refreshToken) => {
    const cookieStore = cookies();

    // ✅ 개발 환경에서는 secure: false로 설정해야 쿠키가 저장됨
    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set("accessToken", accessToken, {
        httpOnly: false,
        secure: false,  // ✅ 배포 환경에서만 `secure: true`
        sameSite: "None",
        maxAge: 10 * 60,  // ✅ 10분 후 만료
        path: "/",
    });

    cookieStore.set("refreshToken", refreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60,  // ✅ 7일 후 만료
        path: "/",
    });
};

// ✅ Next.js 서버에서 쿠키 가져오기
export const getAuthCookies = () => {
    const cookieStore = cookies();

    return {
        accessToken: cookieStore.get("accessToken")?.value || null,
        refreshToken: cookieStore.get("refreshToken")?.value || null,
    };
};

// ✅ Next.js 서버에서 쿠키 삭제
export const deleteAuthCookies = () => {
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
