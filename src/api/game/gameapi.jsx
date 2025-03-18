// src/api/game/gameapi.jsx
import axios from "axios";
import {API_SERVER_HOST} from "@/api/publicapi";
import Cookies from "js-cookie";

export const getGames = async () => {
    const response = await axios.get(`${API_SERVER_HOST}/api/games`);
    return response.data;
};

export const newgame = async (formData) => {
    try {
        const token = Cookies.get("gamerCooki"); // ✅ 쿠키에서 JWT 가져오기
        const headers = {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }) // ✅ JWT 토큰 추가
        };

        const response = await axios.post(`${API_SERVER_HOST}/api/games/create`, formData, { headers });
        return response.data;
    } catch (error) {
        console.error("게임 등록 요청 실패:", error);
        throw error;
    }
};

export const getGameById = async (id) => {
    try {
        const response = await axios.get(`${API_SERVER_HOST}/api/games/${id}`);
        return response.data;
    } catch (error) {
        console.error("게임 데이터를 불러오는 중 오류 발생:", error);
        throw error;
    }
};

export const searchGames = async (keyword) => {
    try {
        const response = await axios.get(`${API_SERVER_HOST}/api/games/search`, {
            params: { keyword } // ✅ 쿼리 파라미터로 검색어 전달
        });
        return response.data;
    } catch (error) {
        console.error("게임 검색 중 오류 발생:", error);
        throw error;
    }
};


