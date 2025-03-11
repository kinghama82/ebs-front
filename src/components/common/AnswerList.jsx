import React from 'react';

const AnswerList = ({ answers }) => {
    // 날짜 포맷팅 함수
    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleString('ko-KR', options);  // 한국식 날짜 포맷
    };

    return (
        <div>
            <h3 className="text-2xl mt-4">답글 목록</h3>
            <div className="pl-6">
                {answers.slice(0, 5).map(answer => (
                    <div key={answer.id} className="my-2">
                        <div className="border border-gray-500 rounded-lg p-3">
                            <div className="mb-2 text-xl font-bold">{answer.writer.nickname}</div>
                            <div>{answer.content}</div>
                            {/* 포맷팅된 날짜 출력 */}
                            <div className="mt-1 text-sm text-gray-500">{formatDate(answer.createDate)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnswerList;
