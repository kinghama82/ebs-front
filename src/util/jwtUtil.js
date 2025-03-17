import axios from "axios";
import Cookies from "js-cookie";

const jwtAxios = axios.create({
    // withCredentials를 사용하면 쿠키가 자동 전송됨
    withCredentials: true
});

// 요청 인터셉터: 쿠키에서 accessToken을 읽어 Authorization 헤더에 추가
jwtAxios.interceptors.request.use(
    (config) => {
        const token = Cookies.get("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 발생 시 refreshToken을 이용하여 토큰 갱신 후 재요청
jwtAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = Cookies.get("refreshToken");
            try {
                // 토큰 갱신 API 호출 (엔드포인트 및 요청 방식은 백엔드에 맞게 조정)
                const res = await axios.post("http://localhost:8080/api/member/refresh",
                    { refreshToken },
                    { withCredentials: true }
                );
                // 갱신된 토큰을 쿠키에 저장
                Cookies.set("accessToken", res.data.accessToken, { expires: 1, path: "/" });
                Cookies.set("refreshToken", res.data.refreshToken, { expires: 7, path: "/" });
                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                console.error("토큰 갱신 실패:", refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default jwtAxios;
