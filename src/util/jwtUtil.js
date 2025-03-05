import axios from "axios";
import { API_SERVER_HOST } from "@/api/publicapi";
import { getClientCookie } from "@/utils/getClientCookie"; // ✅ 클라이언트에서 쿠키 가져오기

const host = `${API_SERVER_HOST}/api/gamer`;
const jwtAxios = axios.create();

// 🔐 요청 전 인터셉터 (쿠키에서 `accessToken` 가져오기)
const beforeReq = (config) => {
    console.log("beforeReq...");
    const accessToken = getClientCookie("accessToken"); // ✅ 클라이언트에서 쿠키 가져오기

    if (!accessToken) {
        console.log("Access Token이 없습니다.");
        return Promise.reject({ response: { data: "로그인이 필요합니다." } });
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
};

// 🔄 응답 인터셉터 (401 발생 시 자동 갱신)
jwtAxios.interceptors.response.use(
    async (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (err.response && err.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refreshAccessToken();

            if (newAccessToken) {
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            }
        }

        return Promise.reject(err);
    }
);

jwtAxios.interceptors.request.use(beforeReq);

export default jwtAxios;
