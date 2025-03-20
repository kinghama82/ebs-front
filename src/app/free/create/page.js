"use client"
import BoardEditor from "@/components/common/BoardEditor";
import Top5 from "@/components/common/Top5";
import BasicMenu from "@/components/menus/BasicMenu";
import { Dices } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NewFreePage = () => {
    const router = useRouter()
    const [content, setContent] = useState("")

    const handleUpdate = (htmlContent) => {
        setContent(htmlContent);
        console.log('현재 내용:', htmlContent);
    };
    return (
        <>
            <BasicMenu />
            {/* 최상단 게시판 이름 부분 */}
            <div className="mx-auto w-full max-w-6xl">
                <div className="flex justify-center text-4xl py-1 font-semibold"
                    style={{ marginTop: '20px', backgroundColor: 'transparent', color: '#D97706', borderBottom: '2px solid #D97706' }}>
                    <Dices size={30} />자유 게시판
                </div>
            </div>
            {/* 중단 조회수 추천수 부분 */}
            <div className="max-w-6xl mx-auto p-2 mt-2 rounded">
                <Top5 boardType="free" />
            </div>

            {/* 중단 게시글 작성 부분 */}
            <div className="container max-w-6xl mx-auto bg-neutral-200 mt-2 border-b-2 border-t-2 border-amber-600">
                {/* 에디터부분 */}
                <div className="max-w-6xl mx-auto">
                    <BoardEditor boardType="free" />
                </div>
            </div>
        </>
    )
}
export default NewFreePage;