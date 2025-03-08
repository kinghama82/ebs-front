"use client"

import { getList } from "@/api/history/historyApi";
import HistoryChart from "@/components/history/HistoryChart";
import HistoryList from "@/components/history/HistoryList";
import RecentGameComponent from "@/components/history/RecentGameComponent";
import BasicMenu from "@/components/menus/BasicMenu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Cookies from "js-cookie";
import jwtDecode from "jsonwebtoken";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const HistoryPage = () => {
    const [serverData, setServerData] = useState(null);
    const [fetching, setFetching] = useState(false);
    const page = 1; // 기본 페이지 값
    const size = 10; // 기본 사이즈 값
    const [userInfo, setUserInfo] = useState("")
    const router = useRouter()

    useEffect(() => {
        setFetching(true);
        getList({ page, size })
            .then(data => {
                setServerData(data);
                setFetching(false);
            })
            .catch(() => setFetching(false));
    }, []);

    useEffect(() => {
        // 1. 쿠키에서 gamerCooki(JWT) 가져오기
        const token = Cookies.get("gamerCooki");
        if (token) {
          try {
            const decoded = jwtDecode.decode(token); // JWT 디코딩
            if (decoded && decoded.nickname) {
              setUserInfo(decoded) //유저정보저장
            }
          } catch (error) {
            console.error("JWT 디코딩 오류:", error);
          }
        }
      }, []);


    return (<>
        <BasicMenu />

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
                        <RecentGameComponent histories={serverData?.dtoList || []}/>                                               
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
            <Suspense fallback={<div>Loading...</div>}>
                <HistoryList />
            </Suspense>
        </div>




    </>);
}
export default HistoryPage;

