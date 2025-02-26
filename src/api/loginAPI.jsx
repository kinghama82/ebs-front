import axios from "axios";
import { API_SERVER_HOST } from "@/api/publicapi";

const host = `${API_SERVER_HOST}/api/gamer`;

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

}