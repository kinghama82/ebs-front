import React, { useState } from 'react';
import { X, Edit } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCustomCookie } from "@/components/common/useCustomCookie";

const AnswerList = ({ answers, rulebookId }) => {
    const [editMode, setEditMode] = useState(null);
    const [editContent, setEditContent] = useState("");
    const router = useRouter();
    const userInfo = useCustomCookie(); // 로그인한 사용자 정보 가져오기

    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleString('ko-KR', options);
    };

    const handleDelete = async (answerId) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            await axios.delete(`http://localhost:8080/rulebook/${rulebookId}/answers/${answerId}`);
            window.location.reload();
        }
    };

    const handleEdit = (answer) => {
        setEditMode(answer.id);
        setEditContent(answer.content);
    };

    const handleEditSubmit = async (answerId) => {
        await axios.put(`http://localhost:8080/rulebook/${rulebookId}/answers/${answerId}`, { content: editContent });
        setEditMode(null);
        window.location.reload();
    };

    return (
        <div>
            <h3 className="text-2xl mt-4">답글 목록</h3>
            <div className="pl-6">
                {answers.slice(0, 5).map(answer => (
                    <div key={answer.id} className="my-2">
                        <div className="border border-gray-500 rounded-lg p-3">
                            <div className="mb-2 text-xl font-bold">{answer.writer.nickname}</div>

                            {editMode === answer.id ? (
                                <div>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                    <button onClick={() => handleEditSubmit(answer.id)} className="text-blue-500">수정 완료</button>
                                </div>
                            ) : (
                                <div>{answer.content}</div>
                            )}

                            <div className="mt-1 text-sm text-gray-500 flex justify-between items-center">
                                <span>{formatDate(answer.createDate)}</span>

                                {/* 로그인한 사용자의 ID와 작성자의 ID가 같을 때만 버튼 표시 */}
                                {userInfo?.id === answer.writer.id && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(answer)} className="text-yellow-500"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(answer.id)} className="text-red-500"><X size={18} /></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnswerList;
