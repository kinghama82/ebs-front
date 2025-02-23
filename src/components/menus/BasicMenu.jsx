"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, Dices } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

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

  return (
    <nav className="bg-white shadow-md sticky-top w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 🔹 로고 - 왼쪽 */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold text-amber-800">
            <Dices/>
            </Link>

            {/* 🔹 네비게이션 메뉴 - 왼쪽 정렬 */}
            <div className="hidden md:flex space-x-6">
              <NavLink href="/news">뉴스</NavLink>
              <NavLink href="/free">자유</NavLink>
              <NavLink href="/question">질문</NavLink>
              <NavLink href="/rulebook">룰북</NavLink>
              <NavLink href="/games">게임정보</NavLink>
              <NavLink href="/history">게임기록</NavLink>
            </div>
          </div>

          {/* 🔹 검색창 - 오른쪽 정렬 */}
          <div className="relative ml-auto" ref={searchRef}>
            {isSearchOpen ? (
              <input
                type="text"
                placeholder="검색어 입력..."
                className="border border-gray-300 rounded-md px-3 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-amber-800 transition-all duration-300"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <Search size={24} />
              </button>
            )}
          </div>

          {/* 🔹 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 🔹 모바일 메뉴 */}
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
export default Navbar;

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
