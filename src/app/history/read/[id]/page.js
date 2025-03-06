"use client";

import BasicMenu from "@/components/menus/BasicMenu";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";  // ✅ 수정: useRouter 대신 useParams 사용
import { getHistory } from "@/api/history/historyApi";

const initState = {
    title: '',
    content: '',
    win: 0,
    draw: 0,
    lose: 0,
    mate: [],
    game: '',
    gamer: '',
    date: ''
};

const HistoryReadPage = () => {
    const params = useParams();  // ✅ URL에서 id 가져오기
    const id = params.id;  

    const [history, setHistory] = useState(initState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            console.log("ID가 undefined이므로 API 요청을 중단합니다.");
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {                
                const data = await getHistory(id);
                
                if (data) {
                    setHistory(data);
                } else {
                    console.log("API에서 반환된 데이터가 null 또는 undefined입니다.");
                    setError("데이터를 불러오지 못했습니다.");
                }
            } catch (err) {
                console.error("API 요청 실패:", err);
                setError("데이터를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [id]);

    if (loading) return <p className="text-center mt-10">로딩 중...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <>
            <BasicMenu />
            <div className="bg-gray-100 border-2 max-w-6xl mx-auto rounded mt-10 m-2 p-4 flex flex-col gap-6">
                <div className="pt-4 mt-4">
                    <p><strong>게임:</strong> {history.game.gameName}</p>
                    <p><strong>플레이어:</strong> {history.gamer.nickName}</p>
                    <p><strong>날짜:</strong> {history.date}</p>
                </div>
                <h1 className="text-xl font-bold">{history.title || "제목 없음"}</h1>
                <p className="text-gray-700">{history.content || "내용이 없습니다."}</p>

                

                <div className="border-t pt-4 mt-4">
                    <h2 className="text-lg font-semibold">전적</h2>
                    <p>승리: {history.win} / 무승부: {history.draw} / 패배: {history.lose}</p>
                </div>

                <div className="border-t pt-4 mt-4">
                    <h2 className="text-lg font-semibold">팀원</h2>
                    {history.mate.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {history.mate.map((player, index) => (
                                <li key={index}>{player}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>팀원이 없습니다.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default HistoryReadPage;
