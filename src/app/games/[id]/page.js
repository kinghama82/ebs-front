// app/games/[id]/page.js
import React from 'react';
import Image from 'next/image';
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

        <div
            className="container p-4 border-4 border-indigo-500 flex justify-start mt-5 relative"
            style={{
                // 1) 첫 번째 레이어: 왼쪽 어둡고, 40% 이후부터 투명해지도록 그라데이션
                // 2) 두 번째 레이어: 이미지
                backgroundImage: `
      linear-gradient(to right, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 60%),
      url(http://localhost:8080${game.img})
    `,
                // 첫 번째 레이어는 전체(100% 100%)를 덮고,
                // 두 번째 레이어(이미지)는 가로 50%, 세로 100%만 사용 (오른쪽 절반)
                backgroundSize: '100% 100%, 50% 100%',
                // 첫 번째 레이어(그라데이션)는 왼쪽에 맞추고,
                // 두 번째 레이어(이미지)는 오른쪽 정렬
                backgroundPosition: 'left, right center',
                // 각각 반복 안 함
                backgroundRepeat: 'no-repeat, no-repeat',

                color: 'white',
                minHeight: '300px'
            }}
        >
            {/* 여기 내부에 텍스트, 이미지 등 필요한 내용 배치 */}





    {/*        <div className="container p-4 border-4 border-indigo-500 flex justify-start mt-5
         bg-gray-900"
             style={{
                 backgroundImage: `url(http://localhost:8080${game.img})`,
                 backgroundSize: 'cover', // 이미지를 화면에 맞게 채움
                 backgroundPosition: 'center', // 이미지를 중앙에 배치
                 backgroundRepeat: 'no-repeat' // 이미지 반복 안 함
             }}>*/}
            {/*배경이미지 넣기 테스트*/}

            <div className={" m-8 "}>
            {/* 이미지 표시 */}
            {game.img && game.img !== "" ? (
                <Image
                    src={`http://localhost:8080${game.img}`} // ✅ 올바른 상대경로 사용
                    alt={game.gameName}
                    min-width={200}
                    min-height={200}
                    max-width={200}
                    max-height={200}
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

            <div className="flex flex-col md:flex-row gap-4 mr-4 w-56 p-2 ">
                <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold mb-2">{game.gameName}
            <div className={"text-sm text-gray-500 flex justify-between"}>{game.enGameName}
                <span className={"text-base font-bold"}> {game.year}</span></div></h3>
                {/* 게임 상세 정보 */}

                    <div className={"flex justify-between"}>
                        <span className="font-bold">플레이어수:</span>{game.players}인
                    </div>
                    <div className={"text-sm flex justify-between mb-1"}>
                        <span className="text-xs">추천 플레이어수:</span>
                        {game.bestPlayers}인
                    </div>

                    <div className={"flex justify-between"}>
                        <span className="font-bold">권장연령:</span> {game.reage}세 이상</div>

                    <div className={"flex justify-between w-56"}>
                        <span className="font-bold">게임시간:</span> {game.time}분</div>

                    <div className={"flex justify-between w-56"}>
                        <span className="font-bold">게임난이도:</span> {game.weight}min</div>

                </div>
            </div>
            {/*여기까지가 2번째칸*/}


            <div className="flex flex-col md:flex-row gap-4 w-36 ml-8 mt-10">
                <div className="flex flex-col gap-1">

                    <div className={"flex justify-between w-36"}>
                        <span className="font-bold">판매회사:</span> {game.scompany}</div>

                    <div className={"flex justify-between"}>
                        <span className="font-bold">판매가격:</span> {game.price}</div>

                </div>
            </div>

        </div>
    );
}
