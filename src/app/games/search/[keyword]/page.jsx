"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchGames } from "@/api/game/gameapi"; // ✅ 검색 API 호출
import Link from "next/link";
import {API_SERVER_HOST} from "@/api/publicapi";

const SearchBar = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]); // ✅ 검색 결과 저장
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();

    // ✅ 검색어 입력 시 API 호출 (디바운싱 적용)
    useEffect(() => {
        if (!searchKeyword.trim()) {
            setSearchResults([]);
            setIsDropdownOpen(false);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            try {
                const results = await searchGames(searchKeyword);
                setSearchResults(results);
                setIsDropdownOpen(results.length > 0);
            } catch (error) {
                console.error("🚨 검색 중 오류:", error);
            }
        }, 300); // ✅ 300ms 디바운싱 적용

        return () => clearTimeout(delayDebounce);
    }, [searchKeyword]);

    // ✅ 검색 결과 클릭 시 해당 게임 페이지로 이동
    const handleSelectGame = (gameId) => {
        router.push(`/games/${gameId}`);
        setIsDropdownOpen(false);
        setSearchKeyword("");
    };

    return (
        <div className="relative w-64">
            {/* 검색 입력창 */}
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
                <Search size={18} className="text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="게임 검색..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="flex-1 focus:outline-none"
                />
                {searchKeyword && (
                    <button onClick={() => setSearchKeyword("")} className="ml-2">
                        <X size={18} className="text-gray-500" />
                    </button>
                )}
            </div>

            {/* 드롭다운 검색 결과 */}
            {isDropdownOpen && (
                <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-300 shadow-lg rounded-md z-50">
                    {searchResults.map((game) => (
                        <li
                            key={game.id}
                            onClick={() => handleSelectGame(game.id)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        >
                            {game.img && (
                                <img
                                    src={`${API_SERVER_HOST}${game.img}`}
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
    );
};

export default SearchBar;
