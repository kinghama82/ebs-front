"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_SERVER_HOST } from "@/api/publicapi";

const FriendsList = ({ userId }) => {
    const [friends, setFriends] = useState([]);
    const [newFriendNickname, setNewFriendNickname] = useState("");

    // 친구 목록 가져오기
    useEffect(() => {
        if (!userId) return;
        fetchFriends();
    }, [userId]);

    const fetchFriends = () => {
        axios.get(`${API_SERVER_HOST}/api/friendship/${userId}`)
            .then(response => {
                console.log("✅ 친구 목록 API 응답:", response.data);
                setFriends(response.data);
            })
            .catch(err => {
                console.error("❌ 친구 목록 불러오기 실패:", err);
                setFriends([]);
            });
    };

    // 친구 추가
    const addFriend = () => {
        if (!newFriendNickname) return;

        axios.get(`${API_SERVER_HOST}/api/gamer/nickname/${encodeURIComponent(newFriendNickname)}`)
            .then(response => {
                const friendId = response.data.id;

                axios.post(`${API_SERVER_HOST}/api/friendship`, {
                    gamerId: userId,
                    friendId: friendId
                })
                    .then(response => {
                        console.log("✅ 친구 추가 성공:", response.data);
                        fetchFriends();
                    })
                    .catch(err => console.error("❌ 친구 추가 실패:", err.response?.data || err.message));
            })
            .catch(err => console.error("❌ 닉네임으로 친구 찾기 실패:", err));
    };

    // 친구 삭제
    const removeFriend = (friendId) => {
        axios.delete(`${API_SERVER_HOST}/api/friendship/${friendId}`)
            .then(() => fetchFriends())
            .catch(err => console.error("❌ 친구 삭제 실패:", err));
    };

    return (
        <div className="p-4 bg-slate-200 rounded-lg max-h-96 overflow-y-auto">
            {/* 친구 추가 입력창 */}
            <div className="flex mb-2 -mt-4">
                <input
                    type="text"
                    placeholder="닉네임 입력"
                    value={newFriendNickname}
                    onChange={(e) => setNewFriendNickname(e.target.value)}
                    className="border p-2 flex-1 rounded"
                />
                <button onClick={addFriend} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
                    추가
                </button>
            </div>

            {/* 친구 목록 출력 */}
            {friends.length > 0 ? (
                <ul>
                    {friends.map((friend) => (
                        <li key={friend.id} className="bg-white py-0.5 px-3 border-b flex justify-between items-center border-2 rounded shadow">
                            <div className="flex items-center">
                                {friend.friendNickname ? (
                                    <>
                                        <img
                                            src={friend.friendImg && friend.friendImg.trim() !== ""
                                                ? `http://localhost:8080${friend.friendImg}`  // 실제 프로필 이미지 경로
                                                : "/allIcon.png"  // 기본 프로필 이미지
                                            }
                                            alt="친구 프로필"
                                            className="w-8 h-8 object-cover rounded-full mr-3 border-1"
                                        />
                                        <span>{friend.friendNickname}</span>
                                    </>
                                ) : (
                                    <span>알 수 없는 친구</span>
                                )}
                            </div>
                            <button
                                onClick={() => removeFriend(friend.id)}
                                className="bg-red-500 text-white px-3 py-0.5 rounded me-2"
                            >
                                X
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-600">등록된 친구가 없습니다.</p>
            )}
        </div>
    );
};

export default FriendsList;
