"use client"
import { FolderOutput, FolderInput } from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useCustomCookie } from "../common/useCustomCookie";

export default function LoginOutButton() {
    const [isClient, setIsClient] = useState(false);
    const [isHomePage, setIsHomePage] = useState(false);    
    const userInfo = useCustomCookie()

    useEffect(() => {
        setIsClient(true);
    },[])
    

    useEffect(() => {
        if (typeof window !== "undefined" && window.location.pathname === "/") {
            setIsHomePage(true);
        }
    }, []);
    // 홈페이지에서는 버튼을 숨김
    if (!isClient || isHomePage) return null; 

    return (
        <button
            onClick={() => {
                if (userInfo) {
                    // 로그아웃
                    Cookies.remove("gamerCooki");
                    window.location.href = "/";
                } else {
                    // 로그인 페이지로 이동
                    window.location.href = "/gamer";
                }
            }}
            title={isClient && userInfo ? "로그아웃" : "로그인"}
            className={`p-2 rounded-md ${userInfo ? 'text-red-500' : ' text-amber-800'}`}
        >
            {userInfo ? 
                <FolderOutput size={24} /> 
                : 
                <FolderInput size={24} />}
        </button>
    );
}
