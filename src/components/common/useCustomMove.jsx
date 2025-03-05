"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const useCustomMove = () => {
    const router = useRouter();
    const searchParams = useSearchParams();  // ✅ App Router에서 URL 파라미터 가져오는 방식
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return { moveToList: () => {}, moveToModify: () => {}, moveToRead: () => {} };
    }

    // ✅ URL에서 page와 size 값을 가져오기 (기본값: page=1, size=10)
    const getNum = (param, defaultValue) => {
        const value = searchParams.get(param);
        return value ? parseInt(value, 10) : defaultValue;
    };

    const pageNum = getNum("page", 1);
    const sizeNum = getNum("size", 10);

    const moveToList = (pageParam = {}) => {
        const page = pageParam.page ? pageParam.page : pageNum;
        const size = pageParam.size ? pageParam.size : sizeNum;

        router.replace(`?page=${page}&size=${size}`)
    };

    const moveToModify = (num) => {
        router.push(`/modify/${num}?page=${pageNum}&size=${sizeNum}`);
    };

    const moveToRead = (num) => {
        router.push(`/read/${num}?page=${pageNum}&size=${sizeNum}`);
    };

    return { moveToList, page: pageNum, size: sizeNum, moveToModify, moveToRead };
};

export default useCustomMove;
