import axios from "axios";
import { API_SERVER_HOST } from "@/api/publicapi";

const host = `${API_SERVER_HOST}/api/gamer`;

export const loginPost = async (loginParam) => {
    const form = new URLSearchParams();
    form.append("username", loginParam.email);
    form.append("password", loginParam.password);

    try {
        const response = await axios.post(`${host}/login`, form, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            // 쿠키를 사용하지 않으므로 withCredentials 옵션은 제거
        });

        console.log("서버 응답 데이터:", response.data);

        // localStorage에 토큰 저장
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        return response.data;
    } catch (error) {
        console.error("로그인 요청 실패:", error.response?.data || error.message);
        throw error;
    }
};
