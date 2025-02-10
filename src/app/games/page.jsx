// app/games/page.js
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function GamesPage() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/games")
            .then((res) => res.json())
            .then((data) => setGames(data))
            .catch((error) => console.error("Error fetching games:", error));
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">보드게임 목록</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {games.map((game) => (
                    <Link key={game.id} href={`/games/${game.id}`}>
                        <div className="border p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100">
                            {/* 이미지가 존재하는 경우에만 표시 */}
                            {game.img ? (
                                <Image
                                    src={`http://localhost:8080${game.img}`}
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
