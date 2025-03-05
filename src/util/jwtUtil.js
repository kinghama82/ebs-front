import axios from "axios";

import { API_SERVER_HOST } from "@/api/publicapi";

const jwtAxios = axios.create();

const refreshJWT = async (accessToken, refreshToken) => {

    const host = API_SERVER_HOST;
    const res = await axios.post(
        `${host}/api/gamer/refreshToken`,
        { refreshToken },  // refreshToken을 body에 포함
        { headers: { 'Authorization': `Bearer ${accessToken}` } } // headers는 세 번째 인자로 전달
    );

    console.log("---------------------------");
    console.log(res.data);
}

const beforeReq = (config) => {
    console.log("beforeReq...");

    const accessToken = getCookie("accessToken"); // 클라이언트 사이드 쿠키에서 가져옴

    if (!accessToken) {
        console.log("Access Token이 없습니다.");
        return Promise.reject(
            { response: { data: "로그인이 필요합니다." } }
        );
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
};

jwtAxios.interceptors.request.use(beforeReq, requestFail);


const requestFail = (err) => {
    console.log("requestFail...");
    return Promise.reject(err);
}
/*
const beforeRes = async (res) => {
    console.log("beforeRes...");

    console.log(res)

    const data = res.data;

    if(data && data.error === 'ERROR_ACCESS_TOKEN') {

        const memberCookieValue = getCookie("member");

        const result = await refreshJWT(memberCookieValue.accessToken, memberCookieValue.refreshToken);

        console.log("refreshJWT RESULT", result)

        memberCookieValue.accessToken = result.accessToken
        memberCookieValue.refreshToken = result.refreshToken

        setCookie("member", JSON.stringify(memberCookieValue), 1);

        const originalRequest = res.config;

        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;

        return await axios(originalRequest);
    }
    
    return res;
}*/

const responseFail = (err) => {
    console.log("responseFail...");
    return Promise.reject(err);
}

export const refreshAccessToken = async () => {
    try {
        const refreshToken = getCookie("refreshToken"); // 클라이언트 사이드 쿠키에서 가져옴

        if (!refreshToken) {
            console.error("Refresh Token이 없습니다.");
            return null;
        }

        const host = `${API_SERVER_HOST}/api/gamer`;
        const response = await axios.post(`${host}/refreshToken`, { refreshToken });

        // 새 Access Token 저장
        setCookie("accessToken", response.data.accessToken, 10 / (24 * 60)); // 10분
        return response.data.accessToken;
    } catch (error) {
        console.error("토큰 갱신 실패:", error.response?.data || error.message);
        return null;
    }
};


jwtAxios.interceptors.request.use(beforeReq,requestFail);
jwtAxios.interceptors.response.use(
    async (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (err.response && err.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;  // 무한 루프 방지
            const newAccessToken = await refreshAccessToken();

            if (newAccessToken) {
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);  // 요청 다시 시도
            }
        }

        return Promise.reject(err);
    }
);


export default jwtAxios;