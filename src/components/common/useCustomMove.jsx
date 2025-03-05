"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const useCustomMove = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    // 클라이언트에서만 useRouter를 사용하도록 설정
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // 클라이언트에서만 useRouter 사용
        return { moveToList: () => {}, moveToModify: () => {}, moveToRead: () => {} };
    }

    const [refresh, setRefresh] = useState(false);
    const { page, size } = router.query;

    const pageNum = getNum(page, 1);
    const sizeNum = getNum(size, 10);

    const queryDefault = {
        page: pageNum,
        size: sizeNum,
    };

    const moveToList = (pageParam) => {
        let queryStr = queryDefault;

        if (pageParam) {
            const pageNum = getNum(pageParam.page, 1);
            const sizeNum = getNum(pageParam.size, 10);
            queryStr = { page: pageNum, size: sizeNum };
        }

        setRefresh(!refresh);
        router.push({
            pathname: '/list',
            query: queryStr,
        });
    };

    const moveToModify = (num) => {
        console.log(queryDefault);
        router.push({
            pathname: `/modify/${num}`,
            query: queryDefault,
        });
    };

    const moveToRead = (num) => {
        console.log(queryDefault);
        router.push({
            pathname: `/read/${num}`,
            query: queryDefault,
        });
    };

    return { moveToList, page: pageNum, size: sizeNum, moveToModify, refresh, moveToRead };
};

export default useCustomMove;
