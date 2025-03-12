import BasicMenu from "@/components/menus/BasicMenu";
import { Dices } from "lucide-react";

const FreeReadPage = () => {
    return (
        <>
            <BasicMenu />
            <div>
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
                <div className="bg-gray-400 max-w-6xl mx-auto p-2 mt-2 border-b-2 border-t-2 border-amber-600">
                    <div>작성자 / 작성일 / 조회수 / 추천 수</div>
                    <div>카테고리 / 목록+댓글버튼 </div>
                    <div>제목</div>
                    <div>내용</div>
                    <div>추천버튼</div>
                    <div>목록 + 댓글</div>
                    <div>주소복사버튼 + 현재주소</div>
                    <div>목록버튼 + 글쓰기버튼 </div>

                    
                </div>

                {/* 댓글리스트부분 */}
                <div className="max-w-6xl mx-auto p-2">댓글부분</div>
            </div>
        </>
    )
}
export default FreeReadPage;