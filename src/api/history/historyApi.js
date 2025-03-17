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

//최근 플레이 게임
export const getRecentGames = async (gamerid) => {
    const res = await axios.get(`${host}/recent/${gamerid}`)
    return res.data
}

//연도별 히스토리 검색
export const getHistoryByYear = async (gamerid, year, page, size = 10) => {
    const res = await axios.get(`${host}/byYear`, { params: { gamerid, year, page, size } });
    return res.data;
};

//통산전적
export const getTotalRecord = async (gamerid, year = null) => {
    try {
        const params = {gamerid}
        if(year) {
            params.year = year
        }
        const res = await axios.get(`${host}/totalrecord`, { params });

        if (!res.data || Object.keys(res.data).length === 0) {
            console.warn("API 응답이 비어있음, 기본값 반환");
            return { win: 0, draw: 0, lose: 0 };
        }

        return res.data;
    } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
        return { win: 0, draw: 0, lose: 0 };
    }
}
