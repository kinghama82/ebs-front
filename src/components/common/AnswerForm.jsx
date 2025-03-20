import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCustomCookie } from "@/components/common/useCustomCookie";
import {API_SERVER_HOST} from "@/api/publicapi";

const AnswerForm = ({ rulebookId, onAnswerAdded }) => {
    const [content, setContent] = useState('');
    const userInfo = useCustomCookie();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${API_SERVER_HOST}/rulebook/${rulebookId}/answers/create`,
                {
                    writerId: userInfo.id,  // 'gamer' 대신 'writerId' 사용
                    content: content,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            window.location.reload();

            if (response.status === 200) {
                onAnswerAdded(response.data);
                setContent('');

            }
        } catch (error) {
            console.error("Error occurred while submitting the answer:", error);
            alert("답글 작성 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    };


    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <textarea
                placeholder="답글 내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="border p-2 mr-2 w-3/4"
            />
            <button type="submit" className="bg-[#D97706] text-white p-2 rounded">답글 작성</button>
        </form>
    );
};

export default AnswerForm;
