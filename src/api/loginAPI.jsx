import axios from "axios";
import { API_SERVER_HOST } from "@/api/publicapi";

const host = `${API_SERVER_HOST}/api/gamer`;


// 로그인 요청 함수
export const loginPost = async (loginParam) => {
    const form = new URLSearchParams();
    form.append("username", loginParam.email);
    form.append("password", loginParam.password);

    try {
        const response = await axios.post(`${host}/login`, form, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            withCredentials: true, // ✅ 쿠키 포함 설정
        });

        console.log("서버 응답 데이터:", response); // ✅ 응답 확인 로그

        console.log("로그인 응답 데이터:", response.data);
        return response.data;
    } catch (error) {
        console.error("로그인 요청 실패:", error.response?.data || error.message);
        throw error;
    }
}

/*

export const loginPost = async (loginParam) => {

    const header = { headers: { "Content-Type": "application/x-www-form-urlencoded" } };

    const form = new URLSearchParams();
    form.append("username", loginParam.email);
    form.append("password", loginParam.password);

    try {
        const res = await axios.post(`${host}/login`, form, header);
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error("로그인 요청 실패:", error.response?.data ?? error.message);
    }

}*/

