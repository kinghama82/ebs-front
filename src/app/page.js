"use client";
import { getGames } from "@/api/game/gameapi";
import LogoutButton from "@/components/LogoutButton";
import BasicMenu from "@/components/menus/BasicMenu";
import CategoryIcons from "@/components/menus/CategoryIcons";
import MainSwiper from "@/components/menus/MainSwiper";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Cookies from "js-cookie"; // 쿠키에서 데이터 가져오기
import jwtDecode from "jsonwebtoken"; // JWT 디코딩을 위한 라이브러리
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nickname, setNickname] = useState(""); // 닉네임 저장
    const router = useRouter()

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
            <div className=" max-w-6xl mx-auto font-bold text-center flex">
                <div className="w-1/6"></div>
                <div className="w-1/6"></div>
                {/* 로고 */}
                <div className="w-2/6 -mb-2">
                    <img src="/logo.png" />
                </div>
                {/* 로그인 상태창 */}
                <div className="w-2/6 flex justify-end items-end">
                    <Button onClick={()=> router.push('/gamer/new')}>회원가입</Button>
                {nickname ? 
                    (<Card className="border border-black">
                        <CardHeader>
                            <CardTitle>
                                환영합니다. <span className="text-blue-500">{nickname} </span>님!                                
                            </CardTitle>
                            <CardDescription>                                
                                <Link href={'/mypage'} className="text-amber-500 flex justify-center items-center">
                                    마이 페이지<CircleUserRound/>
                                </Link>                                
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="-mt-4 -mb-4"><LogoutButton/></CardContent>
                    </Card>
                ):(
                    <Button className="text-xl dark:text-white" onClick={()=> router.push(`/gamer`)}>로그인</Button>
                )}
                    
                </div>
            </div>

            {/* 네비바 */}
            <BasicMenu />

            {/* 게임 장르 아이콘 */}
            <div className="max-w-6xl mx-auto mt-2 p-4">
                <CategoryIcons/>
            </div>

            {/* 캐로주얼 */}
            <div className="rounded max-w-6xl mx-auto mt-2"> 
                <MainSwiper />
            </div>

            {/* 아래 게시판 추가 공간 */}
            <div className="max-w-6xl mx-auto mt-2 bg-gray-500">게시판 추가 공간</div>


        </div>

    );
}
