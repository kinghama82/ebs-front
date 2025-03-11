// components/AnswerForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCustomCookie } from "@/components/common/useCustomCookie";

const AnswerForm = ({ rulebookId, onAnswerAdded }) => {
    const [content, setContent] = useState('');
    const userInfo = useCustomCookie();

    const handleSubmit = async (e) => {

        e.preventDefault();

        const response = await axios.post(`http://localhost:8080/rulebook/${rulebookId}/answers/create`, {
            writerId: userInfo.id, // 로그인 ID를 자동으로 사용
            content,
        });

        if (response.status === 200) {
            onAnswerAdded(response.data);
            setContent(''); // 답글 내용 초기화
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
