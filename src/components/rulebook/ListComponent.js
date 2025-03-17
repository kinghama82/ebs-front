"use client";

import { useEffect, useState } from "react";
import { Pencil, Dices, Flame, Dice1, Dice2, Dice3, Dice4, Dice5, ChevronRight, ChevronLeft } from 'lucide-react';
import React from 'react';
import { useRouter } from "next/navigation";

export default function ListComponent() {
    const [rulebook, setRulebook] = useState([]);
    const [filteredRulebook, setFilteredRulebook] = useState([]); // 필터링된 룰북 상태 추가
    const [isClient, setIsClient] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(1);    // 총 페이지 수 상태
    const [allRules, setAllRules] = useState([]);  // 전체 룰북 데이터
    const [searchQuery, setSearchQuery] = useState("");  // 검색어 상태
    const router = useRouter();

    const pageSize = 3;  // 한 페이지에 표시할 아이템 수


    useEffect(() => {
        setIsClient(true);  // 클라이언트에서만 렌더링되도록 설정
    }, []);

    useEffect(() => {
        // 전체 룰북 데이터를 한번만 가져옵니다 (인기글용)
        fetch('http://localhost:8080/rulebook/list')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.dtoList)) {
                    setAllRules(data.dtoList);
                    setFilteredRulebook(data.dtoList); // 필터링된 룰북 초기화
                } else {
                    console.error("Fetched data is not an array:", data);
                }
            })
            .catch((error) => console.error("Error fetching all rules:", error));

        // 현재 페이지에 맞는 룰북 데이터를 가져옵니다.
        fetch(`http://localhost:8080/rulebook/list?page=${currentPage}&size=${pageSize}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.dtoList)) {
                    setRulebook(data.dtoList);
                    setTotalPages(Math.ceil(data.totalCount / pageSize));  // 총 페이지 수 설정
                } else {
                    console.error("Fetched data is not an array:", data);
                }
            })
            .catch((error) => console.error("Error fetching rulebook:", error));
    }, [currentPage]);  // currentPage가 변경될 때마다 데이터를 다시 가져옴

    // 검색 버튼 클릭 시 룰북을 필터링
    const handleSearch = () => {
        if (searchQuery.trim() === "") {
            setFilteredRulebook(allRules); // 검색어가 없으면 전체 룰북 표시
            setTotalPages(Math.ceil(allRules.length / pageSize)); // 전체 룰북 기준으로 페이지 수 설정
        } else {
            const filtered = allRules.filter(rule =>
                rule.title.toLowerCase().includes(searchQuery.toLowerCase()) // 제목에 검색어가 포함된 경우
            );
            setFilteredRulebook(filtered); // 필터링된 룰북 설정
            setTotalPages(Math.ceil(filtered.length / pageSize)); // 총 페이지 수 업데이트
            setCurrentPage(1); // 검색 후 첫 페이지로 이동
        }
    };

    const handlePost = (id) => {
        if (isClient) {
            router.push(`rulebook/${id}`);  // 페이지 이동
        }
    };

    if (!isClient) {
        return null;  // 클라이언트에서만 렌더링되도록
    }

    // 글작성페이지 이동
    const moveCreate = () => {
        router.push('/rulebook/create'); // 페이지 이동
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

    // 전체 데이터 기준으로 조회수 내림차순 정렬
    const sortedByViewCount = [...allRules]
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 5);  // TOP 5만 가져옵니다

    // 전체 데이터 기준으로 추천수 내림차순 정렬
    const sortedByVoteCount = [...allRules]
        .sort((a, b) => b.voteCount - a.voteCount)  // 추천수를 기준으로 내림차순 정렬
        .slice(0, 5);  // TOP 5만 가져옵니다

    const rankingIcons = [
        <Dice1 key={1} style={{ fontSize: '50px' }} color="#E6C200" />, // 1위 - 금메달 느낌
        <Dice2 key={2} style={{ fontSize: '50px' }} color="#C0C0C0" />, // 2위 - 은메달 느낌
        <Dice3 key={3} style={{ fontSize: '50px' }} color="#CD7F32" />, // 3위 - 동메달 느낌
        <Dice4 key={4} style={{ fontSize: '50px' }} color="#000" />, // 4위 - 일반 아이콘
        <Dice5 key={5} style={{ fontSize: '50px' }} color="#000" />, // 5위 - 일반 아이콘
    ];


    // 페이지네이션 버튼 클릭 처리 함수
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };



    return (
        <div className="mx-auto w-full max-w-6xl dark:text-white">
            <div className="flex justify-center text-4xl py-1" style={{ marginTop: '40px', backgroundColor: 'transparent', color: '#D97706', borderBottom: '2px solid #D97706' }}>
                <Dices size={30}/>룰북 게시판
            </div>

            {/* 인기글 두 개 나란히 배치 */}
            <div className="flex justify-between w-full">
                {/* 첫 번째 인기글 */}
                <div className="mx-auto w-2/4 max-w-xl">
                    <div className="flex justify-center py-1" style={{ margin: '50px', backgroundColor: 'transparent'}}>
                        <div className="w-full">
                            <div className="flex" style={{ marginBottom: '1px', borderBottom: '2px solid #000' }}>
                                <div className="p-1 flex items-center justify-center" style={{ flex: 1 }}>
                                    추천수 TOP5 인기글<Flame size={30} style={{ color: 'red' }}/>
                                </div>
                                <div className="p-1 flex items-center justify-center" style={{ flex: 1}}>
                                    추천수
                                </div>
                            </div>

                            {sortedByVoteCount.map((rule, index) => (
                                <div key={rule.id} className="flex border-bottom-none">
                                    <div className="flex-1/2 p-2 flex items-center justify-center" style={{ width: 'auto', height: 'auto', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: index < 3 ? '50px' : '24px', padding: '0', lineHeight: 'auto', textAlign: 'center' }}>
                                        {index < 5 ? rankingIcons[index] : index + 1}
                                    </div>

                                    <div className="p-2 cursor-pointer text-blue-600 underline" onClick={() => handlePost(rule.id)} style={{ flex: '1', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                                        {rule.title}
                                    </div>

                                    <div className="flex-1 p-2 flex items-center justify-center">
                                        {rule.voteCount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 두 번째 인기글 */}
                <div className="mx-auto w-2/4 max-w-xl">
                    <div className="flex justify-center py-1" style={{ margin: '50px', backgroundColor: 'transparent'}}>
                        <div className="w-full">
                            <div className="flex" style={{ marginBottom: '1px', borderBottom: '2px solid #000' }}>
                                <div className="p-1 flex items-center justify-center" style={{ flex: 1 }}>
                                    조회수 TOP5 인기글<Flame size={30} style={{ color: 'red' }}/>
                                </div>
                                <div className="p-1 flex items-center justify-center" style={{ flex: 1}}>
                                    조회수
                                </div>
                            </div>

                            {sortedByViewCount.map((rule, index) => (
                                <div key={rule.id} className="flex border-bottom-none">
                                    <div className="flex-1/2 p-2 flex items-center justify-center" style={{ width: 'auto', height: 'auto', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: index < 3 ? '50px' : '24px', padding: '0', lineHeight: 'auto', textAlign: 'center' }}>
                                        {index < 5 ? rankingIcons[index] : index + 1}
                                    </div>

                                    <div className="p-2 cursor-pointer text-blue-600 underline" onClick={() => handlePost(rule.id)} style={{ flex: '1', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                                        {rule.title}
                                    </div>

                                    <div className="flex-1 p-2 flex items-center justify-center">
                                        {rule.viewCount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 일반게시판 */}
            <div className="w-full" style={{ borderTop: '3px solid #000'}}>
                <div className="flex" style={{ marginBottom: '5px' }}>
                    <div className="p-2 flex items-center justify-center" style={{ flex: 1 }}>글 번호</div>
                    <div className="p-2 flex items-center justify-center" style={{ flex: 3 }}>제목</div>
                    <div className="p-2 flex items-center justify-center" style={{ flex: 1 }}>작성자</div>
                    <div className="p-2 flex items-center justify-center" style={{ flex: 1 }}>작성일</div>
                    <div className="p-2 flex items-center justify-center" style={{ flex: 1 }}>추천수</div>
                    <div className="p-2 flex items-center justify-center" style={{ flex: 1 }}>조회수</div>
                </div>

                {(searchQuery.trim() === "" ? rulebook : filteredRulebook).map((rule, index) => (
                    <div key={rule.id} className="flex border-b">
                        <div className="p-2 flex items-center justify-center" style={{ flex: 1 }}>
                            {totalPages * pageSize - (currentPage - 1) * pageSize - index}
                        </div>
                        <div className="flex-1 p-2 flex items-center justify-center cursor-pointer text-blue-600 underline"
                             onClick={() => handlePost(rule.id)} style={{ flex: 3 }}>
                            {rule.title}
                        </div>
                        <div className="flex-1 p-2 flex items-center justify-center" style={{ flex: 1 }}>
                            {rule.writer.nickname}
                        </div>
                        <div className="flex-1 p-2 flex items-center justify-center" style={{ flex: 1 }}>
                            {formatDate(rule.createdate)}
                        </div>
                        <div className="flex-1 p-2 flex items-center justify-center" style={{ flex: 1 }}>
                            {rule.voteCount}
                        </div>
                        <div className="flex-1 p-2 flex items-center justify-center" style={{ flex: 1 }}>
                            {rule.viewCount !== undefined && rule.viewCount !== null ? rule.viewCount : 0}
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 버튼 */}
            <div className="flex justify-center mt-4 gap-2">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={buttonStyle}
                >
                    <ChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter((page) => {
                        return (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 2 && page <= currentPage + 2)
                        );
                    })
                    .map((page, index, pages) => (
                        <React.Fragment key={page}>
                            {index > 0 && page !== pages[index - 1] + 1 && (
                                <span style={{ padding: '7px' }}>....</span>
                            )}

                            <button
                                onClick={() => goToPage(page)}
                                style={{
                                    ...buttonStyle,
                                    fontWeight: currentPage === page ? 'bold' : 'normal',
                                    color: currentPage === page ? 'skyblue' : 'black'
                                }}
                            >
                                {page}
                            </button>
                        </React.Fragment>
                    ))
                }

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={buttonStyle}
                >
                    <ChevronRight />
                </button>
            </div>

            {/* 검색 입력 필드 */}
            <div className="my-4 flex justify-start">
                <input
                    type="text"
                    placeholder="제목으로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border rounded"
                    style={{ width: '300px'}}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        border: '2px solid #D97706',
                        padding: '5px',
                        background: '#D97706',
                        borderRadius: '5px',
                        color: 'white'
                    }}
                >
                    검색
                </button>
            </div>
            {/* 글 작성 버튼 */}
            <button
                onClick={moveCreate}
                style={{
                    ...buttonStyle,
                    marginTop: '20px',
                    backgroundColor: '#D97706',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px'
                }}
            >
                글 작성 <Pencil size={15} />
            </button>
        </div>
    );
}

const buttonStyle = {
    backgroundColor: 'transparent',
    color: 'black',
    padding: '10px 15px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
};
