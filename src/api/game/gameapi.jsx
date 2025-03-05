// src/api/game/gameapi.jsx
import axios from "axios";
import {API_SERVER_HOST} from "@/api/publicapi";

export const getGames = async () => {
    const response = await axios.get(`${API_SERVER_HOST}/api/games`);
    return response.data;
};

export const newgame = async (formData) => {
    const response = await axios.post(`${API_SERVER_HOST}/api/games/create`, formData, {
        // "Content-Type"은 생략하거나 자동 설정에 맡기면 좋습니다.
    });
    return response.data;
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
