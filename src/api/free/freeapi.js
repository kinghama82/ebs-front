import axios from "axios";
import { API_SERVER_HOST } from "../publicapi";



const host = `${API_SERVER_HOST}/api/free`

//리스트
export const getFreeList = async (pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${host}/`,{params:{page:page, size:size}})
    return res.data
}

//등록
export const addFree = async (free) => {
    const res = await axios.post(`${host}/`, free)
    return res.data
}

//상세
export const getFree = async (id) => {
    const res = await axios.get(`${host}/read/${id}`)
    return res.data
}
//삭제
export const deleteFree = async (id) => {
    const res = await axios.delete(`${host}/${id}`)
    return res.data
}

//수정
export const putFree = async (id, free) => {
    const header = {headers : {"Content-Type" : "multipart/form-data"}}
    const res = await axios.put(`${host}/${id}`, free, header)
    return res.data
}

//댓글 등록
export const addFreeAnswer = async (answer) => {
    try {
      const response = await axios.post(`${host}/answers/`, answer, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("댓글 등록 중 오류 발생:", error);
      throw error;
    }
  };
    