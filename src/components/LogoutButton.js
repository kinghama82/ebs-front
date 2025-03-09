"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        // 쿠키 삭제
        Cookies.remove("gamerCooki");
        Cookies.remove("refreshToken");

        alert("로그아웃되었습니다.");

        // 로그인 페이지 또는 메인 페이지로 이동
        router.push("/");
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        >
            로그아웃
        </button>
    );
}
