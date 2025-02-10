// app/games/[id]/page.js
import React from 'react';

export default async function GameDetailPage({ params }) {
    // params가 promise인 경우 await해서 해결합니다.
    const { id } = await params;

    // API 호출 시 캐시 옵션을 'no-store'로 하여 항상 최신 데이터를 가져옵니다.
    const res = await fetch(`http://localhost:8080/games/${id}`, { cache: 'no-store' });
    if (!res.ok) {
        return <div>게임 정보를 불러오는 중 오류가 발생했습니다.</div>;
    }
    const game = await res.json();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{game.gameName}</h1>
            <div className="flex flex-col md:flex-row gap-4">
                {/* 이미지 표시 */}
                {game.img && (
                    <div className="md:w-1/2, max-h-2">
                        <img
                            src={`http://localhost:8080${game.img}`}
                            alt={game.gameName}
                            className="w-full rounded shadow"
                        />
                    </div>
                )}

                {/* 게임 상세 정보 */}
                <div className="md:w-1/2">
                    <p>
                        <strong>출시년도:</strong> {game.year}
                    </p>
                    <p>
                        <strong>플레이어 수:</strong> {game.players}
                    </p>
                    <p>
                        <strong>플레이시간:</strong> {game.time}
                    </p>
                    <p>
                        <strong>권장 연령:</strong> {game.reage}
                    </p>
                    <p>
                        <strong>회사:</strong> {game.company}
                    </p>
                    <p>
                        <strong>판매사:</strong> {game.sCompany}
                    </p>
                    <p>
                        <strong>가격:</strong> {game.price}
                    </p>
                    <p>
                        <strong>영어 게임 이름:</strong> {game.enGameName}
                    </p>
                    <p>
                        <strong>베스트 플레이어:</strong> {game.bestPlayers}
                    </p>
                    <p>
                        <strong>평균 평점:</strong> {game.avg}
                    </p>
                    <p>
                        <strong>게임 랭크:</strong> {game.gamerank}
                    </p>
                    <p>
                        <strong>이미지 경로:</strong> {game.img}
                    </p>
                </div>
            </div>
        </div>
    );
}
