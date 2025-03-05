import axios from "axios";

const host = "http://localhost:8080";

export const getList = async () => {
    const res = await axios.get(`${host}/list`);

    return res.data;
};

export const create = async (formData) => {
    const response = await axios.post(`${host}/rulebook/create`, formData);

    return response.data;
};

// 게시글 상세 조회 함수
export const getOne = async (id) => {
    const res = await axios.get(`${host}/rulebook/${id}`);  // 상세 조회를 위한 GET 요청
    return res.data;
};

export const modify = async (id, formData) => {
    const res = await axios.put(`${host}/rulebook/modify/${id}`, formData);

    return res.data;
};

export const remove = async (id) => {
    const res = await axios.delete(`${host}/rulebook/delete/${id}`);

    return res.data;
}; 