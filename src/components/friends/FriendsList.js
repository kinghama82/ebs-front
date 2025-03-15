"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_SERVER_HOST } from "@/api/publicapi";

const FriendsList = ({ userId }) => {
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);
    const searchRef = useRef(null);

    // 친구 목록 가져오기 (중복 요청 방지)
    useEffect(() => {
        if (!userId || hasFetched) return;
        fetchFriends();
        setHasFetched(true);
    }, [userId]);

    // 실제 친구 목록 데이터 요청
    const fetchFriends = () => {
        axios.get(`${API_SERVER_HOST}/api/friendship/${userId}`)
            .then(response => {
                setFriends(response.data);
            })
            .catch(err => {
                console.error("친구 목록 불러오기 실패:", err);
                setFriends([]);
            });
    };

    // 닉네임 부분 검색 (디바운싱)
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        const debounce = setTimeout(async () => {
            try {
                const response = await axios.get(`${API_SERVER_HOST}/api/gamer/search`, {
                    params: { nickname: searchTerm }
                });
                setSearchResults(response.data);
            } catch (error) {
                console.error("닉네임 검색 중 오류:", error);
            }
        }, 300);

        return () => clearTimeout(debounce);
    }, [searchTerm]);

    // 친구 추가: 선택된 친구의 id로 추가
    const addFriend = () => {
        if (!selectedFriend) return;

        // 중복 체크
        if (friends.some(f => f.friendId === selectedFriend.id)) {
            alert("이미 등록된 친구입니다.");
            return;
        }

        axios.post(`${API_SERVER_HOST}/api/friendship`, {
            gamerId: userId,
            friendId: selectedFriend.id
        })
            .then(() => {
                fetchFriends();
                setSearchTerm("");
                setSelectedFriend(null);
                setSearchResults([]);
            })
            .catch(err => console.error("친구 추가 실패:", err.response?.data || err.message));
    };

    // 친구 삭제
    const removeFriend = (friendshipId) => {
        axios.delete(`${API_SERVER_HOST}/api/friendship/${friendshipId}`)
            .then(() => fetchFriends())
            .catch(err => console.error("친구 삭제 실패:", err));
    };

    return (
        <div className="p-4 dark:bg-gray-800 rounded-lg overflow-y-auto max-h-96 overscroll-contain">

            {/* ✅ 검색창과 추가 버튼 (GameBookmarks와 동일한 구조) */}
            <div className="flex items-center gap-2 -mt-4">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="닉네임 입력"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSelectedFriend(null);
                        }}
                        className="border p-2 w-full rounded-lg"
                        ref={searchRef}
                    />
                    {/* 검색 결과 드롭다운 */}
                    {searchResults.length > 0 && (
                        <ul className="absolute left-0 top-full mt-1 w-full bg-white border shadow-lg rounded-md max-h-60 z-50">
                            {searchResults.map((result) => (
                                <li
                                    key={result.id}
                                    onClick={() => {
                                        setSearchTerm(result.nickname);
                                        setSelectedFriend(result);
                                        setSearchResults([]);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                >
                                    {result.profileImage && result.profileImage.trim() !== "" ? (
                                        <img
                                            src={`http://43.202.30.85:8080${result.profileImage}`}
                                            // src={`http://localhost:8080${result.profileImage}`}
                                            alt="프로필 이미지"
                                            className="w-8 h-8 rounded-full object-cover mr-2"
                                        />
                                    ) : (
                                        <img
                                            src="/allIcon.png"
                                            alt="기본 프로필"
                                            className="w-8 h-8 rounded-full object-cover mr-2"
                                        />
                                    )}
                                    <span>{result.nickname}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button
                    onClick={addFriend}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg w-20 flex-shrink-0"
                >
                    추가
                </button>
            </div>

            {/* ✅ 친구 목록 (북마크 목록과 유사한 구조) */}
            <ul className="mt-3 space-y-2">
                {friends.length > 0 ? (
                    friends.map((friend) => (
                        <li
                            key={friend.id}
                            className="py-0.5 px-4 bg-white rounded shadow-md flex justify-between items-center"
                        >
                            <div className="flex items-center">
                                {friend.friendImg && friend.friendImg.trim() !== "" ? (
                                    <img
                                        // src={`http://localhost:8080${friend.friendImg}`}
                                        src={`http://43.202.30.85:8080${result.profileImage}`}
                                        alt="친구 프로필"
                                        className="w-8 h-8 object-cover rounded-full mr-3"
                                    />
                                ) : (
                                    <img
                                        src="/allIcon.png"
                                        alt="기본 프로필"
                                        className="w-8 h-8 rounded-full object-cover mr-3"
                                    />
                                )}
                                <span>{friend.friendNickname}</span>
                            </div>
                            <button
                                onClick={() => removeFriend(friend.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-lg"
                            >
                                X
                            </button>
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-600">등록된 친구가 없습니다.</p>
                )}
            </ul>
        </div>
    );
};

export default FriendsList;
