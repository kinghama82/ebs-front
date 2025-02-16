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
        <div>

            <div className="flex justify-content-center bg-[#813D00] text-3xl py-4">RuleBook List</div>


        <table className="w-full table-auto border-collapse">
            <thead>
            <tr className="bg-yellow-100">
                <th className="p-2 border">제목</th>
                <th className="p-2 border">내용</th>
                <th className="p-2 border">작성자</th>
                <th className="p-2 border">날짜</th>
            </tr>
            </thead>
            <tbody>
            {rulebook.map((rule) => (
                <tr key={rule.id}>
                   <td className="p-2 border">{rule.title}</td>
                    <td className="p-2 border">{rule.content}</td>
                    <td className="p-2 border">{rule.writerId}</td>
                    <td className="p-2 border">{rule.createdate}</td>
                </tr>
            ))}
            </tbody>
        </table>

        </div>
    );
}
