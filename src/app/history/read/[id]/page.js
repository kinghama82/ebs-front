"use client";

import { deleteHistory, getHistory } from "@/api/history/historyApi";
import GameBoxComponent from "@/components/common/GameBoxComponent";
import BasicMenu from "@/components/menus/BasicMenu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
    const params = useParams();
    const id = params.id;
    const router = useRouter()

    const [history, setHistory] = useState(initState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gameId, setGameId] = useState(null)

    useEffect(() => {
        if (!id) {
            console.log("ID가 undefined이므로 API 요청을 중단합니다.");
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                const res = await getHistory(id);

                if (res) {
                    setHistory(res);
                    setGameId(res.game.id)
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

    const handleClickDelete = (id) => {
        setLoading(true)
        deleteHistory(id).then(data => {
            setLoading(false)
            router.push('/history')
            toast("게임기록 삭제 완료",{
                description: "삭제 완료",
                action: {
                    label: "확인"
                }
            })
        })
    }
    

    return (
        <>
            <BasicMenu />
            <div className="bg-gray-100 border-2 max-w-6xl mx-auto rounded mt-10 m-2 p-4 flex flex-col gap-6">
                {/* 게임정보부분 */}
                <div>
                    <h2 className="text-lg font-semibold mb-3">플레이한 게임</h2>
                    <GameBoxComponent id={gameId} />
                </div>
                {/* 제목 과 내용 */}
                <h1 className="text-xl font-bold">{history.title}</h1>
                <p className=" text-gray-700">{history.content}</p>

                {/* 전적 */}
                <div className="border-t pt-4 mt-4">
                    <h2 className="text-lg font-semibold">전적</h2>
                    <p>승리: {history.win} / 무승부: {history.draw} / 패배: {history.lose}</p>
                </div>

                {/* 파티원부분 */}
                <div className="border-t">
                    <h2 className="text-lg font-semibold">같이 플레이한 파티원</h2>
                    {history.mate.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {history.mate.map((player, index) => (
                                <li key={index}>{player}</li>
                            ))}
                        </ul>
                    ) : (<p>팀원이 없습니다.</p>)}
                </div>
            </div>

            {/* 버튼부분 */}
            <div className="mx-auto relative flex gap-2 max-w-6xl justify-end">
                <Button variant="secondary" className="font-bold shadow-md"
                        >수정</Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">삭제</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>기록 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                                한번 삭제하게되면 돌이킬 수 없어요!!<br/>
                                삭제하시나요?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500 hover:bg-red-500" onClick={() => handleClickDelete(id)}>확인</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
};

export default HistoryReadPage;