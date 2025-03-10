"use client";
import BasicMenu from "@/components/menus/BasicMenu";
import { useCustomCookie } from "@/components/common/useCustomCookie";
import { useEffect, useState } from "react";
import { getRecentGames, getTotalRecord } from "@/api/history/historyApi";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import HistoryChart from "@/components/history/HistoryChart";
import Link from "next/link"; // ✅ 게임 기록 API 추가

const MyPage = () => {
    const user = useCustomCookie();
    const [selectedTab, setSelectedTab] = useState("friends");

    // ✅ 최근 플레이한 게임 & 전적 데이터
    const [recentGames, setRecentGames] = useState([]);
    const [record, setRecord] = useState({ win: 0, draw: 0, lose: 0 });

    useEffect(() => {
        if (!user || !user.id) return;

        // ✅ 최근 플레이 게임 가져오기
        getRecentGames(user.id).then((data) => {
            setRecentGames(data);
        });

        // ✅ 승무패 전적 가져오기
        getTotalRecord(user.id).then((data) => {
            setRecord(data);
        });

    }, [user]);

    return (
        <div>
            <BasicMenu />
            <div className="w-full max-w-6xl mx-auto">
                <h1 className="mt-4 text-4xl font-bold text-center">마이 페이지</h1>

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

                    {/* 친구목록 & 북마크 */}
                    <aside className="bg-slate-200 w-full px-10 py-10 rounded-lg">
                        <div className="btn-group flex justify-center space-x-4">
                            <button
                                className={`px-4 py-2 rounded-lg border ${
                                    selectedTab === "friends" ? "bg-[#d5ba98] text-black" : "bg-transparent text-[#d5ba98]"
                                }`}
                                onClick={() => setSelectedTab("friends")}
                            >
                                친구목록
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg border ${
                                    selectedTab === "bookmarks" ? "bg-[#d5ba98] text-black" : "bg-transparent text-[#d5ba98]"
                                }`}
                                onClick={() => setSelectedTab("bookmarks")}
                            >
                                게임 북마크
                            </button>
                        </div>

                        {selectedTab === "friends" ? (
                            <div className="mt-6">
                                <p className="text-center">친구목록 들어갈 자리.</p>
                            </div>
                        ) : (
                            <div className="mt-6">
                                <p className="text-center">북마크한 게임 목록</p>
                            </div>
                        )}
                    </aside>
                </div>



                <div className="flex justify-start space-x-4 my-2">
                    <button className=
                        {`bg-orange-100 text-black font-bold px-4 py-2 rounded-md mt-2 border ${
                        selectedTab === "myletter" ? "bg-[#d5ba98] text-black" : "bg-transparent text-[#d5ba98]"
                    }`}
                        onClick={() => setSelectedTab("friends")}
                        >
                        내글보기
                    </button>
                    <button className="bg-orange-100 text-black font-bold px-4 py-2 rounded-md mt-2 ">
                        전적통계
                    </button>
                </div>



                <div className="bg-slate-200 w-full h-[160px] md:h-[400px]">
                    {selectedTab === "friends" ? (
                        <div className="mt-6">
                            <div className="flex flex-row gap-12 rounded-md mt-6 max-w-6xl mx-auto border-1 bg-gray-300 min-h-96">
                                {/* 왼쪽공간 */}
                                <div className="m-1 basis-6/12 card border-black dark:border-white dark:bg-[#0a0b0c]">

                                    <div className="font-bold text-2xl text-center dark:text-white">전 적 통 계</div>

                                    {/* 차트와 통산전적 */}
                                    <div className="flex p-2 space-x-4">
                                        {/* 왼쪽 (차트) */}
                                        <div className="w-1/2 flex justify-center items-center ml-10">
                                            <HistoryChart win={record.win} draw={record.draw} lose={record.lose} />
                                        </div>
                                        {/* 오른쪽 (통산전적) */}
                                        <div className="w-1/2 flex flex-col justify-center items-center text-xl">
                                            <h2 className="text-xl font-bold dark:text-white">게임 전적</h2>
                                            <p className="text-gray-700 mt-2 font-bold dark:text-white">Win :
                                                <span className="text-green-500 font-semibold"> {record.win}</span> 회
                                            </p>
                                            <p className="text-gray-700 font-bold dark:text-white">Draw :
                                                <span className="text-yellow-500 font-semibold"> {record.draw}</span> 회
                                            </p>
                                            <p className="text-gray-700 font-bold dark:text-white">Lose :
                                                <span className="text-red-500 font-semibold"> {record.lose}</span> 회
                                            </p>
                                            <p className="text-gray-700 mt-3 font-bold dark:text-white">승률 :
                                                <span className="text-green-500 font-semibold">
                                        {((record.win / (record.win + record.draw + record.lose || 1)) * 100).toFixed(1)}
                                    </span> %
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-2 text-center font-bold dark:text-white">
                                        게임하다 배고플땐? <Link className="text-blue-500" href="#">한식 끝판왕!</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <p className="text-center">북마크한 게임 목록</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyPage;
