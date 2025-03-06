"use client";
import { getList } from "@/api/history/historyApi";
import { API_SERVER_HOST } from "@/api/publicapi";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FetchingModal from "../common/FetchingModal";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

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

    const [serverData, setServerData] = useState(initState);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        setFetching(true);
        getList({ page, size }).then(data => {
            console.log(data);
            setServerData(data);
            setFetching(false);
        });
    }, [page, size]); // ✅ page 값이 변하면 자동으로 데이터 다시 불러오기

    // ✅ 페이지 이동 함수 (상태도 업데이트)
    const moveToPage = (newPage) => {
        setPage(newPage); // ✅ 상태를 업데이트하여 리렌더링 유도
        router.replace(`?page=${newPage}&size=${size}`,{scroll: false});
    };

    return (
        <div className="mt-10 mr-2 ml-2">
            {fetching ? <FetchingModal /> : null}

            {/* 히스토리 리스트 */}
            <div className="flex flex-col mx-auto p-6 space-y-4">
                {serverData.dtoList.map(history => (
                    <div key={history.id} 
                         className="flex items-center justify-between w-full p-2 border-b border-black ">
                    <span className="text-sm font-semibold text-gray-600">{history.id}</span>
                    <span className="text-sm text-gray-800">{history.title}</span>
                </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <Pagination>
                <PaginationContent>
                    {serverData.prev && (
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={() => moveToPage(serverData.prevPage)} />
                        </PaginationItem>
                    )}

                    {serverData.pageNumList.map(pageNum => (
                        <PaginationItem key={pageNum}>
                            <PaginationLink
                                href="#"
                                className={serverData.current === pageNum ? "bg-gray-500 text-white" : ""}
                                onClick={() => moveToPage(pageNum)}
                            >
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {serverData.next && (
                        <PaginationItem>
                            <PaginationNext href="#" onClick={() => moveToPage(serverData.nextPage)} />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default HistoryList;
