"use client";

import { useEffect, useState } from "react";
import { Pencil } from 'lucide-react'

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

    // 글작성페이지 이동
    const moveCreate = () => {
        window.location.href = '/rulebook/create'; // 페이지 이동
    };

    // 날짜 포맷 함수
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const today = new Date();
    
        // 오늘 날짜와 비교 (시간을 제외한 날짜만 비교)
        const isToday = date.toDateString() === today.toDateString();
    
        if (isToday) {
            // 오늘이면 시와 분만 출력
            return date.toLocaleString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
        } else {
            // 오늘이 아니면 날짜만 출력
            return date.toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour12: false,
            }).replace(/\./g, '-').replace(/ /g, '');
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl">
            <div className="flex justify-center bg-[#813D00] text-3xl py-4" style={{ margin: '40px' }}>
                RuleBook List
            </div>

            <div className="w-full">
                <div className="flex bg-yellow-100" style={{ marginBottom: '10px' }}>
                    <div className="p-2 flex items-center justify-center bg-red-300" style={{ flex: 3 }}>제목</div>
                    <div className="p-2 flex items-center justify-center bg-blue-300" style={{ flex: 1 }}>작성자</div>
                    <div className="p-2 flex items-center justify-center" style={{ flex: 1 }}>작성일</div>
                    <div className="p-2 flex items-center justify-center" style={{ flex: 1 }}>조회수</div> {/* 조회수 칸 추가 */}
                </div>

                {rulebook.map((rule) => (
                    <div key={rule.id} className="flex border-b">
                        <div
                            className="flex-1 p-2 flex items-center justify-center cursor-pointer text-blue-600 underline bg-red-300"
                            onClick={() => handlePost(rule.id)} style={{ flex: 3 }}
                        >
                            {rule.title}
                        </div>
                        <div className="flex-1 p-2 flex items-center justify-center" style={{ flex: 1 }}>{rule.writerId}</div>
                        <div className="flex-1 p-2 flex items-center justify-center" style={{ flex: 1 }}>{formatDate(rule.createdate)}</div>
                        <div className="flex-1 p-2 flex items-center justify-center" style={{ flex: 1 }}>   {rule.viewCount !== undefined && rule.viewCount !== null ? rule.viewCount : 0}</div> {/* 조회수 표시 */}
                    </div>
                ))}
            </div>

            <button onClick={moveCreate}
                style={{ ...buttonStyle, marginTop: '20px', backgroundColor: '#D97706', display: 'flex', alignItems: 'center', gap: '7px' }} >
                글 작성 <Pencil size={15} />
            </button>
        </div>
    );
}

const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
}
