"use client"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import HistoryChart from "./HistoryChart"
import HistoryList from "./HistoryList"
import RecentGameComponent from "./RecentGameComponent"

const HistoryContent = ({ userInfo, serverData }) => {
    const router = useRouter()
    return (
        <>
            <div className="flex flex-row gap-12 rounded-md mt-2 max-w-6xl mx-auto border-1 bg-gray-300 min-h-96">
                {/* 왼쪽공간 */}
                <div className="m-1 basis-6/12 card border-black">
                    <div className="m-1">
                        <Button variant="secondary" className="text-white text-md">{userInfo.nickname}</Button>
                    </div>
                    <div>
                        <HistoryChart />
                    </div>
                </div>

                {/* 오른쪽공간 */}
                <div className="m-1 p-1 basis-6/12 card border-black">
                    <Tabs defaultValue="game" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="mate">게임 메이트</TabsTrigger>
                            <TabsTrigger value="game">최근 플레이 게임</TabsTrigger>
                        </TabsList>
                        <TabsContent value="mate" className="m-1">
                            게임 메이트 공간
                        </TabsContent>
                        <TabsContent value="game" className="m-1">
                            {serverData?.dtoList && serverData.dtoList.length > 0 ? (
                                <RecentGameComponent histories={serverData.dtoList} />
                            ) : (
                                <div className="p-4 border rounded shadow-md text-gray-500">
                                    최근 플레이한 게임이 없습니다.
                                </div>
                            )}
                        </TabsContent>

                    </Tabs>
                </div>
            </div>
            {/* 사이공간 */}
            <div className="m-2 max-w-6xl mx-auto flex justify-end relative">
                {/* 기록작성버튼 쿠키없으면 버튼 안보이게*/}
                {userInfo ?
                    <Button variant="secondary" className="text-white text-md"
                        onClick={() => router.push('/history/new')}>
                        기록 작성
                    </Button>
                    : <></>}

            </div>
            {/* 아래공간 */}
            <div className=" max-w-6xl mx-auto bg-gray-300 rounded -mt-7">
                <HistoryList />                
            </div>
        </>
    )
}
export default HistoryContent


