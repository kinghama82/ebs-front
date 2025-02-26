"use client";

import { useEffect, useState } from "react";

export default function ListComponent() {
    const [rulebook, setRulebook] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/rulebook/list")  // Ensure this is the correct endpoint
            .then((res) => res.json())
            .then((data) => {
                // 데이터 구조를 확인하고, dtoList에서 배열 추출
                if (Array.isArray(data.dtoList)) {
                    setRulebook(data.dtoList);  // dtoList에서 배열을 추출하여 상태에 저장
                } else {
                    console.error("Fetched data is not an array:", data);
                }
            })
            .catch((error) => console.error("Error fetching rulebook:", error));
    }, []);

    return (
        <div className="mx-auto w-full max-w-4xl">
        <div className="flex justify-center bg-[#813D00] text-3xl py-4" style={{ margin: '40px' }}>
            RuleBook List
        </div>
    
        <div className="w-full">
            <div className="flex bg-yellow-100" style={{marginBottom:'10px'}}>
                <div className="flex-1 p-2 flex items-center justify-center">제목</div>
                <div className="flex-1 p-2 flex items-center justify-center">내용</div>
                <div className="flex-1 p-2 flex items-center justify-center">작성자</div>
                <div className="flex-1 p-2 flex items-center justify-center">날짜</div>
            </div>
    
            {rulebook.map((rule) => (
                <div key={rule.id} className="flex border-b">
                    <div className="flex-1 p-2 flex items-center justify-center">{rule.title}</div>
                    <div className="flex-1 p-2 flex items-center justify-center">{rule.content}</div>
                    <div className="flex-1 p-2 flex items-center justify-center">{rule.writerId}</div>
                    <div className="flex-1 p-2 flex items-center justify-center">{rule.createdate}</div>
                </div>
            ))}
        </div>
    </div>
    );
}
