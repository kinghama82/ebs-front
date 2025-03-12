"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { getFreeList } from "@/api/free/freeapi";
import { Button } from "../ui/button";
import Link from "next/link";

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

const FreeList = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const [serverData, setServerData] = useState(initState)
    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1)
    const size = parseInt(searchParams.get("size")) || 10
    const [free, setFree] = useState([])   

    useEffect(() => {
        getFreeList({page, size}).then(data => {
            console.log("현재 자유게시판 데이터 : ", data)
            setServerData(data)
        })
    },[page, size])



    //글번호 변경(id값 말고)
    const startNumber = serverData.totalCount - (page - 1) * size;

    //페이지 이동 함수 (상태도 업데이트)
    const moveToPage = (newPage) => {
        setPage(newPage);
        router.replace(`?page=${newPage}&size=${size}`, { scroll: false });
    };

    return (
        <div>
            {/* 자유 리스트 */}
            <div className="flex flex-col mx-auto space-y-2">
                <div className="flex items-center justify-between w-full p-2 border-b border-black">
                    <span className="w-1/12  text-center font-bold border border-black">글번호</span>
                    <span className="w-5/12  text-center font-bold border border-black">제 목</span>
                    <span className="w-2/12  text-center font-bold border border-black">작 성 자</span>
                    <span className="w-2/12  text-center font-bold border border-black" >기 록 일</span>
                </div>
                {serverData.dtoList.length > 0 ? (
                    serverData.dtoList.map((free, index) => (
                        console.log("현재 free : ", free),
                        <div key={free.id}
                            className="flex items-center justify-between w-full p-2 border-b border-black ">
                            <span className="w-1/12 text-center ">{startNumber - index}</span>
                            <span className="w-5/12 text-center " >
                                <Link href={`/free/read/${free.id}`}>{free.title}</Link>
                            </span> 
                            <span className="w-2/12 text-center ">{free.gamernickname}</span>                           
                            <span className="w-2/12 text-center ">{free.createdate}</span>
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
                            <PaginationPrevious
                                href={`?page=${serverData.prevPage}&size=${size}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    moveToPage(serverData.prevPage)
                                }} />
                        </PaginationItem>
                    )}

                    {serverData.pageNumList.map(pageNum => (
                        <PaginationItem key={pageNum}>
                            <PaginationLink
                                href={`?page=${pageNum}&size=${size}`}
                                className={serverData.current === pageNum ? "bg-gray-500 text-black text-lg font-bold" : ""}
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
                                href={`?page=${serverData.nextPage}&size=${size}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    moveToPage(serverData.nextPage)
                                }} />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
            <div>
                <Button variant="mocha" onClick={() => router.push('/free/new')} >글 작성</Button>
            </div>
        </div>
    )
}
export default FreeList