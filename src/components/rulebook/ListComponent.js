"use client";

import { useEffect, useState } from "react";

export default function ListComponent() {
    const [rulebook, setRulebook] = useState([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);  // 클라이언트에서만 렌더링되도록 설정
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/rulebook/list")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.dtoList)) {
                    setRulebook(data.dtoList);
                } else {
                    console.error("Fetched data is not an array:", data);
                }
            })
            .catch((error) => console.error("Error fetching rulebook:", error));
    }, []);

    const handlePost = (id) => {
        if (isClient) {
            window.location.href = `/rulebook/${id}`;  // window.location을 이용해 페이지 이동
        }
    };

    if (!isClient) {
        return null;  // 클라이언트에서만 렌더링되도록
    }

    return (
        <div className="mx-auto w-full max-w-4xl">
            <div className="flex justify-center bg-[#813D00] text-3xl py-4" style={{ margin: '40px' }}>
                RuleBook List
            </div>

            <div className="w-full">
                <div className="flex bg-yellow-100" style={{ marginBottom: '10px' }}>
                    <div className="flex-1 p-2 flex items-center justify-center">제목</div>
                    <div className="flex-1 p-2 flex items-center justify-center">내용</div>
                    <div className="flex-1 p-2 flex items-center justify-center">작성자</div>
                    <div className="flex-1 p-2 flex items-center justify-center">날짜</div>
                </div>

                {rulebook.map((rule) => (
                    <div key={rule.id} className="flex border-b">
                        <div
                            className="flex-1 p-2 flex items-center justify-center cursor-pointer text-blue-600 underline"
                            onClick={() => handlePost(rule.id)}  // 클릭 시 해당 id로 상세 페이지 이동
                        >
                            {rule.title}
                        </div>
                        <div className="flex-1 p-2 flex items-center justify-center">{rule.content}</div>
                        <div className="flex-1 p-2 flex items-center justify-center">{rule.writerId}</div>
                        <div className="flex-1 p-2 flex items-center justify-center">{rule.createdate}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
