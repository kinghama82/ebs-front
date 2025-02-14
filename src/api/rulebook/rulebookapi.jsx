import {API_SERVER_HOST} from "@/api/publicapi";
import axios from "axios";

const host = `${API_SERVER_HOST}/rulebook`

export const getList = async () => {
    const res = await axios.get(`${host}/list`)

    return res.data
}