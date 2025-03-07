"use client";

import { useEffect, useState } from "react";
import { Pencil, Dices, Flame, Medal, Dice1, Dice2, Dice3, Dice4, Dice5 } from 'lucide-react';

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

    // 조회수 기준으로 내림차순 정렬
    const sortedByViewCount = [...rulebook].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

    const rankingIcons = [
        <Dice1 key={1} style={{ fontSize: '50px' }} color="#E6C200" />, // 1위 - 금메달 느낌
        <Dice2 key={2} style={{ fontSize: '50px' }} color="#C0C0C0" />, // 2위 - 은메달 느낌
        <Dice3 key={3} style={{ fontSize: '50px' }} color="#CD7F32" />, // 3위 - 동메달 느낌
        <Dice4 key={4} style={{ fontSize: '50px' }} color="#000" />, // 3위 - 동메달 느낌
        <Dice5 key={5} style={{ fontSize: '50px' }} color="#000" />, // 3위 - 동메달 느낌
    ];


    return (
        <div className="mx-auto w-full max-w-6xl">
            <div className="flex justify-center text-4xl py-1" style={{ marginTop: '40px', backgroundColor: 'transparent', color: '#D97706', borderBottom: '2px solid #D97706' }}>
                <Dices size={30}/>룰북 게시판
            </div>
            {/* 인기글 두 개 나란히 배치 */}
            <div className="flex justify-between w-full">

                {/* 첫 번째 인기글 */}
                <div className="mx-auto w-2/4 max-w-xl">
                    <div className="flex justify-center py-1" style={{ margin: '50px', backgroundColor: 'transparent'}}>
                        <div className="w-full">
                            <div className="flex" style={{ marginBottom: '1px' , borderBottom: '2px solid #000' }}>
                                <div className="p-1 flex items-center justify-center" style={{ flex: 1 }}>
                                    조회수 TOP5 인기글<Flame size={30} style={{ color: 'red' }}/>
                                </div>
                                <div className="p-1 flex items-center justify-center" style={{ flex: 1}}>
                                    조회수
                                </div>
                            </div>

                            {sortedByViewCount.map((rule, index) => (
                                <div key={rule.id} className="flex border-bottom-none">
                                    {/* 숫자 부분 - 1, 2, 3만 메달 아이콘으로 변경 */}
                                    <div
                                        className="flex-1/2 p-2 flex items-center justify-center"
                                        style={{

                                            width: 'auto',  // 너비를 자동으로 설정
                                            height: 'auto', // 높이를 자동으로 설정
                                            borderRadius: '50%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: index < 3 ? '50px' : '24px',  // 1, 2, 3위는 50px 크기로, 나머지는 24px
                                            padding: '0',
                                            lineHeight: 'auto',  // 자동으로 높이를 맞추기
                                            textAlign: 'center',
                                        }}
                                    >
                                        {index < 5 ? rankingIcons[index] : index + 1}
                                    </div>


                                    {/* 제목 부분 - 클릭 가능하도록 링크 유지 */}
                                    <div
                                        className="p-2 cursor-pointer text-blue-600 underline"
                                        onClick={() => handlePost(rule.id)}
                                        style={{
                                            flex: '1',               // flex-grow를 제한
                                            display: 'block',        // 블록 요소로 변경
                                            whiteSpace: 'nowrap',    // 한 줄만 표시
                                            overflow: 'hidden',      // 넘치는 내용 숨김
                                            textOverflow: 'ellipsis',// 넘치는 부분 "..."으로 표시
                                            maxWidth: '100%',        // 부모 요소 내에서 최대한 확장
                                        }}
                                    >
                                        {rule.title}
                                    </div>

                                    {/* 조회수 */}
                                    <div className="flex-1 p-2 flex items-center justify-center">
                                        {rule.viewCount !== undefined && rule.viewCount !== null ? rule.viewCount : 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 두 번째 인기글 (같은 구조로 추가) */}
                <div className="mx-auto w-2/4 max-w-xl">
                    <div className="flex justify-center py-1" style={{ margin: '50px', backgroundColor: 'transparent'}}>
                        <div className="w-full">
                            <div className="flex" style={{ marginBottom: '1px' , borderBottom: '2px solid #000' }}>
                                <div className="p-1 flex items-center justify-center" style={{ flex: 1 }}>
                                    조회수 TOP5 인기글<Flame size={30} style={{ color: 'red' }}/>
                                </div>
                                <div className="p-1 flex items-center justify-center" style={{ flex: 1}}>
                                    조회수
                                </div>
                            </div>

                            {sortedByViewCount.map((rule, index) => (
                                <div key={rule.id} className="flex border-bottom-none">
                                    {/* 숫자 부분 - 1, 2, 3만 메달 아이콘으로 변경 */}
                                    <div
                                        className="flex-1/2 p-2 flex items-center justify-center"
                                        style={{

                                            width: 'auto',  // 너비를 자동으로 설정
                                            height: 'auto', // 높이를 자동으로 설정
                                            borderRadius: '50%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: index < 3 ? '50px' : '24px',  // 1, 2, 3위는 50px 크기로, 나머지는 24px
                                            padding: '0',
                                            lineHeight: 'auto',  // 자동으로 높이를 맞추기
                                            textAlign: 'center',
                                        }}
                                    >
                                        {index < 5 ? rankingIcons[index] : index + 1}
                                    </div>


                                    {/* 제목 부분 - 클릭 가능하도록 링크 유지 */}
                                    <div
                                        className="p-2 cursor-pointer text-blue-600 underline"
                                        onClick={() => handlePost(rule.id)}
                                        style={{
                                            flex: '1',               // flex-grow를 제한
                                            display: 'block',        // 블록 요소로 변경
                                            whiteSpace: 'nowrap',    // 한 줄만 표시
                                            overflow: 'hidden',      // 넘치는 내용 숨김
                                            textOverflow: 'ellipsis',// 넘치는 부분 "..."으로 표시
                                            maxWidth: '100%',        // 부모 요소 내에서 최대한 확장
                                        }}
                                    >
                                        {rule.title}
                                    </div>

                                    {/* 조회수 */}
                                    <div className="flex-1 p-2 flex items-center justify-center">
                                        {rule.viewCount !== undefined && rule.viewCount !== null ? rule.viewCount : 0}
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>

            {/* 일반게시판 */}
            <div className="w-full" style={{ borderTop: '3px solid #000' }}>
                <div className="flex" style={{ marginBottom: '5px' }}>
                    <div className="p-2 flex items-center justify-center" style={{ flex: 3 }}>제목</div>
                    <div className="p-2 flex items-center justify-center" style={{ flex: 1 }}>작성자</div>
                    <div className="p-2 flex items-center justify-center" style={{ flex: 1 }}>작성일</div>
                    <div className="p-2 flex items-center justify-center" style={{ flex: 1 }}>조회수</div>
                </div>

                {rulebook.map((rule) => (
                    <div key={rule.id} className="flex border-b">
                        <div
                            className="flex-1 p-2 flex items-center justify-center cursor-pointer text-blue-600 underline"
                            onClick={() => handlePost(rule.id)} style={{ flex: 3 }}
                        >
                            {rule.title}
                        </div>
                        <div className="flex-1 p-2 flex items-center justify-center" style={{ flex: 1 }}>{rule.writerId}</div>
                        <div className="flex-1 p-2 flex items-center justify-center" style={{ flex: 1 }}>{formatDate(rule.createdate)}</div>
                        <div className="flex-1 p-2 flex items-center justify-center" style={{ flex: 1 }}>
                            {rule.viewCount !== undefined && rule.viewCount !== null ? rule.viewCount : 0}
                        </div>
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
};
