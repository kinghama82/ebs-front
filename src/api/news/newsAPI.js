import axios from "axios";
import {API_SERVER_HOST} from "@/api/publicapi";

/** ✅ 뉴스 목록 조회 (페이징) */
export const getNewsList = async (page, size) => {
    try {
        const response = await axios.get(`${API_SERVER_HOST}/api/news/list`, {
            params: { page, size },
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;  // ✅ response.data 직접 반환
    } catch (error) {
        console.error("뉴스 목록 불러오기 실패:", error);
        throw error;
    }
};

/** ✅ 뉴스 상세 조회 */
export const getNewsById = async (id) => {
    try {
        const response = await axios.get(`${API_SERVER_HOST}/api/news/${id}`);
        return response.data;
    } catch (error) {
        console.error(`뉴스 ID(${id}) 불러오기 실패:`, error);
        throw error;
    }
};

/** ✅ 뉴스 작성 */
export const createNews = async (formData) => {
    try {
        // ✅ FormData 디버깅용 로그
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        const response = await axios.post(`${API_SERVER_HOST}/api/news/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        console.error("뉴스 작성 실패:", error);
        throw error;
    }
};

/** ✅ 뉴스 삭제 */
export const deleteNews = async (id) => {
    try {
        await axios.delete(`${API_SERVER_HOST}/api/news/${id}`);
    } catch (error) {
        console.error(`뉴스 ID(${id}) 삭제 실패:`, error);
        throw error;
    }
};
