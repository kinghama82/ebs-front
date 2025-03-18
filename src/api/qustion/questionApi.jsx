import axios from "axios"
import { API_SERVER_HOST } from "../publicapi"

//리스트
export const getQuestionList = async (pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${API_SERVER_HOST}/api/question/`,{params:{page:page, size:size}})
    return res.data
}

//상세
export const getQuestion = async (id) => {
    const res = await axios.get(`${API_SERVER_HOST}/api/question/${id}`)
    return res.data
}