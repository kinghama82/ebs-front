"use client";

import { API_SERVER_HOST } from "@/api/publicapi";
import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Callback() {
    const router = useRouter();

    useEffect(() => {
        
        const fetchToken = async () => {
            const params = new URLSearchParams(window.location.search);
            const accessToken = params.get("accessToken");
            const refreshToken = params.get("refreshToken");

            if (accessToken && refreshToken) {
                
                // ✅ 쿠키에 저장
                Cookies.set("gamerCooki", accessToken, { expires: 1, path: "/" });
                Cookies.set("refreshToken", refreshToken, { expires: 7, path: "/" });

                const decodedToken = jwt.decode(accessToken)
                const email = decodedToken.email

                // ✅ 사용자 정보 가져오기
                try {
                    const response = await axios.get(`${API_SERVER_HOST}/api/gamer/detail?email=${email}`, {
                        withCredentials: true, // ✅ 쿠키를 포함한 요청
                    });
                    console.log("로그인 성공:", response.data.claims);
                    router.push("/")
                } catch (error) {
                    console.error("사용자 정보를 가져오는 중 오류 발생:", error);
                }

                // 홈으로 리디렉트
                router.push("/");
            } else {
                console.error("토큰이 없습니다.");
                router.push("/login");
            }
        };

        fetchToken();
    }, [router]);

    return <p>로그인 처리 중...</p>;
};


