import BasicMenu from "@/components/menus/BasicMenu";
import ToolButton from "@/components/menus/ToolButton";

const freePage = () => {
  return (
    <>
      <BasicMenu />
      <div className="container max-w-6xl mx-auto p-4 border-black border bg-gray-400 mt-2 rounded">
        <h1>조회수 / 추천수 공간</h1>
      </div>
      <div className="container max-w-6xl mx-auto p-4 border-black border bg-gray-400 mt-2 rounded">
        <h1>자유게시판 공간</h1>
        <div>페이지네이션</div>
      </div>
      <ToolButton/>
    </>
  );
}
export default freePage;