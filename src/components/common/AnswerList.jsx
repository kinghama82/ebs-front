import React from 'react';

const AnswerList = ({ answers }) => {
    return (
        <div>
            <h3 className="text-2xl mt-4">답글 목록</h3>
            <div className="list-disc pl-5">
                {answers.slice(0, 5).map(answer => (
                    <div key={answer.id} className="my-4">
                        작성자
                        <div className="border border-black-500 rounded-lg p-4 bg-black-100">
                            {answer.content}
                            <div className="flex justify-end">{answer.createDate}</div>
                            <div>{answer.writerId}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnswerList;
