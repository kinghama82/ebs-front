import { API_SERVER_HOST } from "@/api/publicapi";
import axios from "axios";

// 게이머 정보 조회 API
export const getgamer = async () => {
    try {
        const response = await axios.get(`${API_SERVER_HOST}/api/gamer/profile`);
        return response.data;
    } catch (error) {
        console.error("사용자를 찾는데 실패했습니다", error);
        throw error;
    }
};

// 새로운 게이머 등록 API
export const newgamer = async (formData) => {
    try {
        const response = await axios.post(`${API_SERVER_HOST}/api/gamer/new`, formData);
        return response.data;
    } catch (error) {
        console.error("새로운 회원을 만드는데 실패했습니다", error);
        throw error;
    }
};






/*export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_SERVER_HOST}/api/gamer/login`, {
            email,
            password,
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data; // { token: "JWT_TOKEN" }
    } catch (error) {
        console.error("로그인 실패:", error.response?.data?.msg || error.message);
        throw error;
    }
};*/



/*
// 추가적인 API 예시: 게이머 업데이트 API
export const updateGamer = async (formData) => {
    try {
        const response = await axios.put(`${API_SERVER_HOST}/api/gamer/update`, formData);
        return response.data;
    } catch (error) {
        console.error("Failed to update gamer", error);
        throw error;
    }
};
*/
