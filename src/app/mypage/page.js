import BasicMenu from "@/components/menus/BasicMenu";

const myPage = () => {
    return (
    
    <div>
        <BasicMenu></BasicMenu>
        <div className="w-full max-w-5xl mx-auto"> {/* 부모 div에 공백 및 최대 너비 설정 */}
                <h1 className="mt-4 text-4xl font-bold text-center">마이 페이지</h1>

                <div className="bg-white my-5 w-full flex flex-col md:flex-row md:space-x-10 justify-between">
                    {/* main과 aside의 너비를 BasicMenu의 너비(max-w-5xl)로 맞춤 */}
                    <main className="bg-slate-200 w-full px-10 py-40 rounded-lg"></main>
                    
                    {/* main과 동일한 너비로 설정 */}
                    <aside className="bg-slate-200 w-full px-10 py-40 rounded-lg"></aside>
            </div>

                            {/* main과 aside 사이에 버튼을 추가 */}
                            <div className="flex justify-start space-x-4 my-1">
                    <button className="bg-orange-100 text-black font-bold px-4 py-2 rounded-md mt-2 ">내글보기</button>
                    <button className="bg-orange-100 text-black font-bold px-4 py-2 rounded-md mt-2 ">전적통계</button>
                </div>


            <div className="bg-slate-200 w-full h-[160px] md:h-[320px]"></div>

         </div>
    </div>
    );
}
    export default myPage;