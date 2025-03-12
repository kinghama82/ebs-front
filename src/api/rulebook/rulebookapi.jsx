import axios from "axios";

const host = "http://localhost:8080";

//리스트 호출
export const getList = async () => {
    const res = await axios.get(`${host}/rulebook/list`);

    return res.data;
};

//작성
export const create = async (rulebookData) => {
    const response = await axios.post(`${host}/rulebook/create`, rulebookData, {
        headers: { 'Content-Type': 'application/json' }, // JSON 전송을 명시
    });

    return response.data;
};
// 게시글 상세 조회 함수
export const getOne = async (id) => {
    const res = await axios.get(`${host}/rulebook/${id}`);  // 상세 조회를 위한 GET 요청
    return res.data;
};

//수정
export const modify = async (id, formData) => {
    const res = await axios.put(`${host}/rulebook/modify/${id}`, formData);

    return res.data;
};

//삭제
export const remove = async (id) => {
    const res = await axios.delete(`${host}/rulebook/delete/${id}`);

    return res.data;
}; 

// 조회수 증가 API 호출 함수
export const incrementViewCount = async (id) => {
    const res = await axios.post(`${host}/rulebook/${id}/view`);  // 조회수 증가를 위한 POST 요청
    return res.data;
};

export const createAnswer = async (rulebookId, formData) => {
    const res = await axios.post(`${host}/rulebook/${rulebookId}/answers/create`, formData);
    return res.data;
};

export const getAnswer = async (rulebookId) => {
    const res = await axios.get(`${host}/rulebook/${rulebookId}/answers`);

    return res.data;
}