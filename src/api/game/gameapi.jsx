// src/api/game/gameapi.jsx
import axios from "axios";
import { API_SERVER_HOST } from "@/api/publicapi";

const host = `${API_SERVER_HOST}/api/gamer`;

export const loginPost = async (loginParam) => {

    const header = { headers: { "Content-Type": "application/x-www-form-urlencoded" } };

    const form = new FormData();
    form.append("username",loginParam.email);
    form.append("password",loginParam.password);

    const res = await axios.post(`${host}/login`,form,header);

    return res.data;
}









/*

// import axios from "axios";
import jwtAxios from "src/util/jwtUtil";

const SERVER_URL = "http://localhost:8080";


export const getgames = async () => {
    const response = await jwtAxios.get(`${SERVER_URL}/api/games`);
    return response.data;
};

export const newgame = async (formData) => {
    const response = await jwtAxios.post(`${SERVER_URL}/api/games/new`, formData, {
        // "Content-Type"은 생략하거나 자동 설정에 맡기면 좋습니다.
    });
    return response.data;
};
*/
