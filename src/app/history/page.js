"use client"

import { getList } from "@/api/history/historyApi";
import HistoryChart from "@/components/history/HistoryChart";
import HistoryList from "@/components/history/HistoryList";
import RecentGameComponent from "@/components/history/RecentGameComponent";
import BasicMenu from "@/components/menus/BasicMenu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

const HistoryPage = () => {
    const [serverData, setServerData] = useState(null);
    const [fetching, setFetching] = useState(false);
    const page = 1; // 기본 페이지 값
    const size = 10; // 기본 사이즈 값

    useEffect(() => {
        setFetching(true);
        getList({ page, size })
            .then(data => {
                setServerData(data);
                setFetching(false);
            })
            .catch(() => setFetching(false));
    }, []);


    return (<>
        <BasicMenu />

        <div className="flex flex-row gap-12 rounded-md mt-2 max-w-6xl mx-auto border-1 bg-gray-300 min-h-96">
            {/* 왼쪽공간 */}
            <div className="m-1 basis-6/12 card border-black">
                <div className="m-1">
                    <Button>닉네임출력부분</Button>
                </div>
                <div>
                    <HistoryChart />
                </div>
            </div>

            {/* 오른쪽공간 */}
            <div className="m-1 p-1 basis-6/12 card border-black">
                <Tabs defaultValue="account" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="account">게임 메이트</TabsTrigger>
                        <TabsTrigger value="password">최근 플레이 게임</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account" className="m-1">
                        게임 메이트 공간
                    </TabsContent>
                    <TabsContent value="password" className="m-1">
                        <RecentGameComponent histories={serverData?.dtoList || []}/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
        {/* 사이공간 */}
        <div className="m-2 max-w-6xl mx-auto flex justify-end relative">
            <Button variant="secondary" className="text-white text-md">
                <Link href={`/history/new`}>기록 작성</Link>
            </Button>
        </div>
        {/* 아래공간 */}
        <div className=" max-w-6xl mx-auto bg-gray-300 rounded -mt-7">
            <Suspense fallback={<div>Loading...</div>}>
                <HistoryList />
            </Suspense>
        </div>




    </>);
}
export default HistoryPage;

