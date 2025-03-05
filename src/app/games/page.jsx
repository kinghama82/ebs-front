"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getGames } from "@/api/game/gameapi"; // getGames 함수 사용

export default function GamesPage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) {
        return <div className="container mx-auto p-4 text-center">게임 데이터를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">보드게임 목록</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {games.map((game) => (
                    <Link key={game.id} href={`/games/${game.id}`}>
                        <div className="border p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
                            {game.img ? (
                                <img
                                    src={game.img}
                                    alt={game.gameName}
                                    width={200}
                                    height={200}
                                    className="rounded-md"
                                />
                            ) : (
                                <div className="h-[200px] flex items-center justify-center bg-gray-200 text-gray-500">
                                    이미지 없음
                                </div>
                            )}
                            <h2 className="text-xl font-semibold">{game.gameName}</h2>
                            <p>제작사: {game.company}</p>
                            <p>출시년도: {game.year}</p>
                            <p>인원: {game.players}</p>
                            <p>가격: {game.price} 원</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
