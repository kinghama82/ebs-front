"use client";

import Top5 from "@/components/common/Top5";
import NewsList from "@/components/news/NewsList";
import { Dices } from "lucide-react";
import { Suspense } from "react";

const NewsPage = () => {
    

    return (
        <>
            {/* 최상단 게시판 이름 부분 */}
            <div className="mx-auto w-full max-w-6xl dark:text-white">
                <div className="flex justify-center text-4xl py-1"
                    style={{ marginTop: '20px', backgroundColor: 'transparent', color: '#D97706', borderBottom: '2px solid #D97706' }}>
                    <Dices size={30} />뉴스 게시판
                </div>
            </div>

            {/* 중단 조회수 / 추천수 부분 */}
            <div className="max-w-6xl mx-auto p-3 border-b-2 border-amber-600">
                <div >
                    <Top5 boardType="news" />
                </div>
            </div>

            {/* 하단 리스트 부분 */}
            <div className="max-w-6xl mx-auto mt-2 rounded">
                <Suspense fallback={<div>로딩 중...</div>}>
                    <NewsList boardType="news" />
                </Suspense>
            </div>
        </>
    );
};

export default NewsPage;
