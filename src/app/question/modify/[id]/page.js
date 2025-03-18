"use client"

import BoardModifyEditor from "@/components/common/BoardModifyEditor"
import Top5 from "@/components/common/Top5"
import BasicMenu from "@/components/menus/BasicMenu"
import { Dices } from "lucide-react"
import { useParams } from "next/navigation"

const QuestionModifyPage = () => {
    const params = useParams()
    const id = params?.id
    return (
        <>
            <BasicMenu />
            <div className="p-1">
                {/* 최상단 게시판 이름 부분 */}
                <div className="mx-auto w-full max-w-6xl dark:text-white">
                    <div className="flex justify-center text-4xl py-1 font-semibold"
                        style={{ marginTop: '20px', backgroundColor: 'transparent', color: '#D97706', borderBottom: '2px solid #D97706' }}>
                        <Dices size={30} />질문 게시판
                    </div>
                </div>
                {/* 중단 조회수 추천수 부분 */}
                <div className="max-w-6xl mx-auto p-2 mt-2 rounded">
                    <Top5 boardType="question" />
                </div>
            </div>
            {/* 에디터 부분 */}
            <div className="max-w-6xl mx-auto p-2 bg-white rounded">
                <BoardModifyEditor id={id} boardType="question" />
            </div>
        </>
    )
}
export default QuestionModifyPage