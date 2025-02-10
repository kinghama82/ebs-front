import ExRateComponent from "@/components/ExrateComponent";
import Image from "next/image";
// app/page.js
import Link from 'next/link';
import React from 'react';

/**
 * 백엔드 API에서 게임 목록을 가져옵니다.
 * cache: 'no-store' 옵션은 매번 최신 데이터를 가져오도록 합니다.
 */
async function getGames() {
  const res = await fetch('http://localhost:8080/games', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch games');
  }
  return res.json();
}

/**
 * Home 컴포넌트는 서버 컴포넌트로 동작하며,
 * 백엔드에서 데이터를 불러와 게임 목록을 렌더링합니다.
 */
export default async function Home() {
  const games = await getGames();

  return (
   
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6">Game List</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
              // 각 게임 카드를 클릭하면 상세 페이지로 이동합니다.
              <Link href={`/game/${game.id}`} key={game.id}>
                <a className="block border rounded p-4 shadow hover:shadow-lg transition">
                  <h2 className="text-2xl font-semibold mb-2">{game.gameName}</h2>
                  <p><strong>Year:</strong> {game.year}</p>
                  <p><strong>Players:</strong> {game.players}</p>
                  <p><strong>Time:</strong> {game.time}</p>
                  <p><strong>Average:</strong> {game.avg}</p>
                  <p><strong>Rank:</strong> {game.gamerank}</p>
                  {game.img && (
                      <img
                          src={game.img}
                          alt={game.gameName}
                          className="mt-2 w-full h-auto object-cover rounded"
                      />
                  )}
                </a>
              </Link>
          ))}
        </div>
      </main>
  );
}