import axios from "axios";

const { API_SERVER_HOST } = require("../publicapi");


const host = `${API_SERVER_HOST}/api/history`

//읽기
export const getHistory = async (id) => {
    const res = await axios.get(`${host}/${id}`)

    return res.data
}

//리스트
export const getList = async (pageParam) => {
    const {page, size} = pageParam

    const res = await axios.get(`${host}/`,{params:{page:page, size:size}})

    return res.data
}
//등록
export const addHistory = async (history) => {
    // const header = {headers: {"Content-Type": "multipart/form-data"}}

    const res = await axios.post(`${host}/`, history)

    return res.data    
}


//수정
export const putHistory = async (id, history) => {
    const header = {headers : {"Content-Type" : "multipart/form-data"}}

    const res = await axios.put(`${host}/${id}`, history, header)

    return res.data
}

//삭제
export const deleteHistory = async (id) => {
    const res = await axios.delete(`${host}/${id}`)
    return res.data
}