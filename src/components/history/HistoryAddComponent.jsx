"use client";

import { getGameById } from "@/api/game/gameapi";
import { addHistory } from "@/api/history/historyApi";
import { Plus, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FetchingModal from "../common/FetchingModal";
import BasicMenu from "../menus/BasicMenu";

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
    const [gameId, setGameId] = useState("")
    const [game, setGame] = useState(null)

    const handleChangeHistory = (e) => {
        setHistory((prev) => ({
            ...prev,
            [e.target.name]: e.target.value || ""
        }));
    };

    // 📌 보드게임 검색 (ID 기반)
    const handleSearchGame = async () => {
        if (!gameId.trim()) {
            toast("게임 ID를 입력하세요!", { description: "게임 ID가 필요합니다." });
            return;
        }

        try {
            const game = await getGameById(gameId) // API 호출
            setGame(game);  // 불러온 게임 정보 저장
            setHistory((prev) => ({ ...prev, game: String(game.id) })); // 게임명 자동 입력
        } catch (error) {
            console.log("API호출실패", error)
            toast("게임 정보를 찾을 수 없습니다.");
            setGame(null);
        }
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


    useEffect(() => {
        if (result) {
            toast("게임기록 저장 완료", {
                description: `${result}번 저장 완료`,
                action: {
                    label: "확인",
                    onClick: () => closeModal(),
                },
            })
        }
    }, [result])

    const handleResetPartyMembers = () => {
        setHistory((prev) => ({
            ...prev,
            mate: []  // 파티원 목록 초기화
        }));
    };


    const handleClickAdd = () => {
        // history 자체가 undefined인지 확인
        if (!history) {
        toast("데이터 오류 발생", { description: "기록을 저장할 수 없습니다." });
        return;
        }

        // 각 필수 속성들이 undefined가 아닐 때만 trim() 실행
        const title = history.title || "";
        const gamer = history.gamer || "";
        const game = history.game || "";
        const content = history.content || "";

        if (!title.trim() || !gamer.trim() || !game.trim() || !content.trim()) {
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
        router.push('/history/')
    };

    return (
        <>
            <BasicMenu />
            <div className="bg-gray-400 border-2 max-w-6xl mx-auto rounded mt-10 m-2 p-4 flex flex-col gap-6">
                {fetching ? <FetchingModal /> : <></>}
                {/* 제목 입력 */}
                <div className="relative flex w-full flex-wrap items-stretch border-b p-4 -mt-5">
                    <div className="w-2/12 p-4 text-center font-bold">제 목</div>
                    <input className="w-[850px] relative p-4 rounded border border-solid border-neutral-300 shadow-md"
                        name="title"
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={history.title}
                        onChange={handleChangeHistory} />
                </div>

                {/* 작성자 입력 */}
                <div className="relative flex w-full flex-wrap items-stretch border-b p-4 -mt-5">
                    <div className="w-2/12 p-4 text-center font-bold">작성자</div>
                    <input
                        className="w-[850px] relative p-4 rounded border border-solid border-neutral-300 shadow-md"
                        name="gamer"
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={history.gamer}
                        onChange={handleChangeHistory}
                    />
                </div>

                {/* 게임 ID 입력 및 검색 */}
                <div className="relative flex w-full flex-wrap items-stretch p-4 -mt-5">
                    <div className="w-2/12 p-4 text-center font-bold">게임검색</div>
                    <input
                        className="w-[400px] p-4 rounded border border-solid border-neutral-300 shadow-md"
                        type="text"
                        name="game"
                        placeholder="게임 ID 입력"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                    />
                    <button className="ml-4 p-4 bg-blue-500 text-white rounded shadow-md"
                        onClick={handleSearchGame}>
                        검색
                    </button>
                </div>

                {/* 검색된 게임 정보 표시 */}
                {game && (
                <div className="container p-4 mb-4 border-2 border-indigo-500 flex justify-start relative w-[982px]"
                     style={{
                        backgroundImage: `
                           linear-gradient(to right, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 40%),
                           url(http://43.202.30.85:8080${game.img})
                         `,
                        backgroundSize: '100% 100%, 30% 100%',
                        backgroundPosition: 'left, right center',
                        backgroundRepeat: 'no-repeat, no-repeat',
                        color: 'white',
                        minHeight: '300px'
                     }}
                    >
                    <div className="m-8">
                        {game.img && game.img !== "" ? (
                            <img src={`http://43.202.30.85:8080${game.img}`}
                                 alt={game.gameName}
                                 width={200}
                                 height={200}
                                 className="rounded-md"/>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center bg-gray-200 text-gray-500">
                                이미지 없음
                            </div>
                        )}
                    </div>
                    <div className="basis-2/5 mr-4 w-56 p-2">
                        <div className="flex flex-col h-20">
                            <h3 className="text-xl font-bold mb-2 border-b-2">
                                {game.gameName}
                                <div className="shrink w-56 text-sm text-gray-500 flex justify-between">
                                    {game.enGameName}
                                    <span className="text-base font-bold"> {game.year}</span>
                                </div>
                            </h3>
                        </div>
                        <div className="flex flex-row">
                            <div className="mr-4 w-56">
                                <div className="flex justify-between">
                                    <span className="font-bold">플레이어수:</span>{game.players}인
                                </div>
                                <div className="text-sm flex justify-between mb-1">
                                    <span className="text-xs">추천 플레이어수:</span>
                                    {game.bestPlayers}인
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">권장연령:</span> {game.reage}세 이상
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">게임시간:</span> {game.time}분
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">게임난이도:</span> {game.weight}min
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 w-56 ml-8">
                                <div className="flex flex-col">
                                    <div className="flex justify-between">
                                        <span className="font-bold">판매회사:</span> {game.scompany}
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-bold">판매가격:</span> {game.price}
                                    </div>
                                    <span className="font-bold text-lg mb-2 mt-2">카테고리</span>
                                    <div className="flex flex-wrap gap-2">
                                        {game.gameCategory && game.gameCategory.length > 0 ? (
                                            game.gameCategory.map((category, index) => (
                                                <span key={index}
                                                      className="px-2 py-1 bg-indigo-600 text-white rounded-md text-sm"
                                                      title={category.description}>
                                                    {category.gameCategory}
                                                </span>
                                            ))
                                        ) : (
                                            <div className="text-gray-400">카테고리 정보 없음</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )}

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
                                type="date" name="date" value={history.date}
                                onChange={handleChangeHistory} />
                        </div>
                    </div>

                    {/* 파티원 추가 입력 + 추가된 파티원 목록 */}
                    <div className="flex flex-col gap-4">
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
