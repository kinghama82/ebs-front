"use client";
import Cookies from "js-cookie";
import { toast } from "sonner"; // ✅ 최신 Sonner에서 제공하는 toast 사용
import { Button } from "@/components/ui/button";
import { useCustomCookie } from "./common/useCustomCookie";

export default function LogoutButton() {
    const userInfo = useCustomCookie()
    const isNaverUser = userInfo?.email.includes("naver.com")
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
        <div>
            {isNaverUser ? 
            (<button onClick={handleLogout} className="w-[50%]">
                <img src="./naverlogout.png"/>
            </button>
            ):(
            <Button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                로그아웃
            </Button>
        )}
        </div>
        
        
    );
}
