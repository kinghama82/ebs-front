import axios from "axios";

import { API_SERVER_HOST } from "@/api/publicapi";

const jwtAxios = axios.create();

const refreshJWT = async (accessToken, refreshToken) => {

    const host = API_SERVER_HOST;
    const headers = {headers: {'Authorization' : `Bearer ${accessToken}`}};

    const res = await axios.post(`${host}/api/members/refreshToken?refreshToken=${refreshToken}` , headers);

    console.log("---------------------------");
    console.log(res.data);
}

/*
const beforeReq = (config) => {
    console.log("beforeReq...");

    const memberInfo = getCookie("member");

    if(!memberInfo) {
        console.log("memberInfo is null");
        return Promise.reject(
            {response:
                {data: "로그인이 필요합니다."}
            }
        )
    }

    const {accessToken} = memberInfo;

    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
}*/

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

jwtAxios.interceptors.request.use(beforeReq,requestFail);
jwtAxios.interceptors.response.use(beforeRes,responseFail);

export default jwtAxios;