"use client";
import BasicMenu from "@/components/menus/BasicMenu";
import { useCustomCookie } from "@/components/common/useCustomCookie";
import { useEffect, useState } from "react";
import { getTotalRecord } from "@/api/history/historyApi";
import HistoryChart from "@/components/history/HistoryChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendsList from "@/components/friends/FriendsList";
import GameBookmarks from "@/components/bookmarks/GameBookmarks";

const MyPage = () => {
    const user = useCustomCookie();
    const [selectedStatsTab, setSelectedStatsTab] = useState("stats");
    const [record, setRecord] = useState({ win: 0, draw: 0, lose: 0 });

    useEffect(() => {
        if (!user || !user.id) return;

        // 전적 데이터 가져오기
        getTotalRecord(user.id)
            .then(recordResponse => setRecord(recordResponse))
            .catch(error => console.error("전적 데이터 불러오기 실패:", error));
    }, [user]);

    return (
        <div>
            <BasicMenu />
            <div className="w-full max-w-6xl mx-auto">
                <h1 className="mt-4 text-4xl font-bold text-center">마이 페이지</h1>

                {/* 프로필 & 탭 영역 */}
                <div className="bg-white my-2 w-full flex flex-col md:flex-row md:space-x-12 justify-between">

                    {/* 유저 정보 */}
                    <main className="bg-slate-200 w-full px-10 py-10 rounded-lg">
                        {user ? (
                            <div>
                                <img
                                    src="allIcon.png"
                                    alt="프로필 이미지"
                                    className="w-32 h-32 rounded-full mx-auto"
                                />
                                <h2 className="text-center text-2xl font-semibold mt-4">{user.nickname}</h2>
                                <p className="text-center text-gray-600">{user.email}</p>

                                <div className="mt-6 space-y-2 text-left">
                                    <p><strong>이름:</strong> {user.name}</p>
                                    <p><strong>전화번호:</strong> {user.phone}</p>
                                    <p><strong>주소:</strong> {user.address}</p>
                                    <p><strong>가입일:</strong> {new Date(user.createdate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-lg">로그인이 필요합니다.</p>
                        )}
                    </main>

                    {/* 친구 목록 & 게임 북마크 */}
                    <aside className="bg-slate-200 w-full px-10 py-10 rounded-lg">
                        <Tabs defaultValue="mate" className="w-full dark:bg-[#0a0b0c]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="mate">친구목록</TabsTrigger>
                                <TabsTrigger value="game">게임북마크</TabsTrigger>
                            </TabsList>
                            <TabsContent value="mate">
                                <FriendsList userId={user?.id} />
                            </TabsContent>
                            <TabsContent value="game">
                                <GameBookmarks userId={user?.id} />
                            </TabsContent>
                        </Tabs>
                    </aside>
                </div>

                {/* 내 글 / 전적통계 */}
                <div className="flex justify-start space-x-4 my-2">
                    <button
                        className={`bg-orange-100 text-black font-bold px-4 py-2 rounded-md mt-2 border ${
                            selectedStatsTab === "myletter" ? "bg-[#d5ba98] text-black" : "bg-transparent text-[#d5ba98]"
                        }`}
                        onClick={() => setSelectedStatsTab("myletter")}
                    >
                        내가 쓴 글
                    </button>
                    <button
                        className={`bg-orange-100 text-black font-bold px-4 py-2 rounded-md mt-2 border ${
                            selectedStatsTab === "stats" ? "bg-[#d5ba98] text-black" : "bg-transparent text-[#d5ba98]"
                        }`}
                        onClick={() => setSelectedStatsTab("stats")}
                    >
                        전적 통계
                    </button>
                </div>

                {/* 전적 통계 표시 */}
                {selectedStatsTab === "stats" ? (
                    <div className="bg-slate-200 w-full h-[160px] md:h-[400px]">
                        <div className="flex flex-row gap-12 rounded-md mt-6 max-w-6xl mx-auto border-1 bg-gray-300 min-h-96">
                            <div className="m-1 basis-6/12 card border-black dark:border-white dark:bg-[#0a0b0c]">
                                <div className="font-bold text-2xl text-center dark:text-white">전 적 통 계</div>
                                <div className="flex p-2 space-x-4">
                                    <div className="w-1/2 flex justify-center items-center ml-10">
                                        <HistoryChart win={record.win} draw={record.draw} lose={record.lose} />
                                    </div>
                                    <div className="w-1/2 flex flex-col justify-center items-center text-xl">
                                        <h2 className="text-xl font-bold dark:text-white">게임 전적</h2>
                                        <p className="text-gray-700 mt-2 font-bold dark:text-white">
                                            Win : <span className="text-green-500 font-semibold"> {record.win}</span> 회
                                        </p>
                                        <p className="text-gray-700 font-bold dark:text-white">
                                            Draw : <span className="text-yellow-500 font-semibold"> {record.draw}</span> 회
                                        </p>
                                        <p className="text-gray-700 font-bold dark:text-white">
                                            Lose : <span className="text-red-500 font-semibold"> {record.lose}</span> 회
                                        </p>
                                        <p className="text-gray-700 mt-3 font-bold dark:text-white">
                                            승률 :{" "}
                                            <span className="text-green-500 font-semibold">
                                                {record.win + record.draw + record.lose > 0
                                                    ? ((record.win / (record.win + record.draw + record.lose)) * 100).toFixed(1)
                                                    : 0}
                                            </span>{" "}
                                            %
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>내가 쓴 글 목록</div>
                )}
            </div>
        </div>
    );
};

export default MyPage;
