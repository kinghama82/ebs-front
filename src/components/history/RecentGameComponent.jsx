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
        <div className="p-4 border rounded shadow-md">
            <ul className="list-disc list-inside">
                {gameList.map(game => (
                    <div key={game.id} className="text-black font-semibold text-xl border-b border-black">
                        <Link href={`/games/${game.id}`}>{game.gameName}</Link>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default RecentGameComponent;


