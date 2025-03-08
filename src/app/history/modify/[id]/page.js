"use client"
import { getHistory, modifyHistory } from "@/api/history/historyApi";
import { API_SERVER_HOST } from "@/api/publicapi";
import GameBoxComponent from "@/components/common/GameBoxComponent";
import BasicMenu from "@/components/menus/BasicMenu";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";
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
const host = API_SERVER_HOST

const HistoryModifyPage = () => {
    const params = useParams()
    const id = params.id
    const router = useRouter()

    const [history, setHistory] = useState(initState)
    const [partyMember, setPartyMember] = useState("")
    const [result, setResult] = useState(null)

    useEffect(() => {
        getHistory(id).then(data => {
            setHistory({
                ...data,
                gamer: typeof data.gamer === "string" ? data.gamer : (typeof data.gamer?.id === "string" ? data.gamer.id : "")
            })
        })
    }, [id])

    useEffect(() => {
        if (result) {
            toast("게임기록 수정 완료", {
                action: {
                    label: "확인",    
                    onClick: () => closeModal()                 
                },
            })
        }
    }, [result])

    const closeModal = () => {
        setResult(null)
        router.push('/history')
    }

    const handleclickModify = () => {
        if (!history) {
            toast("데이터 오류 발생", { description: "기록을 저장할 수 없습니다." });
            return;
        }
        // 각 필수 속성들이 undefined가 아닐 때만 trim() 실행
        const title = history.title || "";
        const content = history.content || "";
        const date = history.date || "";

        console.log("현재 히스토리 상태 :",history)
        if (!title.trim() || !content.trim() || !date.trim()) {
            toast("모든 필수 입력값을 입력하세요!", { description: "빈 칸을 채워주세요." });
            return;
        }

        const formData = new FormData()
        formData.append("title", history.title)
        formData.append("content", history.content)
        formData.append("win", history.win);
        formData.append("draw", history.draw);
        formData.append("lose", history.lose);
        formData.append("date", history.date);
        formData.append("mate", history.mate);
        
        modifyHistory(id, formData).then((data)=>{
            setResult(data.result)    
            router.push('/history')        
        })
    }
    const handleChangeHistory = (e) => {
        setHistory((prev) => ({
            ...prev,
            [e.target.name]: e.target.value || ""
        }));
    };

    const handleAddPartyMember = () => {
        let newMember = partyMember.trim();

        if (!newMember) {
            // 현재 추가된 '게스트' 개수 찾기
            const guestCount = history.mate.filter(name => name.startsWith("게스트")).length;
            newMember = `게스트${guestCount + 1}`;
        }

        setHistory((prev) => ({
            ...prev,
            mate: [...prev.mate, newMember]  // 기존 배열에 새 멤버 추가
        }));

        setPartyMember(""); // 입력 필드 초기화
    };
    //파티원목록 초기화
    const handleResetPartyMembers = () => {
        setHistory((prev) => ({
            ...prev,
            mate: []
        }));
    };

    //라디오버튼
    const handleChangeResult = (e) => {
        const { id } = e.target;
        setHistory((prevState) => ({
            ...prevState,
            win: id === "radio1" ? 1 : 0,
            draw: id === "radio2" ? 1 : 0,
            lose: id === "radio3" ? 1 : 0
        }));
    };


    return (
        <>
            <BasicMenu />
            <div className="bg-gray-400 max-w-6xl mx-auto rounded mt-10 m-2 p-4 flex flex-col gap-6">

                

                {/* 플레이한 게임 */}
                <div className="-mt-10 p-4">
                    <GameBoxComponent id={history.game.id}/>
                </div>

                {/* 제목 입력 */}
                <div className="p-4 -mt-10 -ml-12 relative flex">
                    <div className="w-2/12 p-4 text-center font-bold">제 목</div>
                    <input className="w-[900px] -ml-10 relative p-4 rounded border border-solid border-neutral-300 shadow-md"
                        name="title"
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={history.title}
                        onChange={handleChangeHistory} />
                </div>

                {/* 전적 및 날짜 입력 */}
                <div className="p-4 border-b border-t grid grid-cols-2 gap-6 -mt-5">
                    <div className="flex flex-col gap-4" >
                        <div className="ms-4 flex gap-4 font-bold">전적
                            <label className="ml-6 flex items-center gap-2">
                                <input type="radio" id="radio1" name="result" checked={history.win === 1}
                                    onChange={handleChangeResult} />
                                {" "}승(Win)
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" id="radio2" name="result" checked={history.draw === 1}
                                    onChange={handleChangeResult} />
                                {" "}무(Draw)
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" id="radio3" name="result" checked={history.lose === 1}
                                    onChange={handleChangeResult} />
                                {" "}패(Lose)
                            </label>
                        </div>
                        <div className="ms-4 font-bold">게임 날짜
                            <input className="ml-4 p-3 w-[295px] border border-solid border-neutral-300 shadow-md rounded"
                                type="date" name="date" value={history.date || ""}
                                onChange={handleChangeHistory} />
                        </div>
                    </div>

                    {/* 파티원 추가 입력 + 추가된 파티원 목록 */}
                    <div className="flex  flex-col gap-4 -ml-6">
                        <div className="font-bold">파티원 추가</div>
                        {/* 입력창과 +버튼 */}
                        <div className="flex items-center gap-2">
                            <input className="w-[324px] p-3 border border-solid border-neutral-300 shadow-md rounded"
                                type="text" placeholder="파티원 이름 입력" value={partyMember}
                                onChange={(e) => setPartyMember(e.target.value)} />
                            <Plus className="rounded h-[56px] text-white w-16 bg-primary shadow-md"
                                onClick={handleAddPartyMember}>
                            </Plus>
                            <RotateCcw className="rounded h-[56px] text-white w-16 bg-primary shadow-md"
                                onClick={handleResetPartyMembers}>
                            </RotateCcw>
                        </div>

                        {/* 추가된 파티원 목록 */}
                        <div className="w-[469px] p-3 border border-solid border-neutral-300 shadow-md rounded bg-gray-100">
                            <span className="font-bold">현재 추가된 파티원:</span>
                            <ul>
                                {history.mate.length > 0
                                    ? history.mate.map((m, index) => <li key={index}>{m}</li>)
                                    : <li>파티원이 없습니다.</li>}
                            </ul>
                        </div>
                    </div>

                </div>

                {/* 메모 입력 */}
                <div className="p-4 -mt-10">
                    <div className=" font-bold p-4">메모</div>
                    <textarea
                        className="w-[960px] p-4 ml-6 rounded border border-solid border-neutral-300 shadow-md"
                        name="content"
                        rows="4"
                        placeholder="내용을 입력하세요"
                        value={history.content}
                        onChange={handleChangeHistory}
                    />
                </div>

                {/* 추가 버튼 */}
                <div className="flex justify-end mr-[72px] -mt-14 p-4">
                    <Button variant="secondary" className="text-white text-lg"
                            onClick={() => handleclickModify()}>기록 저장</Button>
                </div>
            </div>
        </>
    )
}
export default HistoryModifyPage;