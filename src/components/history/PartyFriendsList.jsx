"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_SERVER_HOST } from "@/api/publicapi";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

const PartyFriendsList = ({ userId, onAddMember }) => {
    const [friends, setFriends] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!userId) return;

        axios.get(`${API_SERVER_HOST}/api/friendship/${userId}`)
            .then(response => setFriends(response.data))
            .catch(err => console.error("❌ 친구 목록 불러오기 실패:", err));
    }, [userId]);

    // 외부 클릭 감지하여 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <div className="relative w-10" ref={dropdownRef}>
            {/* 파티원 추가 입력창 */}
            <Button
                title="친구찾기"
                className="text-lg w-10 h-10"
                size="icon"
                variant="mocha"
                onClick={() => setShowDropdown((prev) => !prev)}
            >
                <Search/>
            </Button>
            
            {/* 친구 목록 드롭다운 */}
            {showDropdown && (
                <ul className="absolute right-0 top-full mt-2 z-10 bg-white border border-gray-300 rounded shadow-md w-48 max-h-60 overflow-y-auto">
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
