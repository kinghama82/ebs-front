"use client";
import Cookies from "js-cookie";
import { toast } from "sonner"; // ✅ 최신 Sonner에서 제공하는 toast 사용
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
    const handleLogout = () => {
        // ✅ 쿠키 삭제
        Cookies.remove("gamerCooki");
        Cookies.remove("refreshToken");

        // ✅ Sonner Toast 알람 표시
        toast.success("로그아웃 완료", {
            description: "메인 페이지로 이동합니다.",
        });

        // ✅ 1.5초 후 강제 새로고침 (메인 페이지 이동)
        setTimeout(() => {
            window.location.href = "/";
        }, 500);
    };

    return (
        <Button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
            로그아웃
        </Button>
    );
}
