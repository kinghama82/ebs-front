"use client";

import React, { useEffect, useState, use } from "react";
import { getGames } from "@/api/game/gameapi";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import CategoryIcons from "@/components/menus/CategoryIcons";
import GameBoxComponent from "@/components/common/GameBoxComponent";
import {API_SERVER_HOST} from "@/api/publicapi";

export default function CategoryPage({ params }) {
    // ✅ `params`는 Promise이므로 `use()`로 비동기 처리
    const { category } = use(params);

    // ✅ URL 디코딩 적용
    const decodedCategory = decodeURIComponent(category);

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await getGames();
                const filteredGames = data.filter((game) =>
                    game.gameCategory.some((c) => c.gameCategory === decodedCategory)
                );
                setGames(filteredGames);
            } catch (err) {
                console.error("Error fetching games:", err);
                setError("게임 데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [decodedCategory]);

    if (loading) {
        return <div className="container mx-auto p-4 text-center">게임 데이터를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <CategoryIcons/>
            <h1 className="text-2xl font-bold mb-4">{`"${decodedCategory}" 카테고리의 게임 목록`}</h1>

            <Accordion type="single" collapsible>
                {games.map((game) => (
                    <AccordionItem key={game.id} value={`item-${game.id}`}>
                        <AccordionTrigger>
                            <div className="flex flex-1 p-3 rounded-lg shadow cursor-pointer hover:bg-gray-100 items-center ">
                                {game.img ? (
                                    <div className="m-1 ms-2 border-2">
                                        <img
                                            src={`${API_SERVER_HOST}${game.img}`}
                                            alt={game.gameName}
                                            className="w-[50px] h-[50px] object-cover rounded-md"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-[50px] w-[50px] flex items-center justify-center bg-gray-200 text-gray-500">
                                        이미지 없음
                                    </div>
                                )}
                                <h2 className="text-xl font-semibold w-56 ms-2">{game.gameName}</h2>
                                <p className="w-60">제작사: {game.company}</p>
                                <p className="w-40">출시년도: {game.year}</p>
                                <p className="mr-2">인원: {game.players}</p>
                                <p className="ml-2">가격: {game.price} 원</p>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <GameBoxComponent id={game.id}/>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}