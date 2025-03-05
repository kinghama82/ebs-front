"use client";

import { CircleUserRound, Dices, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { searchGames } from "@/api/game/gameapi"; // ✅ 검색 API 추가
import { useRouter } from "next/navigation"; // ✅ 검색 결과 페이지 이동용

const BasicMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState(""); // ✅ 검색어 상태 추가
  const router = useRouter(); // ✅ Next.js의 라우터 사용

  // 검색창 바깥 클릭 시 닫히도록 설정
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 검색창이 열릴 때 자동 포커스
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // ✅ 검색 실행 함수
  const handleSearch = async () => {
    if (!searchKeyword.trim()) return; // 빈 검색어 방지

    try {
      // 검색 결과 페이지로 이동
      router.push(`/search?keyword=${searchKeyword}`);
    } catch (error) {
      console.error("검색 오류:", error);
    }
  };

  // ✅ Enter 키를 눌렀을 때 검색 실행
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <nav className="bg-white shadow-md border border-black border-opacity-100 rounded-md sticky-top max-w-6xl mx-auto top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 로고 */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold text-amber-800" title="홈으로">
              <Dices />
            </Link>
            <Link href="/mypage" className="text-amber-800" title="마이페이지">
              <CircleUserRound/>
            </Link>

            {/* 네비게이션 메뉴 */}
            <div className="hidden md:flex space-x-6">
              <NavLink href="/news">뉴스</NavLink>
              <NavLink href="/free">자유</NavLink>
              <NavLink href="/question">질문</NavLink>
              <NavLink href="/rulebook">룰북</NavLink>
              <NavLink href="/games">게임정보</NavLink>
              <NavLink href="/history">게임기록</NavLink>
            </div>
          </div>

          {/* 검색창 */}
          <div className="relative ml-auto text-amber-800" ref={searchRef}>
            <div className="relative flex items-center">
              {/* 검색 입력창 (왼쪽으로 확장됨) */}
              <input
                ref={inputRef}
                type="text"
                placeholder="검색어 입력"
                value={searchKeyword} // ✅ 입력값 상태 연결
                onChange={(e) => setSearchKeyword(e.target.value)} // ✅ 입력값 업데이트
                onKeyDown={handleKeyDown} // ✅ Enter 키 검색 실행
                className={`absolute right-full top-1/2 -translate-y-1/2 border border-gray-300 rounded-md px-3 py-1 bg-white transition-all duration-300 ${
                  isSearchOpen ? "w-60 opacity-100" : "w-0 opacity-0"
                }`}
              />

              {/* 돋보기 버튼 */}
              <button
                  onClick={() => {
                    if (isSearchOpen) handleSearch(); // ✅ 검색 실행
                    setIsSearchOpen(!isSearchOpen);
                  }}
                  className="p-2 rounded-md focus:outline-none z-10 "
              >
                <Search size={20} className="text-amber-800" />
              </button>
            </div>
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
            <NavLink href="/history" onClick={() => setIsOpen(false)}>게임기록</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default BasicMenu;

// 네비게이션 링크 컴포넌트
function NavLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      className="text-amber-800 hover:text-blue-500 transition font-medium"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
