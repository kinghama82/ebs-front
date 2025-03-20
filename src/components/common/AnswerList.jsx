import React, { useState } from 'react';
import { X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCustomCookie } from "@/components/common/useCustomCookie";
import {API_SERVER_HOST} from "@/api/publicapi";

const AnswerList = ({ answers, rulebookId }) => {
    const router = useRouter();
    const userInfo = useCustomCookie(); // 로그인한 사용자 정보 가져오기


    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleString('ko-KR', options);
    };

    const handleDelete = async (answerId) => {

        if (!rulebookId) {
            console.error("❌ rulebookId가 없습니다!");
            return;
        }

        if (window.confirm("정말 삭제하시겠습니까?")) {
            await axios.delete(`${API_SERVER_HOST}/rulebook/${rulebookId}/answers/${answerId}`);
            window.location.reload();
        }
    };

    return (
        <div>
            <h3 className="text-2xl mt-4">답글 목록</h3>
            <div className="pl-6">
                {answers?.map((answer, index) => (
                    <div key={index} className="my-2">
                        <div className="border border-gray-500 rounded-lg p-3">
                            <div className="mb-2 text-xl font-bold">{answer.writerNickname}</div>

                                <div>{answer.content}</div>

                            <div className="mt-1 text-sm text-gray-500 flex justify-between items-center">
                                <span>{answer.createdDate}</span>

                                {/* 로그인한 사용자의 ID와 작성자의 ID가 같을 때만 버튼 표시 */}
                                {userInfo?.id === answer.gamer && (
                                    <button onClick={() => handleDelete(answer.id)} className="text-red-500">
                                        <X size={18} />
                                    </button>
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
