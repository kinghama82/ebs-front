"use client"
import Cookies from "js-cookie";
import jwtDecode from "jsonwebtoken";
import { useEffect, useState } from "react";

export function useCustomCookie() {
  const [userInfo, setUserInfo] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // 1. 쿠키에서 gamerCooki(JWT) 가져오기
    const token = Cookies.get("gamerCooki");

    if (!token) {
      setIsLoaded(true) //쿠키가 없더라도 로딩 완료
      return
    }

    try {
      const decoded = jwtDecode.decode(token); // JWT 디코딩
      if (decoded?.id) {
        setUserInfo(decoded)
      } else{
        console.warn("JWT에 ID 값이 없음 : ", decoded)
      }
    } catch (error) {
      console.error("JWT 디코딩 오류:", error);
    } finally{
      setIsLoaded(true)  //디코딩이 끝나면 로딩 완료
    }

  }, []);

  //isLoaded가 true 일때만 userInfo 반환
  if(!isLoaded) return null

  return userInfo 
}