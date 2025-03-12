import FreeList from "@/components/free/FreeList";
import BasicMenu from "@/components/menus/BasicMenu";
import ToolButton from "@/components/menus/ToolButton";
import { Dices } from "lucide-react";

const freePage = () => {
  return (
    <>
      <BasicMenu />
      {/* 최상단 게시판 이름 부분 */}
      <div className="mx-auto w-full max-w-6xl dark:text-white">
            <div className="flex justify-center text-4xl py-1" 
                 style={{ marginTop: '20px', backgroundColor: 'transparent', color: '#D97706', borderBottom: '2px solid #D97706' }}>
                <Dices size={30}/>자유 게시판
            </div>
      </div>

      {/* 중단 조회수 / 추천수 부분 */}
      <div className="container max-w-6xl mx-auto p-4 border-black border bg-gray-400 mt-2 rounded">
        <div >조회수 / 추천수 공간</div>
      </div>

      {/* 하단 리스트 부분 */}
      <div className="container max-w-6xl mx-auto border border-black mt-2 rounded">
            <FreeList/>
      </div>
    </>
  );
}
export default freePage;