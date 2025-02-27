import axios from "axios";

const { API_SERVER_HOST } = require("../publicapi");

const host = `${API_SERVER_HOST}/api/free`

export const getList = async (pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${host}/list`,{params:{page:page, size:size}})
    return res.data
}

export const getOne = async (id) => {
    const res = await axios.get(`${host}/${id}`)
    return res.data
}
export const deleteOne = async (id) => {
    const res = await axios.delete(`${host}/${id}`)
    return res.data
}
export const putOne = async (id, free) => {
    const header = {headers : {"Content-Type" : "multipart/form-data"}}
    const res = await axios.put(`${host}/${id}`, free, header)
    return res.data
}