"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

const RecentGameComponent = ({ histories }) => {
    const [gameList, setGameList] = useState([]);

    useEffect(() => {
        if (histories) {
            // 중복 제거 및 최근 플레이 게임 정렬
            const uniqueGames = Array.from(new Map(histories.map(h => [h.game.id, h.game])).values());
            setGameList(uniqueGames);
        }
    }, [histories]);

    return (
        <div className="p-4 border rounded shadow-md">            
            <ul className="list-disc list-inside">
                {gameList.length > 0 ? (
                    gameList.map(game => (
                        <li key={game.id} className="text-blue-500">
                            <Link href={`/games/${game.id}`}>{game.gameName}</Link>
                        </li>
                    ))
                ) : (
                    <p>최근 플레이한 게임이 없습니다.</p>
                )}
            </ul>
        </div>
    );
};

export default RecentGameComponent;


