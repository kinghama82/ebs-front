"use client";
import { getHistoryByYear, getList } from "@/api/history/historyApi";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

const initState = {
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0
};

const HistoryList = ({ userInfo, selectedYear }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
    const size = parseInt(searchParams.get("size")) || 10;
    const gamerid = searchParams.get("gamerid")
    const [serverData, setServerData] = useState(initState);
    const [fetching, setFetching] = useState(false);
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc")

    useEffect(() => {
        setFetching(true);

        if (!selectedYear) { //연도검색 안하면 기본 getList
            getList({ page, size }, gamerid).then(data => {
                console.log(data);
                setServerData(data);
                setFetching(false);

            });
        } else {   //연도검색 선택하면 연도별 getList
            getHistoryByYear(gamerid, selectedYear, page, size).then(data => {
                setServerData(data);
                setFetching(false);

            });
        }
    }, [page, size, gamerid, selectedYear]);

    // 정렬 함수
    const handleSort = (key) => {
        const newSortOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
        setSortKey(key);
        setSortOrder(newSortOrder);
    };
    // ✅ 데이터 정렬 적용
    const sortedData = [...serverData.dtoList].sort((a, b) => {
        if (!sortKey) return 0; // 정렬 키가 없으면 기존 순서 유지
        const valueA = a[sortKey];
        const valueB = b[sortKey];

        if (typeof valueA === "string") {
            return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
        }
    });


    // 글번호 계산 (전체 개수에서 현재 페이지 오프셋을 뺀 값)
    const startNumber = serverData.totalCount - (page - 1) * size;

    //페이지 이동 함수 (상태도 업데이트)
    const moveToPage = (newPage) => {
        setPage(newPage);
        router.replace(`?page=${newPage}&size=${size}${gamerid ? `&gamerid=${gamerid}` : ""}`, { scroll: false });
    };

    return (
        <div className="mt-10 mr-2 ml-2">
            

            {/* 히스토리 리스트 */}
            <div className="flex flex-col mx-auto p-6 space-y-2">
                <div className="flex items-center justify-between w-full p-2 border-b border-black">
                    <span className="w-1/12  text-center font-bold ">글번호</span>
                    <span className="w-5/12  text-center font-bold ">제 목</span>
                    <span className="w-1/12  text-center font-bold ">전 적</span>
                    <span className="w-2/12  text-center font-bold ">게 임 이 름</span>
                    <span className="w-2/12  text-center font-bold cursor-pointer flex items-center justify-center gap-1" 
                          onClick={() => handleSort("date")}>기 록 일<ArrowUpDown className="w-4 h-4"/></span>
                </div>
                {sortedData.length > 0 ? (
                    sortedData.map((history, index) => (
                        <div key={history.id}
                            className="flex items-center justify-between w-full p-2 border-b border-black ">
                            <span className="w-1/12 text-center ">{startNumber - index}</span>
                            <span className="w-5/12 text-center " >
                                <Link href={`/history/read/${history.id}`}>{history.title}</Link>
                            </span>
                            <span className={`w-1/12 text-center font-bold 
                            ${history.win ? "text-green-700" : history.draw ? "text-yellow-600" : "text-orange-600"}`}>
                                {history.win ? "Win" : history.draw ? "Draw" : "Lose"}
                            </span>
                            <span className="w-2/12 text-center text-blue-700">
                                <Link href={`/games/${history.game.id}`}>{history.game.gameName}</Link>
                            </span>
                            <span className="w-2/12 text-center ">{history.date}</span>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-4">해당 연도에 기록이 없습니다.</div>
                )}
            </div>

            {/* 페이지네이션 */}

            <Pagination>
                <PaginationContent>
                    {serverData.prev && (
                        <PaginationItem>
                            <PaginationPrevious
                                href={`?page=${serverData.prevPage}&size=${size}${gamerid ? `&gamerid=${gamerid}` : ""}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    moveToPage(serverData.prevPage)
                                }} />
                        </PaginationItem>
                    )}

                    {serverData.pageNumList.map(pageNum => (
                        <PaginationItem key={pageNum}>
                            <PaginationLink
                                href={`?page=${pageNum}&size=${size}${gamerid ? `&gamerid=${gamerid}` : ""}`}
                                className={serverData.current === pageNum ? "bg-gray-500 text-white" : ""}
                                onClick={(e) => {
                                    e.preventDefault()
                                    moveToPage(pageNum)
                                }}
                            >
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {serverData.next && (
                        <PaginationItem>
                            <PaginationNext
                                href={`?page=${serverData.nextPage}&size=${size}${gamerid ? `&gamerid=${gamerid}` : ""}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    moveToPage(serverData.nextPage)
                                }} />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>

        </div>
    );
};

export default HistoryList;
