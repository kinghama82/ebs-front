"use client"
import Cookies from "js-cookie";
import jwtDecode from "jsonwebtoken";
import { useEffect, useState } from "react";

export function useCustomCookie() {
    const [userInfo, setUserInfo] = useState("")
    
      useEffect(() => {
        // 1. 쿠키에서 gamerCooki(JWT) 가져오기
        const token = Cookies.get("gamerCooki");
        if (token) {
          try {
            const decoded = jwtDecode.decode(token); // JWT 디코딩
            if (decoded && decoded.nickname) {
              setUserInfo(decoded)
            }
          } catch (error) {
            console.error("JWT 디코딩 오류:", error);
          }
        }
      }, []);
      return {userInfo}
}