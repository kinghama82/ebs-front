"use client";
import Cookies from "js-cookie";
import { toast } from "sonner"; // ✅ 최신 Sonner에서 제공하는 toast 사용
import { Button } from "@/components/ui/button";
import { useCustomCookie } from "./common/useCustomCookie";

export default function LogoutButton() {
    const userInfo = useCustomCookie()
    const isNaverUser = userInfo?.email.includes("naver.com")
    const isGoogleUser = userInfo?.email.includes("gmail.com")
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
                    <img src="./naverlogout.png" />
                </button>
                ) : (isGoogleUser ?
                    <Button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                        </svg>로그아웃
                    </Button>
                    :
                    <Button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                        로그아웃
                    </Button>
                )}
        </div>


    );
}
