"use client"
import CopyUrlButton from "@/components/common/CopyUrlButton";
import { useCustomCookie } from "@/components/common/useCustomCookie";
import BasicMenu from "@/components/menus/BasicMenu";
import { Button } from "@/components/ui/button";
import { Dices } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initState = {
    title: '',
    content: '',
    gamer: '',
    date: '',
    voter: [],
    answerList: []
}

const FreeReadPage = () => {
    const router = useRouter()
    const [copied, setCopied] = useState(false);
    const userInfo = useCustomCookie()
    const [free, setFree] = useState(initState)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // 2초 후 "복사됨" 문구 숨기기
        } catch (err) {
            console.error("URL 복사 실패:", err);
        }
    };
    return (
        <>
            <BasicMenu />
            <div className="p-1">
                {/* 최상단 게시판 이름 부분 */}
                <div className="mx-auto w-full max-w-6xl dark:text-white">
                    <div className="flex justify-center text-4xl py-1"
                        style={{ marginTop: '20px', backgroundColor: 'transparent', color: '#D97706', borderBottom: '2px solid #D97706' }}>
                        <Dices size={30} />자유 게시판
                    </div>
                </div>

                {/* 중단 조회수 추천수 부분 */}
                <div className="bg-gray-400 max-w-6xl mx-auto p-2 mt-2 rounded">
                    중단 조회수 부분
                </div>

                {/* 하단 상세페이지 부분 */}
                <div className="max-w-6xl mx-auto p-2 mt-2 border-b-2 border-t-2 border-amber-600">
                    {/* 헤드부분 */}
                    <div className="border-b-2 border-amber-600 justify-between p-1 flex font-bold" >
                        <span className="w-1/12">작성자 : </span>
                        <span className="w-2/12 text-center">작성일</span>
                        <div>
                            <span className="w-2/12 text-end mr-8">조회 : </span>
                            <span className="w-2/12 text-end mr-4">추천 :</span>
                        </div>
                    </div>
                    {/* 헤드 및 카테고리 목록 / 댓글 링크 */}
                    <div className="grid grid-cols-4 p-1 font-bold">
                        <span className="col-span-3">카테고리</span>
                        <div className="grid grid-cols-2">
                            <span/>
                            <div className="grid grid-cols-3">
                                <span className="col-span-2 text-end"><Link href={'/free'}>목록 |</Link></span>
                                <span className="text-center">댓글</span>
                            </div>
                        </div>
                    </div>
                    {/* 제목 내용 */}
                    <div className="p-1">
                        <div className="text-3xl font-bold">제목</div>
                        <div>내용</div>
                    </div>

                    <div className="text-center"><Button variant="outline">추천버튼</Button></div>
                    <div className="grid grid-cols-6 font-bold border-b-2 border-amber-600">
                        <div className="grid grid-cols-4 flex items-center">
                            <div className=""><Link href={'/free'}>목록 | </Link></div>
                            <div>댓글</div>
                        </div>
                        <div className="col-span-4"></div>
                        <div className="flex justify-end gap-2 mb-1">
                            <Button size="sm" className="font-bold">수정</Button>
                            <Button variant="destructive" size="sm" className="font-bold">삭제</Button>
                        </div>
                    </div>
                    <div className="mt-1">
                        <CopyUrlButton url={window.location.href}/>
                        {window.location.href}
                    </div>
                </div>

                {/* 댓글리스트부분 */}
                <div className="max-w-6xl mx-auto p-2 bg-gray-400 mt-1">댓글부분</div>
            </div>
        </>
    )
}
export default FreeReadPage;