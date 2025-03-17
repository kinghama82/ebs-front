"use client";

import BoardEditor from "@/components/common/BoardEditor";
import Top5 from "@/components/common/Top5";
import BasicMenu from "@/components/menus/BasicMenu";
import { Dices } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const extractYouTubeURL = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const iframe = doc.querySelector("iframe");

    console.log("Extracting YouTube URL from:", htmlContent); // ✅ 디버깅
    console.log("Found iframe:", iframe); // ✅ 디버깅
    console.log("Extracted URL:", iframe ? iframe.getAttribute("src") : "None"); // ✅ 디버깅

    return iframe ? iframe.getAttribute("src") : null;
};

const NewNewsPage = () => {
     const router = useRouter()
        const [content, setContent] = useState("")
    
        const handleUpdate = (htmlContent) => {
            setContent(htmlContent);
            console.log('현재 내용:', htmlContent);
        };
    return (
        <>
            {/* 최상단 게시판 이름 부분 */}
            <div className="mx-auto w-full max-w-6xl">
                <div className="flex justify-center text-4xl py-1"
                    style={{ marginTop: '20px', backgroundColor: 'transparent', color: '#D97706', borderBottom: '2px solid #D97706' }}>
                    <Dices size={30} />뉴스 게시판
                </div>
            </div>
            {/* 중단 조회수 추천수 부분 */}
            <div className="max-w-6xl mx-auto p-2 mt-2 rounded">
                <Top5 boardType="news" />
            </div>

            {/* 중단 게시글 작성 부분 */}
            <div className="container max-w-6xl mx-auto bg-neutral-200 mt-2 border-b-2 border-t-2 border-amber-600">
                {/* 에디터부분 */}
                <div>
                    <BoardEditor boardType="news" />
                </div>
            </div>
        </>
    )
}
export default NewNewsPage
