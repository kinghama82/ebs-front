"use client";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken"; // ✅ `jsonwebtoken` 직접 사용
import { useEffect, useState } from "react";

export function useCustomCookie() {
  const [userInfo, setUserInfo] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("useCustomCookie 실행됨!!");

    
      // 1. 쿠키에서 gamerCooki(JWT) 가져오기
      const token = Cookies.get("gamerCooki");

      if (!token) {
        console.warn("JWT 토큰 없음");
        setIsLoaded(true);
        return;
      }

      try {
        // ✅ 클라이언트에서는 `decode()`만 사용 가능 (서명 검증 불가)
        const decoded = jwt.decode(token);

        if (decoded?.id) {
          setUserInfo(decoded);
        } else {
          console.warn("JWT에 ID 값이 없음:", decoded);
        }
      } catch (error) {
        console.error("JWT 디코딩 오류:", error);
      } finally {
        setIsLoaded(true);
      }
    



    // // ✅ 쿠키 변경 감지 (1초마다 확인)
    // const interval = setInterval(checkCookie, 1000);
    // checkCookie(); // 첫 실행

    // return () => clearInterval(interval); // ✅ 컴포넌트 언마운트 시 정리


  }, []);

  return isLoaded ? userInfo || null : undefined;
}
