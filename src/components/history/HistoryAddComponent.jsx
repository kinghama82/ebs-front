"use client";

import { addHistory } from "@/api/history/historyApi";
import { Plus, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FetchingModal from "../common/FetchingModal";
import BasicMenu from "../menus/BasicMenu";
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

const HistoryAddComponent = () => {
    const [history, setHistory] = useState({ ...initState });
    const [fetching, setFetching] = useState(false);
    const [result, setResult] = useState(null);
    const [partyMember, setPartyMember] = useState("");
    const router = useRouter()

    const handleChangeHistory = (e) => {
        setHistory((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleChangeResult = (e) => {
        const { id } = e.target;
        setHistory((prevState) => ({
            ...prevState,
            win: id === "radio1" ? 1 : 0,
            draw: id === "radio2" ? 1 : 0,
            lose: id === "radio3" ? 1 : 0
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
    
    useEffect( () => {
        if(result){
            toast("게임기록 저장 완료",{
                description: `${result}번 저장 완료`,
                action: {
                    label: "확인",
                    onClick: () => closeModal(),
                },
            })
        }
    },[result])

    const handleResetPartyMembers = () => {
        setHistory((prev) => ({
            ...prev,
            mate: []  // 파티원 목록 초기화
        }));
    };
    

    const handleClickAdd = () => {
        if (!history.title.trim() || !history.gamer.trim() || !history.game.trim() || !history.content.trim()) {
            toast("모든 필수 입력값을 입력하세요!", { description: "빈 칸을 채워주세요." });
            return;
        }

        const formData = new FormData();
        formData.append("title", history.title);
        formData.append("content", history.content);
        formData.append("game", history.game);
        formData.append("gamer", history.gamer);
        formData.append("win", history.win);
        formData.append("draw", history.draw);
        formData.append("lose", history.lose);
        formData.append("date", history.date);
        formData.append("mate", history.mate);

        console.log(formData);
        setFetching(true);

        addHistory(formData).then((data) => {
            setFetching(false);
            setResult(data.result)
            // if(data.result){
            //     router.push('/history/1')
            // }
        });

    };

    const closeModal = () => {
        setResult(null);
        router.push('/history/1')
    };

    return (
        <>
            <BasicMenu />
            <div className="bg-gray-400 border-2 max-w-6xl mx-auto rounded mt-10 m-2 p-4 flex flex-col gap-6">
                {fetching ? <FetchingModal /> : <></>}
                {/* 제목 입력 */}
                <div className="relative flex w-full flex-wrap items-stretch border-b p-4 -mt-5">
                    <div className="w-1/12 p-4 text-center font-bold">제 목</div>
                    <input
                        className="w-[873px] ms-5 p-4 rounded border border-solid border-neutral-300 shadow-md"
                        name="title"
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={history.title}
                        onChange={handleChangeHistory}
                    />
                </div>

                {/* 작성자 입력 */}
                <div className="relative flex w-full flex-wrap items-stretch border-b p-4 -mt-5">
                    <div className="w-1/12 p-4 text-center font-bold">작성자</div>
                    <input
                        className="w-[873px] ms-5 p-4 rounded border border-solid border-neutral-300 shadow-md"
                        name="gamer"
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={history.gamer}
                        onChange={handleChangeHistory}
                    />
                </div>

                {/* 게임 검색 및 정보 */}
                <div className="relative flex w-full flex-wrap items-stretch border-b p-4 -mt-5">
                    <div className="w-1.5/12 p-4 text-start font-bold">보드 게임</div>
                    <input
                        className="w-[876px] p-4 ms-4 rounded border border-solid border-neutral-300 shadow-md"
                        name="game"
                        type="text"
                        placeholder="게임을 검색하세요"
                        value={history.game}
                        onChange={handleChangeHistory}
                    />
                    {history.game.length > 0 ? (
                        <div className="mt-2 ms-4 w-[982px] p-4 bg-gray-100 rounded">불러온 게임 정보 표시</div>
                    ) : <></>}
                </div>

                {/* 전적 및 날짜 입력 */}
                <div className="p-4 border-b grid grid-cols-2 gap-6 -mt-5">
                    <div className="flex flex-col gap-4" >
                        <div className="ms-4 flex gap-4 font-bold">전적
                            <label className="ml-6 flex items-center gap-2">
                                <input type="radio" id="radio1" checked={history.win === 1}
                                       onChange={handleChangeResult}/>
                                {" "}승(Win)
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" id="radio2" checked={history.draw === 1}
                                       onChange={handleChangeResult}/>
                                {" "}무(Draw)
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" id="radio3" checked={history.lose === 1}
                                       onChange={handleChangeResult}/>
                                {" "}패(Lose)
                            </label>
                        </div>
                        <div className="ms-4 font-bold">게임 날짜
                            <input className="ml-4 p-3 w-[295px] border border-solid border-neutral-300 shadow-md rounded"
                                   type="date" name="date" value={history.date}
                                   onChange={handleChangeHistory}/>
                        </div>
                    </div>

                    {/* 파티원 추가 입력 + 추가된 파티원 목록 */}
                    <div className="flex flex-col gap-4">
                        <div className="font-bold">파티원 추가</div>
                        {/* 입력창과 +버튼 */}
                        <div className="flex items-center gap-2">
                            <input className="w-[324px] p-3 border border-solid border-neutral-300 shadow-md rounded"
                                   type="text" placeholder="파티원 이름 입력" value={partyMember}
                                   onChange={(e) => setPartyMember(e.target.value)}/>
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
                        className="w-[982px] p-4 ml-6 rounded border border-solid border-neutral-300 shadow-md"
                        name="content"
                        rows="4"
                        placeholder="내용을 입력하세요"
                        value={history.content}
                        onChange={handleChangeHistory}
                    />
                </div>

                {/* 추가 버튼 */}
                <div className="flex justify-end mr-10 -mt-14 p-4">
                    <button type="button" className="rounded p-4 w-36 bg-blue-500 text-xl text-white"
                            onClick={handleClickAdd}>기록 저장
                    </button>
                </div>
            </div>
        </>
    );
};

export default HistoryAddComponent;
