"use client"
import BasicMenu from "@/components/menus/BasicMenu";
import { Button } from "@/components/ui/button";
import { Dices } from "lucide-react";
import { useRouter } from "next/navigation";

const NewFreePage = () => {
    const router = useRouter()
    return (
        <>
        <BasicMenu />
        {/* 최상단 게시판 이름 부분 */}
        <div className="mx-auto w-full max-w-6xl dark:text-white">
            <div className="flex justify-center text-4xl py-1"
                 style={{ marginTop: '20px', backgroundColor: 'transparent', color: '#D97706', borderBottom: '2px solid #D97706' }}>
                 <Dices size={30} />자유 게시판
            </div>
        </div>

        {/* 중단 게시글 작성 부분 */}
        <div className="container max-w-6xl mx-auto p-4 border-black border bg-gray-400 mt-2 rounded">
            <div className="border-[#D97706] border-b-2">게시글 작성 부분</div>
            <div className="justify-between">
                <div className="mt-2">
                    <Button variant="mocha" onClick={() => router.push('/free')}>목 록</Button>
                </div>
                <div className="flex justify-end -mt-9">
                    <Button variant="mocha">등 록</Button>     
                </div>
            </div>
            
        </div>
        
        </>
    )
}
export default NewFreePage;