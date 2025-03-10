// components/AnswerForm.js
import React, { useState } from 'react';
import axios from 'axios';

const AnswerForm = ({ rulebookId, onAnswerAdded }) => {
    const [writerId, setWriterId] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post(`http://localhost:8080/rulebook/${rulebookId}/answers/create`, {
            writerId,
            content,
        });

        if (response.status === 200) {
            onAnswerAdded(response.data);
            setWriterId('');
            setContent('');
        }
    };

    return (

        <form onSubmit={handleSubmit} className="mt-4">
            <input
                type="number"
                placeholder="작성자 ID"
                value={writerId}
                onChange={(e) => setWriterId(e.target.value)}
                required
                className="border p-2 mr-2"
            />
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
