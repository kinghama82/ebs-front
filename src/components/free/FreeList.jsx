"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { getFreeList } from "@/api/free/freeapi";
import { Button } from "../ui/button";
import Link from "next/link";
import axios from "axios";
import { API_SERVER_HOST } from "@/api/publicapi";

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

const FreeList = ({ boardType }) => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const [serverData, setServerData] = useState(initState)
    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1)
    const size = parseInt(searchParams.get("size")) || 10

    useEffect(() => {
        let isMounted = true;
    
        getFreeList({ page, size }).then(data => {
            if (isMounted) {
                console.log("📡 서버에서 받은 데이터: ", data);
                
                setServerData(prevData => {
                    // ✅ 데이터가 변경되지 않았다면 setState 실행 안 함
                    if (JSON.stringify(prevData) === JSON.stringify(data)) {
                        return prevData;
                    }
                    return data;
                });
            }
        });
    
        return () => {
            isMounted = false; // ✅ 언마운트 시 요청 방지
        };
    }, [page, size]);
    


    const handlePlusView = async (id, router) => {
        try {
            await axios.get(`${API_SERVER_HOST}/api/${boardType}/${id}/view`)
        } catch (error) {
            console.error("조회수 증가 실패 : ", error)
        }
        router.push(`/${boardType}/read/${id}`)
    }

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
            return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식 유지
        }
    };

    //글번호 변경(id값 말고)
    const startNumber = serverData.totalCount - ((page - 1) * size);

    //페이지 이동 함수 (상태도 업데이트)
    const moveToPage = (newPage) => {
        setPage(newPage);
        router.replace(`?page=${newPage}&size=${size}`, { scroll: false });
    };

    return (
        <div>
            {/* 자유 리스트 */}
            <div className="flex flex-col space-y-2 mb-2 ">
                <div className="flex items-center justify-between w-full p-2 bg-[#AD927A]">
                    <span className="w-1/12  text-center font-bold ">번 호</span>
                    <span className="w-5/12  text-center font-bold ">제 목</span>
                    <span className="w-2/12  text-center font-bold ">작성자</span>
                    <span className="w-1/12  text-center font-bold ">등록일</span>
                    <span className="w-1/12  text-center font-bold ">조회</span>
                    <span className="w-1/12  text-center font-bold ">추천</span>
                </div>
                {serverData.dtoList.length > 0 ? (
                    serverData.dtoList.map((free, index) => (
                        <div key={free.id}
                            className="flex items-center justify-between w-full p-2 border-b border-black ">
                            <span className="w-1/12 text-center ">{startNumber - index}</span>
                            <span className="w-5/12 text-center " >
                                <Link href={`/${boardType}/read/${free.id}`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePlusView(free.id, router)
                                    }}>{free.title}
                                    <span className="w-1/12 text-center ml-1 ">
                                        [{free.answerList ? free.answerList.length : 0}]
                                    </span>
                                </Link>
                            </span>
                            <span className="w-2/12 text-center ">{free.gamer.nickname}</span>
                            <span className="w-1/12 text-center ">{formatDate(free.createdate)}</span>
                            <span className="w-1/12 text-center ">{free.view}</span>
                            <span className="w-1/12 text-center ">{free.voter.length}</span>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-4">게시글이 없습니다</div>
                )}
            </div>

            {/* 페이지네이션 */}
            <Pagination>
                <PaginationContent>
                    {serverData.prev && (
                        <PaginationItem>
                            <PaginationPrevious href={`?page=${serverData.prevPage}&size=${size}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    moveToPage(serverData.prevPage)
                                }} />
                        </PaginationItem>
                    )}

                    {serverData.pageNumList.map(pageNum => (
                        <PaginationItem key={pageNum}>
                            <PaginationLink href={`?page=${pageNum}&size=${size}`}
                                className={serverData.current === pageNum ? " hover:bg-[#8C7A65] border border-black text-black text-lg font-bold" : ""}
                                onClick={(e) => {
                                    e.preventDefault()
                                    moveToPage(pageNum)
                                }}>
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {serverData.next && (
                        <PaginationItem>
                            <PaginationNext href={`?page=${serverData.nextPage}&size=${size}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    moveToPage(serverData.nextPage)
                                }} />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
            <div>
                <Button variant="mocha" onClick={() => router.push(`/${boardType}/create`)} >글 작성</Button>
            </div>
        </div>
    )
}
export default FreeList