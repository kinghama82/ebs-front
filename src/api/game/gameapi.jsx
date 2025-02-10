// src/api/game/gameapi.jsx
import axios from "axios";

const SERVER_URL = "http://localhost:8080";


export const getgames = async () => {
    const response = await axios.get(`${SERVER_URL}/api/games`);
    return response.data;
};

export const newgame = async (formData) => {
    const response = await axios.post(`${SERVER_URL}/api/games/create`, formData, {
        // "Content-Type"은 생략하거나 자동 설정에 맡기면 좋습니다.
    });
    return response.data;
};
