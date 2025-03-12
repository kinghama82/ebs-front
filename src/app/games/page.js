"use client";
import { getGames } from "@/api/game/gameapi";
import BookMarkButton from "@/components/bookmarks/BookMarkButton";
import CopyUrlButton from "@/components/common/CopyUrlButton";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GamesPage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gameParam, setGameParam] = useState(null);
    const [activeGame, setActiveGame] = useState(null);

    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const gameValue = params.get("game");
            setGameParam(params.get("game"));
            setActiveGame(gameValue);
        }
    }, []);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await getGames();
                setGames(data);
            } catch (err) {
                console.error("Error fetching games:", err);
                setError("게임 데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    // 게임 데이터 로드 후 스크롤 이동
    useEffect(() => {
        if (gameParam && games.length > 0) {
            setTimeout(() => {
                const element = document.getElementById(gameParam);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 300); // DOM 렌더링 지연 해결
        }
    }, [gameParam, games]); // 🔥 게임 리스트가 로드된 후 실행

    if (loading) {
        return <div className="container mx-auto p-4 text-center">게임 데이터를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-2xl font-bold mb-4">보드게임 목록</h1>

            <Accordion type="single" collapsible value={activeGame}
                       onValueChange={(value) => {
                           setActiveGame(value)
                           router.replace(`/games?game=${value}`, { scroll: false }); // URL 변경하지만 스크롤 이동 방지
                       }}>
                {games.map((game) => {
                    const gameValue = `item-${game.id}`
                    return (
                        <AccordionItem key={game.id} value={gameValue} id={gameValue}>
                            <AccordionTrigger>
                                <div className="flex flex-1 p-3 rounded-lg shadow cursor-pointer hover:bg-gray-100 items-center ">
                                    {game.img ? (
                                        <div className="m-1 ms-2 border-2">
                                            <img
                                                src={`http://43.202.30.85:8080${game.img}`}
                                                alt={game.gameName}
                                                className="w-[50px] h-[50px] object-cover rounded-md"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-[50px] w-[50px] flex items-center justify-center bg-gray-200 text-gray-500">
                                            이미지 없음
                                        </div>
                                    )}
                                    <h2 className="text-lg font-semibold w-56 ms-2">{game.gameName}</h2>
                                    <p className="w-60">제작사: {game.company}</p>
                                    <p className="w-40">출시년도: {game.year}</p>
                                    <p className="mr-2">인원: {game.players}</p>
                                    <p className="ml-2">가격: {game.price} 원</p>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent>
                                <div
                                    className=" p-2 rounded flex justify-start items-center relative max-w-6xl h-64"
                                    style={{
                                        backgroundImage: `
                        linear-gradient(to right, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0) 30%),
                        url(http://43.202.30.85:8080${game.img})
                    `,
                                        backgroundSize: '100% 100%, 25% 250px',
                                        backgroundPosition: 'left, right center',
                                        backgroundRepeat: 'no-repeat, no-repeat',
                                        color: 'white'
                                    }}
                                >
                                    <div className="m-8 p-2">
                                        {game.img && game.img !== "" ? (
                                            <img
                                                // src={`http://43.202.30.85:8080${game.img}`}
                                                // alt={game.gameName}
                                                // width={200}
                                                // height={200}
                                                // className="rounded-md"

                                                src={`http://43.202.30.85:8080${game.img}`}
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
                                                    <CopyUrlButton url={`${window.location.origin}/games?game=${gameValue}`}/>
                                                    <BookMarkButton gameId={game.id}/>
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
                            </AccordionContent>
                        </AccordionItem>
                    )})}
            </Accordion>
        </div>
    );
}