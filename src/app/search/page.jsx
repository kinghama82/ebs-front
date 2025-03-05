"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { searchGames } from "@/api/game/gameapi";

const SearchResults = () => {
    const searchParams = useSearchParams();
    const keyword = searchParams.get("keyword");
    const [games, setGames] = useState([]);
    const router = useRouter(); // ✅ 페이지 이동을 위한 Next.js 라우터

    useEffect(() => {
        if (keyword) {
            searchGames(keyword)
                .then((data) => {
                    setGames(data);

                    // ✅ 검색 결과가 있으면 첫 번째 게임 상세 페이지로 바로 이동
                    if (data.length > 0) {
                        router.push(`/games/${data[0].id}`);
                    }
                })
                .catch(console.error);
        }
    }, [keyword, router]);

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h1 className="text-xl font-bold">"{keyword}" 검색 중...</h1>
        </div>
    );
};

export default SearchResults;
