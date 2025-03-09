"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import HistoryChart from "./HistoryChart"
import HistoryList from "./HistoryList"
import RecentGameComponent from "./RecentGameComponent"
import { useHistoryRecord } from "./useHistoryRecord"

const HistoryContent = ({ userInfo }) => {
    const router = useRouter()
    const [selectedYear, setSelectedYear] = useState(null)
    const { record: userRecord, loading, error } = useHistoryRecord(userInfo?.id, selectedYear || null)

    return (
        <div>
            <div className="flex flex-row gap-12 rounded-md mt-2 max-w-6xl mx-auto border-1 bg-gray-300 min-h-96">
                {/* 왼쪽공간 */}
                <div className="m-1 basis-6/12 card border-black">
                    <div className="m-1">
                        <Button variant="secondary" className="text-white text-md">{userInfo.nickname}</Button>
                    </div>
                    <div className="font-bold text-2xl text-center">전 적 통 계</div>
                    <div className="flex justify-center">
                        <span className="mr-2 text-xl flex items-center font-bold">기간 : </span>
                        {/* 연도선택 */}
                        <span>
                            <Select onValueChange={(value) => setSelectedYear(value === "all" ? null : value)}>
                                <SelectTrigger className="w-[120px] ">
                                    <SelectValue placeholder="연도선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">전체</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2025">2025</SelectItem>
                                </SelectContent>
                            </Select>
                        </span>
                    </div>
                    {/* 차트와 통산전적 */}
                    <div className="flex p-2 space-x-4">
                        {/* 왼쪽 (차트) */}
                        <div className="w-1/2 flex justify-center items-center ml-10">
                            <HistoryChart win={userRecord.win} draw={userRecord.draw} lose={userRecord.lose} />
                        </div>
                        {/* 오른쪽 (통산전적) */}
                        <div className="w-1/2 flex flex-col justify-center items-center text-xl">
                            <h2 className="text-xl font-bold">게임 전적</h2>
                            <p className="text-gray-700 mt-2">Win :
                                <span className="text-green-500 font-semibold"> {userRecord.win}</span> 회
                            </p>
                            <p className="text-gray-700">Draw :
                                <span className="text-yellow-500 font-semibold"> {userRecord.draw}</span> 회
                            </p>
                            <p className="text-gray-700">Lose :
                                <span className="text-red-500 font-semibold"> {userRecord.lose}</span> 회
                            </p>
                            <p className="text-gray-700">승률 :
                                <span className="text-green-500 font-semibold"> {Math.floor(userRecord.win/(userRecord.win+userRecord.draw+userRecord.lose)*100)}</span> %
                            </p>
                        </div>
                    </div>
                    <div className="border border-black p-2">아래부분?여기에 뭘 넣을까??</div>
                </div>

                {/* 오른쪽공간 */}
                <div className="m-1 p-1 basis-6/12 card border-black" >
                    <Tabs defaultValue="game" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="mate">게임 메이트</TabsTrigger>
                            <TabsTrigger value="game">최근 플레이 게임</TabsTrigger>
                        </TabsList>
                        <TabsContent value="mate" className="m-1">
                            게임 메이트 공간
                        </TabsContent>
                        <TabsContent value="game" className="m-1">
                            {userInfo?.id ? (
                                <RecentGameComponent gamerid={userInfo.id} />
                            ) : (
                                <div className="p-4 shadow-md text-black">
                                    최근 플레이한 게임이 없습니다.
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div >
            {/* 사이공간 */}
            <div className="m-2 max-w-6xl mx-auto flex justify-end relative" >
                {/* 기록작성버튼 쿠키없으면 버튼 안보임*/}
                {userInfo ?
                    <Button variant="secondary" className="text-white text-md"
                        onClick={() => router.push('/history/new')}>
                        기록 작성
                    </Button>
                    : <></>}
            </div >
            {/* 아래공간 리스트 */}
            <div className=" max-w-6xl mx-auto bg-gray-300 rounded -mt-7" >
                <HistoryList userInfo={userInfo} selectedYear={selectedYear} />
            </div>
        </div>
    )
}
export default HistoryContent


