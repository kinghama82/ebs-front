import axios from "axios";

const { API_SERVER_HOST } = require("../publicapi");


const host = `${API_SERVER_HOST}/api/history`

//읽기
export const getHistory = async (id) => {
    console.log(`API 요청 URL: ${host}/read/${id}`)
    const res = await axios.get(`${host}/read/${id}`)
    console.log("API응답 데이터: ", res.data)

    return res.data
}

//리스트
export const getList = async (pageParam, gamerid) => {
    const {page, size} = pageParam

    const res = await axios.get(`${host}/`,{params:{page, size, gamerid}})

    return res.data
}
//등록
export const addHistory = async (history) => {
    

    const res = await axios.post(`${host}/`, history)

    return res.data    
}


//수정
export const modifyHistory = async (id, history) => {

    console.log(`API요청 : ${host}/${id}`)
    console.log("보낼 데이터 : ", history)

    const res = await axios.put(`${host}/${id}`, history)

    return res.data
}

//삭제
export const deleteHistory = async (id) => {
    const res = await axios.delete(`${host}/${id}`)
    return res.data
}