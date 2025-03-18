import axios from "axios";
import {API_SERVER_HOST} from "@/api/publicapi";

//리스트
export const getNewsList = async (pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${API_SERVER_HOST}/api/news/`,{params:{page:page, size:size}})
    return res.data
}

//상세
export const getNews = async (id) => {
    const res = await axios.get(`${API_SERVER_HOST}/api/news/${id}`)
    return res.data
}

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
