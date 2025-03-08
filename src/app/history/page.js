"use client"

import { getList } from "@/api/history/historyApi";
import { useCustomCookie } from "@/components/common/useCustomCookie";
import HistoryContent from "@/components/history/HistoryContent";
import BasicMenu from "@/components/menus/BasicMenu";
import { Suspense, useEffect, useState } from "react";


const HistoryPage = () => {
    const [serverData, setServerData] = useState(null);
    const [fetching, setFetching] = useState(false);
    const page = 1; // 기본 페이지 값
    const size = 10; // 기본 사이즈 값
    const userInfo = useCustomCookie()

    useEffect(() => {
        if (!userInfo || !userInfo.id) return

        setFetching(true);
        getList({ page, size, gamerid: userInfo.id })
            .then(data => {
                setServerData(data);
                setFetching(false);
            })
            .catch(() => setFetching(false));
    }, [userInfo]);

    return (<>
        <BasicMenu />
        {/* userInfo가 없으면 로딩 메시지 표시 */}
        {!userInfo ? (
            <div className="text-center p-4">사용자 정보를 불러오는 중...</div>
        ) : (
            <Suspense fallback={<div className="text-center p-4">히스토리를 불러오는 중...</div>}>
                <HistoryContent userInfo={userInfo} serverData={serverData} />
            </Suspense>
        )}





    </>);
}
export default HistoryPage;

