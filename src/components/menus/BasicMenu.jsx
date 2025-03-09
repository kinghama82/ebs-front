"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleUserRound, Dices, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useCustomCookie } from "../common/useCustomCookie";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "../ui/button";
import { searchGames } from "@/api/game/gameapi"; // ✅ 검색 API 추가
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const BasicMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]); // ✅ 검색 결과 저장
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const userInfo = useCustomCookie();

  // ✅ 검색창 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ 검색 실행 (디바운싱 적용)
  useEffect(() => {
    if (!searchKeyword.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const results = await searchGames(searchKeyword);
        setSearchResults(results);
        setIsSearchOpen(results.length > 0);
      } catch (error) {
        console.error("🚨 검색 중 오류:", error);
      }
    }, 300); // ✅ 300ms 디바운싱

    return () => clearTimeout(delayDebounce);
  }, [searchKeyword]);

  // ✅ 검색 결과 클릭 시 이동
  const handleSelectGame = (gameId) => {
    router.push(`/games/${gameId}`);
    setIsSearchOpen(false);
    setSearchKeyword("");
  };

  return (
    <>
      <div className="mt-2 sticky-top">
        <nav className="bg-white shadow-md border border-black border-opacity-100 rounded-md max-w-6xl mx-auto top-0 left-0 z-50" >
          <div className=" px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">

              {/* 로고 */}
              <div className="flex items-center space-x-6">
                <Link href="/" className="text-xl font-bold text-amber-800" title="홈으로">
                  <Dices />
                </Link>
                <Link className="text-amber-800" href={`/mypage`}><CircleUserRound/></Link>


                {/* 네비게이션 메뉴 */}
                <div className="hidden no-underline md:flex space-x-6">
                  <NavLink href="/news">뉴스</NavLink>
                  <NavLink href="/free">자유</NavLink>
                  <NavLink href="/question">질문</NavLink>
                  <NavLink href="/rulebook">룰북</NavLink>
                  <NavLink href="/games">게임정보</NavLink>
                  {userInfo ? <NavLink href={`/history?page=1&size=10&gamerid=${userInfo.id}`}>게임기록</NavLink> : <></>}
                </div>

                {/* 검색창 */}
                <div className="relative ml-auto text-amber-800" ref={searchRef}>
                  <div className="relative flex items-center">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="게임 검색..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onFocus={() => setIsSearchOpen(searchResults.length > 0)}
                        className="border border-gray-300 rounded-md px-3 py-1 bg-white w-60"
                    />
                    <button className="p-2" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                      <Search size={20} className="text-amber-800" />
                    </button>
                  </div>

                  {/* 검색 결과 드롭다운 */}
                  {isSearchOpen && (
                      <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-300 shadow-lg rounded-md z-50">
                        {searchResults.map((game) => (
                            <li
                                key={game.id}
                                onClick={() => handleSelectGame(game.id)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            >
                              {game.img && (
                                  <img
                                      src={`http://43.202.30.85:8080${game.img}`}
                                      alt={game.gameName}
                                      className="w-10 h-10 object-cover rounded mr-3"
                                  />
                              )}
                              <span className="text-gray-700">{game.gameName}</span>
                            </li>
                        ))}
                      </ul>
                  )}
                </div>

                {/* 햄버거 버튼 */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* 모바일 메뉴 */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-lg">
                  <div className="flex flex-col space-y-4 p-4">
                    <NavLink href="/news" onClick={() => setIsOpen(false)}>뉴스</NavLink>
                    <NavLink href="/free" onClick={() => setIsOpen(false)}>자유</NavLink>
                    <NavLink href="/question" onClick={() => setIsOpen(false)}>질문</NavLink>
                    <NavLink href="/rulebook" onClick={() => setIsOpen(false)}>룰북</NavLink>
                    <NavLink href="/games" onClick={() => setIsOpen(false)}>게임정보</NavLink>
                    {userInfo && (
                        <NavLink href={`/history?page=1&size=10&gamerid=${userInfo.id}`} onClick={() => setIsOpen(false)}>
                          게임기록
                        </NavLink>
                    )}
                  </div>
                </div>
            )}
            </div>
          </nav>
        </div>

        {/* 로그인/로그아웃 UI */}
        <div className="flex relative justify-end -mt-[65px] -mb-[110px]">
          {userInfo ? (
              <Card className="border grid-cols-2 border-black mr-[190px] w-[175px]">
                <CardHeader>
                  <CardTitle>
                    환영합니다.<br />
                    <span className="text-blue-700">{userInfo.nickname}</span> 님!
                  </CardTitle>
                  <CardDescription>
                    <LogoutButton />
                    <br />
                    <Button variant="link" className="text-black" size="md" onClick={() => router.push('/mypage')}>
                      마이페이지
                    </Button>
                  </CardDescription>
                </CardHeader>
                <CardContent>본문 내용</CardContent>
              </Card>
          ) : (
              <Button className="text-white mr-[283px] mb-[145px]" onClick={() => router.push('/gamer')}>
                Login
              </Button>
          )}
        </div>
        

      

    </>
  );
};

export default BasicMenu;

// ✅ 네비게이션 링크 컴포넌트 추가
function NavLink({ href, children, onClick }) {
  return (
      <Link href={href} className="text-amber-800 transition font-medium" onClick={onClick}>
        {children}
      </Link>
  );
}

