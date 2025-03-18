// components/AnswerForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCustomCookie } from "@/components/common/useCustomCookie";

const AnswerForm = ({ rulebookId, onAnswerAdded }) => {
    const [content, setContent] = useState('');
    const userInfo = useCustomCookie();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8080/rulebook/${rulebookId}/answers/create`, {
                gamerId: userInfo.id,
                content,
            });

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
