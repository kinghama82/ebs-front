"use client"

import { getGameById } from "@/api/game/gameapi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CopyUrlButton from "./CopyUrlButton";
import BookMarkButton from "../bookmarks/BookMarkButton";
import { API_SERVER_HOST } from "@/api/publicapi";


const GameBoxComponent = ({ id }) => {
    const [game, setGame] = useState(null)

    useEffect(() => {
        if (!id) return;  // ✅ ID가 없으면 실행하지 않음

        const fetchGame = async () => {
            try {
                const gameData = await getGameById(id);
                setGame(gameData);
            } catch (error) {
                console.log("API 호출 실패", error);
                toast("게임 정보를 찾을 수 없습니다.");
                setGame(null);
            }
        };

        fetchGame();
    }, [id]);
    // const gameValue = `item-${game.id}`

    if (!game) return <p>게임 정보를 불러오는중...</p>
    return (
        <>
            <div
                className=" p-2 rounded flex justify-start items-center relative max-w-6xl h-64"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0) 30%),
                        url(${API_SERVER_HOST}${game.img})
                    `,
                    backgroundSize: '100% 100%, 25% 255px',
                    backgroundPosition: 'left, right center',
                    backgroundRepeat: 'no-repeat, no-repeat',
                    color: 'white'
                }}
            >
                <div className="m-8 p-2">
                    {game.img && game.img !== "" ? (
                        <img
                            src={`${API_SERVER_HOST}${game.img}`}
                        alt={game.gameName}
                            className="w-[150px] h-[150px] object rounded-md"
                        />
                    ) : (
                        <div className="h-[200px] flex items-center justify-center bg-gray-200 text-gray-500">
                            이미지 없음
                        </div>
                    )}
                </div>

                <div className="basis-2/5 mr-4 w-full p-2  ms-3">
                    <div className="flex flex-col h-16">
                        <h3 className="text-xl font-bold  border-b-2 flex justify-between items-center">
                            {game.gameName}
                            {/* url복사 + 게임 북마크 */}
                            <div className="flex justify-between gap-3" >
                                <CopyUrlButton url={`${window.location.origin}/games?game=item-${game.id}`} />
                                <BookMarkButton gameId={game.id} />
                            </div>
                        </h3>
                        <div className="shrink w-56 text-sm text-gray-500 flex justify-between">
                            {game.enGameName}
                            <span className="text-base font-bold"> {game.year}</span>
                        </div>
                    </div>

                    <div className="flex flex-row">
                        <div className=" w-56 ">
                            <div className="flex justify-between">
                                <span className="font-bold">플레이어수:</span>{game.players}인
                            </div>
                            <div className="text-sm flex justify-between mb-1">
                                <span className="text-xs">추천 플레이어수:</span>
                                {game.bestPlayers}인
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">권장연령:</span> {game.reage}세 이상
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">게임시간:</span> {game.time}분
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">게임난이도:</span> {game.weight}min
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-56 ml-8">
                            <div className="flex flex-col">
                                <div className="flex justify-between">
                                    <span className="font-bold">판매회사:</span> {game.scompany}
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">판매가격:</span> {game.price}
                                </div>
                                <span className="font-bold text-lg mb-2 mt-2">카테고리</span>
                                <div className="flex flex-wrap gap-2">
                                    {game.gameCategory && game.gameCategory.length > 0 ? (
                                        game.gameCategory.map((category, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-indigo-600 text-white rounded-md text-sm"
                                                title={category.description}
                                            >
                                                {category.gameCategory}
                                            </span>
                                        ))
                                    ) : (
                                        <div className="text-gray-400">카테고리 정보 없음</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default GameBoxComponent;