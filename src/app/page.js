"use client";
import React, { useEffect, useState } from "react";
import BasicMenu from "@/components/menus/BasicMenu";
import { getGames } from "@/api/game/gameapi";
import jwtDecode from "jsonwebtoken"; // JWT 디코딩을 위한 라이브러리
import Cookies from "js-cookie"; // 쿠키에서 데이터 가져오기
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Home() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nickname, setNickname] = useState(""); // 닉네임 저장

    useEffect(() => {
        // 1. 쿠키에서 gamerCooki(JWT) 가져오기
        const token = Cookies.get("gamerCooki");
        if (token) {
            try {
                const decoded = jwtDecode.decode(token); // JWT 디코딩
                if (decoded && decoded.nickname) {
                    setNickname(decoded.nickname); // 닉네임 저장
                }
            } catch (error) {
                console.error("JWT 디코딩 오류:", error);
            }
        }

        // 2. 게임 데이터 불러오기
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
        <div>
            <div className="p-6 text-4xl font-bold text-center text-amber-800">
                Board ParaDice
            </div>
            {/* ✅ 닉네임 표시 */}
            {nickname ? (
                <div className="text-center text-lg font-semibold mt-2">
                    환영합니다, <span className="text-blue-500">{nickname}</span>님!
                </div>
            ) : (
                <div className="text-center text-gray-500">로그인하세요</div>
            )}

            <BasicMenu />

            <Carousel className="border-2 max-w-6xl content-center origin-center items-center mx-auto">
                <CarouselContent>
                    {/* 첫 번째 카드 */}
                    <CarouselItem className="basis-1/3 p-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>첫 번째 카드</CardTitle>
                                <CardDescription>간단 설명</CardDescription>
                            </CardHeader>
                            <CardContent>본문 내용</CardContent>
                        </Card>
                    </CarouselItem>

                    {/* 두 번째 카드 */}
                    <CarouselItem className="basis-1/3 p-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>두 번째 카드</CardTitle>
                                <CardDescription>간단 설명</CardDescription>
                            </CardHeader>
                            <CardContent>본문 내용</CardContent>
                        </Card>
                    </CarouselItem>

                    {/* 세 번째 카드 - 게임 정보 카드 */}
                    <CarouselItem className="basis-1/3 p-4">
                        <div className="space-y-4">
                            {games.slice(0, 5).map((game, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle>{game.gameName}</CardTitle>
                                        <CardDescription>
                                            {game.enGameName} ({game.year})
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex">
                                            <div className="w-24 h-24">
                                                {game.img ? (
                                                    <img
                                                        src={`http://43.202.30.85:8080${game.img}`}
                                                        alt={game.gameName}
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                ) : (
                                                    <div className="h-24 w-24 flex items-center justify-center bg-gray-200 text-gray-500">
                                                        이미지 없음
                                                    </div>
                                                )}
                                            </div>

                                            <div className="ml-4">
                                                <p>
                                                    <span className="font-bold">플레이어:</span>{" "}
                                                    {game.players}인
                                                </p>
                                                <p>
                                                    <span className="font-bold">추천:</span>{" "}
                                                    {game.bestPlayers}인
                                                </p>
                                                <p>
                                                    <span className="font-bold">연령:</span>{" "}
                                                    {game.reage}세 이상
                                                </p>
                                                <p>
                                                    <span className="font-bold">시간:</span>{" "}
                                                    {game.time}분
                                                </p>
                                                <p>
                                                    <span className="font-bold">난이도:</span>{" "}
                                                    {game.weight}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </div>
    );
}
