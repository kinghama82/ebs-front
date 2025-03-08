"use client";
import { getList } from "@/api/history/historyApi";
import { API_SERVER_HOST } from "@/api/publicapi";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FetchingModal from "../common/FetchingModal";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import Link from "next/link";

const host = API_SERVER_HOST;

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

const HistoryList = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // ✅ 상태 추가하여 강제 리렌더링
    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
    const size = parseInt(searchParams.get("size")) || 10;
    const gamerid = searchParams.get("gamerid")

    const [serverData, setServerData] = useState(initState);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        setFetching(true);
        getList({ page, size }, gamerid).then(data => {
            console.log(data);
            setServerData(data);
            setFetching(false);
        });
    }, [page, size, gamerid]); 

    //페이지 이동 함수 (상태도 업데이트)
    const moveToPage = (newPage) => {
        setPage(newPage); 
        router.replace(`?page=${newPage}&size=${size}${gamerid ? `&gamerid=${gamerid}` : ""}`,{scroll: false});
    };

    return (
        <div className="mt-10 mr-2 ml-2">
            {fetching ? <FetchingModal /> : null}
            
            {/* 히스토리 리스트 */}
            <div className="flex flex-col mx-auto p-6 space-y-2">
                <div className="flex items-center justify-between w-full p-2 border-b border-black">
                    <span className="w-1/12  text-center font-bold ">글번호</span>                    
                    <span className="w-5/12  text-center font-bold ">제 목</span>
                    <span className="w-1/12  text-center font-bold ">전 적</span>
                    <span className="w-2/12  text-center font-bold ">게 임 이 름</span>
                    <span className="w-2/12  text-center font-bold ">기 록 일</span>
                </div>
            
                {serverData.dtoList.map(history => (
                    <div key={history.id} 
                         className="flex items-center justify-between w-full p-2 border-b border-black ">
                    <span className="w-1/12 text-center ">{history.id}</span>
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
                ))}
            </div>

            {/* 페이지네이션 */}
            
            <Pagination>
                <PaginationContent>
                    {serverData.prev && (
                        <PaginationItem>
                            <PaginationPrevious 
                                href={`?page=${serverData.prevPage}&size=${size}${gamerid ? `&gamerid=${gamerid}` : ""}`}
                                onClick={(e) =>{
                                    e.preventDefault()
                                    moveToPage(serverData.prevPage)
                                } } />
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
