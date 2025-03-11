"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_SERVER_HOST } from "@/api/publicapi";

const PartyFriendsList = ({ userId, onAddMember }) => {
    const [friends, setFriends] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (!userId) return;

        axios.get(`${API_SERVER_HOST}/api/friendship/${userId}`)
            .then(response => setFriends(response.data))
            .catch(err => console.error("❌ 친구 목록 불러오기 실패:", err));
    }, [userId]);

    return (
        <div className="relative w-full">
            {/* 파티원 추가 입력창 */}
            <input
                type="text"
                placeholder="파티원 선택 (클릭)"
                className="w-full p-3 border border-solid border-neutral-300 shadow-md rounded cursor-pointer"
                onFocus={() => setShowDropdown(true)}
                readOnly
            />
            
            {/* 친구 목록 드롭다운 */}
            {showDropdown && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md mt-1 max-h-60 overflow-y-auto">
                    {friends.length > 0 ? friends.map((friend) => (
                        <li
                            key={friend.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                onAddMember(friend.friendNickname);
                                setShowDropdown(false);
                            }}
                        >
                            {friend.friendNickname}
                        </li>
                    )) : (
                        <li className="p-2 text-gray-500">친구가 없습니다.</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default PartyFriendsList;
