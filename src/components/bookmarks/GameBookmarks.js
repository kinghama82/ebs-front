"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_SERVER_HOST } from "@/api/publicapi";
import { searchGames } from "@/api/game/gameapi"; // ✅ 게임 검색 API 추가

const GameBookmarks = ({ userId }) => {
    const [bookmarks, setBookmarks] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // ✅ 게임 검색어 상태
    const [searchResults, setSearchResults] = useState([]); // ✅ 검색 결과
    const [selectedGameId, setSelectedGameId] = useState(null); // ✅ 선택된 게임 ID
    const [hasFetched, setHasFetched] = useState(false);
    const searchRef = useRef(null);

    // ✅ 북마크 목록 가져오기 (중복 요청 방지)
    useEffect(() => {
        if (!userId || hasFetched) return;
        fetchBookmarks();
        setHasFetched(true);
    }, [userId]);

    // ✅ 북마크 데이터 가져오기
    const fetchBookmarks = () => {
        axios.get(`${API_SERVER_HOST}/api/bookmarks/${userId}`)
            .then(response => {
                setBookmarks(response.data);
            })
            .catch(err => {
                console.error("❌ 게임 북마크 불러오기 실패:", err);
            });
    };

    // ✅ 게임 검색 (디바운싱 적용)
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        const debounce = setTimeout(async () => {
            try {
                const results = await searchGames(searchTerm);
                setSearchResults(results);
            } catch (error) {
                console.error("🚨 게임 검색 중 오류:", error);
            }
        }, 300);

        return () => clearTimeout(debounce);
    }, [searchTerm]);

    // ✅ 게임 북마크 추가
    const addBookmark = () => {
        if (!selectedGameId) return;

        axios.post(`${API_SERVER_HOST}/api/bookmarks`, {
            gamerId: userId,
            gameId: selectedGameId
        })
            .then(() => {
                fetchBookmarks();
                setSearchTerm("");
                setSelectedGameId(null);
                setSearchResults([]);
            })
            .catch(err => console.error("❌ 게임 북마크 추가 실패:", err));
    };

    // ✅ 게임 북마크 삭제
    const removeBookmark = (bookmarkId) => {
        axios.delete(`${API_SERVER_HOST}/api/bookmarks/${bookmarkId}`)
            .then(() => fetchBookmarks())
            .catch(err => console.error("❌ 게임 북마크 삭제 실패:", err));
    };

    return (
        <div className="p-4 dark:bg-gray-800 rounded-lg overflow-y-auto  max-h-96 overscroll-contain">

            {/* ✅ 검색창과 추가 버튼 */}
            <div className="flex items-center gap-2 -mt-4">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="게임 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 w-full rounded-lg"
                        onFocus={() => setSearchResults([])}
                        ref={searchRef}
                    />
                    {searchResults.length > 0 && (
                        <ul className="absolute left-0 top-full mt-1 w-full bg-white border shadow-lg rounded-md max-h-60 z-50">
                            {searchResults.map((game) => (
                                <li
                                    key={game.id}
                                    onClick={() => {
                                        setSearchTerm(game.gameName);
                                        setSelectedGameId(game.id);
                                        setSearchResults([]);
                                    }}
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
                <button
                    onClick={addBookmark}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg w-20 flex-shrink-0"
                >
                    추가
                </button>
            </div>

            {/* ✅ 북마크 목록 (조건문 없이 스크롤 적용) */}
            <ul className="mt-3 space-y-2  ">
                {bookmarks.map((bookmark) => (
                    <li key={bookmark.id} className="py-0.5 px-4 bg-white rounded shadow-md flex justify-between items-center">
                        <div className="flex items-center">
                            {bookmark.gameImg && (
                                <img
                                    src={`${API_SERVER_HOST}${bookmark.gameImg}`}
                                    alt={bookmark.gameName}
                                    className="w-8 h-8 object-cover rounded mr-3"
                                />
                            )}
                            <span className="font-medium">{bookmark.gameName}</span>
                        </div>
                        <button
                            onClick={() => removeBookmark(bookmark.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg"
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GameBookmarks;
