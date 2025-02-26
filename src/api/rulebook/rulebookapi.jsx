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
