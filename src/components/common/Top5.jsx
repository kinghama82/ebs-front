"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Flame, Dice1, Dice2, Dice3, ThumbsUp, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_SERVER_HOST } from "@/api/publicapi";

const rankingIcons = [
    <Dice1 key={1} size={24} color="#E6C200" />, // 1위 - 금메달
    <Dice2 key={2} size={24} color="#C0C0C0" />, // 2위 - 은메달
    <Dice3 key={3} size={24} color="#CD7F32" />, // 3위 - 동메달
];

export default function Top5({ boardType }) {
    const [topView, setTopView] = useState([]);
    const [topVote, setTopVote] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetchTopPosts();
    }, [boardType]);

    const fetchTopPosts = async () => {
        try {
            const [viewRes, voteRes] = await Promise.all([
                axios.get(`${API_SERVER_HOST}/api/${boardType}/view5`),
                axios.get(`${API_SERVER_HOST}/api/${boardType}/vote5`),
            ]);
            setTopView(viewRes.data);
            setTopVote(voteRes.data);
        } catch (error) {
            console.error("TOP5 데이터 불러오기 실패:", error);
        }
    };

    const handlePostClick = (id) => {
        router.push(`/${boardType}/read/${id}`);
    };

    return (
        <div className="grid grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
            {/* 추천수 TOP5 */}
            <div className="p-4 border-2 border-gray-300 rounded-lg shadow-md bg-white">
                <h2 className="text-xl font-bold flex justify-center items-center">
                    추천수 TOP5 <Flame size={24} color="red" className="ml-2" />
                </h2>
                <TopList list={topVote} handleClick={handlePostClick} type="vote" />
            </div>

            {/* 조회수 TOP5 */}
            <div className="p-4 border-2 border-gray-300 rounded-lg shadow-md bg-white">
                <h2 className="text-xl font-bold flex justify-center items-center">
                    조회수 TOP5 <Flame size={24} color="red" className="ml-2" />
                </h2>
                <TopList list={topView} handleClick={handlePostClick} type="view" />
            </div>
        </div>
    );
}

const TopList = ({ list, handleClick, type }) => {
    return (
        <ul>
            {list.map((post, index) => (
                <li key={post.id} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center">
                        <span className="text-lg font-semibold mr-3">
                            {index < 3 ? rankingIcons[index] : (
                                <span className="text-lg font-bold ml-2">{index + 1}</span>
                            )}
                        </span>
                        <span 
                            className="cursor-pointer text-blue-600 hover:underline truncate w-48"
                            onClick={() => handleClick(post.id)}
                        >
                            {post.title}&nbsp;[ {post.answerList.length} ]
                        </span>
                    </div>
                    {/* 추천수 TOP5 → 추천수만 표시 */}
                    {type === "vote" && (
                        <span className="text-sm text-black grid-cols-2 grid">
                            <ThumbsUp className="text-blue-500" size={18}/>&nbsp;{post.voter?.length || 0}
                        </span>
                    )}
                    {/* 조회수 TOP5 → 조회수만 표시 */}
                    {type === "view" && (
                        <span className="text-sm text-black grid grid-cols-2">
                            <Eye className="text-red-500" size={18}/>&nbsp;{post.view || 0}
                        </span>
                    )}
                </li>
            ))}
        </ul>
    );
};
