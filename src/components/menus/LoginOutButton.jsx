"use client"
import { FolderOutput, FolderInput } from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function LoginOutButton() {
    const isLoggedIn = Cookies.get("gamerCooki");
    const [isHomePage, setIsHomePage] = useState(false);

    useEffect(() => {
        if (window.location.pathname === "/") {
            setIsHomePage(true);
        }
    }, []);
    // 홈페이지에서는 버튼을 숨김
    if (isHomePage) return null; 

    return (
        <button
            onClick={() => {
                if (isLoggedIn) {
                    // 로그아웃
                    Cookies.remove("gamerCooki");
                    window.location.href = "/";
                } else {
                    // 로그인 페이지로 이동
                    window.location.href = "/gamer";
                }
            }}
            title={isLoggedIn ? "로그아웃" : "로그인"}
            className={`p-2 rounded-md ${isLoggedIn ? 'text-red-500' : ' text-amber-800'}`}
        >
            {isLoggedIn ? 
                <FolderOutput size={24} /> 
                : 
                <FolderInput size={24} />}
        </button>
    );
}
