// src/api/gamerApi.jsx
import { API_SERVER_HOST } from "@/api/publicapi";
import axios from "axios";
import { useCustomCookie } from "@/components/common/useCustomCookie"; // 커스텀 훅 가져오기

// 게이머 정보 조회 API
export const getGamer = async (email) => {
    if (!email) throw new Error("이메일이 없습니다.");
    const response = await axios.get(`${API_SERVER_HOST}/api/gamer/detail?email=${email}`);
    return response.data;
};

/*export const getGamer = async () => {
    try {
        const user = useCustomCookie(); // 쿠키에서 사용자 정보 가져오기
        if (!user || !user.email) throw new Error("로그인된 사용자의 이메일이 없습니다.");

        const response = await axios.get(`${API_SERVER_HOST}/api/gamer/detail?email=${user.email}`);
        return response.data;
    } catch (error) {
        console.error("사용자 정보를 불러오는데 실패했습니다:", error);
        throw error;
    }
};*/


// 로그인된 사용자의 이메일을 받아오는 함수 (쿠키 또는 localStorage 활용 가능)
const getLoggedInUserEmail = () => {
    return localStorage.getItem("userEmail"); // 예시: 로컬스토리지에서 가져오기
};

// 새로운 게이머 등록 API
export const newGamer = async (formData) => {
    try {
        const response = await axios.post(`${API_SERVER_HOST}/api/gamer/new`, formData);
        return response.data;
    } catch (error) {
        console.error("새로운 회원을 등록하는데 실패했습니다", error);
        throw error;
    }
};

// 프로필 업데이트 API (닉네임, 주소 등 변경 가능)
export const updateGamerProfile = async (formData) => {
    try {
        const response = await axios.put(`${API_SERVER_HOST}/api/gamer/update`, formData);
        return response.data;
    } catch (error) {
        console.error("프로필 업데이트 실패:", error);
        throw error;
    }
};

// 이메일 중복 체크 API
export const checkEmailExists = async (email) => {
    try {
        const response = await axios.get(`${API_SERVER_HOST}/api/gamer/check-email`, { params: { email } });
        return response.data.exists; // true: 이미 존재, false: 사용 가능
    } catch (error) {
        console.error("이메일 중복 체크 실패:", error);
        throw error;
    }
};

// 닉네임 중복 체크 API
export const checkNicknameExists = async (nickname) => {
    try {
        const response = await axios.get(`${API_SERVER_HOST}/api/gamer/check-nickname`, { params: { nickname } });
        return response.data.exists; // true: 이미 존재, false: 사용 가능
    } catch (error) {
        console.error("닉네임 중복 체크 실패:", error);
        throw error;
    }
};

export const uploadProfileImage = async (email, file) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("file", file);

    const response = await axios.post(`${API_SERVER_HOST}/api/gamer/uploadProfile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // { msg: "...", profileImage: "..."}
};

export const changePassword = async (formData) => {
    try {
        const response = await axios.put(`${API_SERVER_HOST}/api/gamer/change-password`, formData);
        return response.data;
    } catch (error) {
        console.error("비밀번호 변경 실패:", error);
        throw error;
    }
};

export const requestPasswordReset = async (name, email) => {
    const response = await axios.post(
        `${API_SERVER_HOST}/api/gamer/request-password-reset`,
        { name, email },
        { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
};


export const resetPassword = async (token, newPassword, confirmPassword) => {
    try {
        const response = await axios.put(
            `${API_SERVER_HOST}/api/gamer/reset-password`,
            { token, newPassword, confirmPassword },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error) {
        console.error("비밀번호 재설정 API 오류:", error);
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
