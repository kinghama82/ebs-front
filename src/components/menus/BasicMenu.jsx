"use client";

import { searchGames } from "@/api/game/gameapi"; // ✅ 검색 API 추가
import { CircleUserRound, Dices, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCustomCookie } from "../common/useCustomCookie";
import { ModeToggle } from "../ModeToggle";
import { useTheme } from "next-themes";

const BasicMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]); // ✅ 검색 결과 저장
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const userInfo = useCustomCookie();
  const { theme } = useTheme()

  // ✅ 검색창 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        event.target !== inputRef.current
      ) {
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
        setIsSearchOpen(true);
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
        <nav className={`shadow-md border border-opacity-100 rounded-md max-w-6xl mx-auto top-0 left-0 z-50 
          ${theme === "dark" ? "bg-[#0a0b0c] text-white border-white" : "bg-white text-black border-black"}`}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              {/* 🔹 로고 & 네비게이션 메뉴 */}
              <div className="flex items-center space-x-6">
                <Link href="/" className="text-xl font-bold text-amber-800 dark:text-white" title="홈으로">
                  <Dices />
                </Link>
                {userInfo ? 
                  <Link className="text-amber-800 dark:text-white" href={`/mypage`}>
                    <CircleUserRound />
                  </Link>
                  : <></>}
                

                {/* 네비게이션 메뉴 */}
                <div className="hidden no-underline md:flex space-x-6 text-amber-800 font-semibold dark:text-white">
                  <Link href="/news">뉴스</Link>
                  <Link href="/free">자유</Link>
                  <Link href="/question">질문</Link>
                  <Link href="/rulebook">룰북</Link>
                  <Link href="/games">게임정보</Link>
                  {userInfo ? (
                    <Link href={`/history?page=1&size=10&gamerid=${userInfo.id}`}>
                      게임기록
                    </Link>
                  ) : null}
                </div>
              </div>

              {/* 🔥 검색창 & 돋보기 버튼 (수정된 부분) */}
              <div className="relative ml-auto flex items-center" ref={searchRef}>
                {/* 검색창 */}
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="게임 검색..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={() => setIsSearchOpen(true)}
                  className={`border border-gray-300 rounded-md px-3 py-1 bg-white transition-all duration-300 ${
                    isSearchOpen ? "w-60 opacity-100" : "w-0 opacity-0"
                  }`}
                />
                {/* 🔥 돋보기 버튼 (오른쪽 끝으로 이동) */}
                <button
                  className="ml-2 p-2 rounded-md focus:outline-none z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsSearchOpen(true)
                  }}
                >
                  <Search size={20} className="text-amber-800 dark:text-white" />
                </button>


                {/* 🔥 검색 결과 드롭다운 (검색창 아래로 위치하도록 수정) */}
                {isSearchOpen && searchResults.length > 0 && (
                    <ul className="absolute left-0 top-full mt-1 w-60 bg-white border border-gray-300 shadow-lg rounded-md z-50">
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



                {/* 🔥 검색 결과 드롭다운 (제대로 유지) */}
                {/*아래코드는 기존에 드롭다운이 검색창 가리는코드*/}
                {/*{isSearchOpen && searchResults.length > 0 && (
                  <ul className="absolute left-0 mt-1 w-60 bg-white border border-gray-300 shadow-lg rounded-md z-50">
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
                )}*/}
                <ModeToggle/>
              </div>
              

              {/* 햄버거 버튼 */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
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
