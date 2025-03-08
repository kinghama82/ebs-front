"use client"
import { getRecentGames } from "@/api/history/historyApi";
import Link from "next/link";
import { useEffect, useState } from "react";

const RecentGameComponent = ({ gamerid }) => {
    const [gameList, setGameList] = useState([])

    useEffect(() => {
        if (!gamerid) return;

        getRecentGames(gamerid).then((games) => {
            setGameList(games);
        }).catch(err => console.error(err));
    }, [gamerid]);

    if (gameList.length === 0) return <p>최근 플레이한 게임이 없습니다.</p>;

    return (
        <div className="p-2 shadow-md">
            <ul className="list-disc list-inside">
                {gameList.map(game => (
                    <li key={game.id} className="flex items-center space-x-2 text-black font-semibold text-xl border-b py-2">
                        {/* 게임 이미지 */}
                        {game.img ? (
                            <span className=" ms-2 border-2">
                                <img src={`http://43.202.30.85:8080${game.img}`}
                                     alt={game.gameName}
                                     className="w-[25px] h-[25px] object-cover rounded-md"/>
                            </span>
                        ) : (
                            <span className="h-[25px] w-[25px] flex items-center justify-center bg-gray-200 text-gray-500 text-sm rounded-md">
                                이미지 없음
                            </span>
                        )}
                        {/* 게임 이름 */}
                        <Link href={`/games/${game.id}`}>{game.gameName}</Link>
                    </li>
                ))}
            </ul>
        </div>

    );
};

export default RecentGameComponent;


