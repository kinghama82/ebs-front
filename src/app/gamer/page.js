"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 폼 데이터를 URLSearchParams 형식으로 변환
        const form = new URLSearchParams();
        form.append("username", email);
        form.append("password", password);

        try {
            const res = await fetch("http://localhost:8080/api/gamer/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: form.toString(),
                // withCredentials 옵션은 fetch의 credentials 옵션으로 지정
                credentials: "include"
            });
            const data = await res.json();
            console.log("Login response:", data);

            if (data.accessToken && data.refreshToken) {
                // 일반 쿠키로 저장 (HttpOnly 사용 안 함)
                // 만료일은 필요에 따라 설정 (여기서는 1일, 7일 등)
                Cookies.set("gamerCooki", data.accessToken, { expires: 1, path: "/" });
                Cookies.set("refreshToken", data.refreshToken, { expires: 7, path: "/" });
                alert("로그인 성공");
                router.push("/");
            } else {
                alert("로그인 실패");
            }
        } catch (error) {
            console.error("로그인 오류:", error);
            alert("로그인 요청 중 오류 발생");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
            <h1>로그인</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>이메일:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
                    />
                </div>
                <div>
                    <label>비밀번호:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
                    />
                </div>
                <button type="submit" style={{ padding: "0.75rem", width: "100%" }}>
                    로그인
                </button>
            </form>
        </div>
    );
}
