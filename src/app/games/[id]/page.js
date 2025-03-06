// app/games/[id]/page.js
import React from 'react';
import { getGameById } from '@/api/game/gameapi';

export default async function GameDetailPage({ params }) {
    // params가 promise인 경우 await해서 해결합니다.
    const { id } = await params;

    try {
        // API 호출을 getGameById 함수로 변경
        const game = await getGameById(id);

        return (
            <div
                className="container p-4 border-4 border-indigo-500 flex justify-start mt-5 relative max-w-6xl"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 40%),
                        url(http://43.202.30.85:8080${game.img})
                    `,
                    backgroundSize: '100% 100%, 30% 100%',
                    backgroundPosition: 'left, right center',
                    backgroundRepeat: 'no-repeat, no-repeat',
                    color: 'white',
                    minHeight: '300px'
                }}
            >
                <div className="m-8">
                    {game.img && game.img !== "" ? (
                        <img
                            src={`http://43.202.30.85:8080${game.img}`}
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
                </div>

                <div className="basis-2/5 mr-4 w-56 p-2">
                    <div className="flex flex-col h-20">
                        <h3 className="text-xl font-bold mb-2 border-b-2">
                            {game.gameName}
                            <div className="shrink w-56 text-sm text-gray-500 flex justify-between">
                                {game.enGameName}
                                <span className="text-base font-bold"> {game.year}</span>
                            </div>
                        </h3>
                    </div>

                    <div className="flex flex-row">
                        <div className="mr-4 w-56">
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
        );
    } catch (error) {
        return <div>게임 정보를 불러오는 중 오류가 발생했습니다.</div>;
    }
}
