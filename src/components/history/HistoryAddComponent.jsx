"use client";

import { searchGames } from "@/api/game/gameapi";
import { addHistory } from "@/api/history/historyApi";
import { Plus, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FetchingModal from "../common/FetchingModal";
import GameBoxComponent from "../common/GameBoxComponent";
import { useCustomCookie } from "../common/useCustomCookie";
import PartyFriendsList from "./PartyFriendsList";
import { Button } from "../ui/button";

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
    const [keyword, setKeyword] = useState("")
    const [games, setGames] = useState([])
    const [selectedGame, setSelectedGame] = useState(null)


    const userInfo = useCustomCookie()

    const handleChangeHistory = (e) => {
        setHistory((prev) => ({
            ...prev,
            [e.target.name]: e.target.value || ""
        }));
    };

    // 📌 보드게임 검색 (ID 기반)
    const handleSearchGame = async () => {
        console.log("검색어 : ", keyword)
        if (!keyword.trim()) {
            toast("검색어를 입력하세요!", { description: "검색어가 필요합니다." });
            return;
        }

        try {
            const game = await searchGames(keyword) // API 호출
            setGames(game);  // 불러온 게임 목록 저장
            // setHistory((prev) => ({ ...prev, game: String(game[0].id) })); // 게임명 자동 입력
        } catch (error) {
            console.log("API호출실패", error)
            toast("게임 정보를 찾을 수 없습니다.");
            setGames([]);
        }
    };

    // 게임 선택 시 해당 게임 정보 반영
    const handleSelectGame = (game) => {
        setSelectedGame(game);
        setHistory((prev) => ({ ...prev, game: String(game.id) })) // 게임 id 저장
        setGames([]);  // 검색 결과 초기화
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

    //파티원 추가 부분(직접 입력)
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

    // 친구 목록에서 선택하여 파티원 추가
    const handleSelectFriend = (friendNickname) => {
        setHistory((prev) => ({
            ...prev,
            mate: [...prev.mate, friendNickname]
        }));
    };


    useEffect(() => {
        if (result) {
            toast("게임기록 저장 완료", {
                description: `${result}번 저장 완료`,
                action: "확인",

            })
        }
    }, [result])

    //파티원목록 초기화
    const handleResetPartyMembers = () => {
        setHistory((prev) => ({
            ...prev,
            mate: []
        }));
    };


    //기록저장 버튼 클릭후 수행 부분
    const handleClickAdd = () => {
        console.log("현재 userinfo.id 정보 : ", userInfo?.id)
        // history 자체가 undefined인지 확인
        if (!history) {
            toast("데이터 오류 발생", { description: "기록을 저장할 수 없습니다." });
            return;
        }

        // 각 필수 속성들이 undefined가 아닐 때만 trim() 실행
        const title = history.title || "";
        const game = history.game || "";
        const content = history.content || "";
        const date = history.date || "";

        if (!title.trim() || !game.trim() || !content.trim() || !date.trim()) {
            toast("모든 필수 입력값을 입력하세요!", { description: "빈 칸을 채워주세요." });
            return;
        }

        console.log("현재 히스토리 : ", history)
        const formData = new FormData();
        formData.append("title", history.title);
        formData.append("content", history.content);
        formData.append("game", history.game);
        formData.append("gamer", userInfo.id);
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

            router.push(`/history?page=1&size=10&gamerid=${userInfo.id}`)

        });

    };

    const closeModal = () => {
        setResult(null);

    };

    return (
        <>
            <div className="bg-neutral-200 border-t-2 border-b-2 border-amber-600 max-w-6xl mx-auto mt-2">
                {fetching ? <FetchingModal /> : <></>}
                {/* 제목 입력 */}
                <div className=" w-full p-4">
                    <input className="w-full relative p-3 rounded border-2 border-gray-400 shadow-md"
                        name="title"
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={history.title}
                        onChange={handleChangeHistory} />
                </div>


                {/* 게임 ID 입력 및 검색 */}
                <div className="relative flex w-full p-3 -mt-4">
                    <div className="w-1/12 items-center flex p-2 text-lg font-bold">게임검색</div>
                    <input
                        className="w-[300px] p-2 rounded border-2 border-gray-400 shadow-md ml-2"
                        type="text"
                        name="game"
                        placeholder="검색어 입력"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <Button size="lg" variant="mocha" className="ml-2 p-4 text-lg text-white rounded shadow-md "
                        onClick={handleSearchGame}>
                        검색
                    </Button>
                </div>

                {/* 검색된 게임 목록 표시 */}
                {games.length > 0 ? (

                    <div className="w-full p-4 -mt-8">
                        <div className="card border-2 border-amber-600 ">
                            <div className="font-bold p-2" >게임검색 결과</div>
                            {games.map((game) => (
                                <div key={game.id}
                                    className="cursor-pointer p-2 border border-neutral-300 hover:bg-blue-300"
                                    onClick={() => handleSelectGame(game)}                                    >
                                    {game.gameName}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (<></>)}

                {/* 검색된 게임 정보 표시 */}
                <div className="p-4 -mt-4">
                    {selectedGame && <GameBoxComponent id={selectedGame.id} />}
                </div>
                

                {/* 전적 및 날짜 입력 */}
                <div className=" border-black grid grid-cols-2 gap-6 -mt-1">
                    <div className="flex flex-col gap-4" >
                        <div className="ms-4 flex gap-4 font-bold text-xl">전적
                            <label className="ml-9 flex items-center gap-2 text-green-500">
                                <input type="radio" id="radio1" name="result" checked={history.win === 1}
                                       onChange={handleChangeResult}/>
                                {" "}승(Win)
                            </label>
                            <label className="flex items-center gap-2 text-yellow-600">
                                <input type="radio" id="radio2" name="result" checked={history.draw === 1}
                                    onChange={handleChangeResult} />
                                {" "}무(Draw)
                            </label>
                            <label className="flex items-center gap-2 text-red-500">
                                <input type="radio" id="radio3" name="result" checked={history.lose === 1}
                                    onChange={handleChangeResult} />
                                {" "}패(Lose)
                            </label>
                        </div>
                        {/* 날짜달력부분 */}
                        <div className="ms-4 font-bold text-xl"
                            onClick={() => document.getElementById("game-date-input").showPicker()}>게임날짜
                            <input className="ml-5 p-2 w-[300px] border-2 text-lg border-gray-400 shadow-md rounded"
                                type="date" name="date"
                                value={history.date}
                                id="game-date-input"
                                onChange={handleChangeHistory} />
                        </div>
                    </div>

                    {/* 파티원 추가 입력 + 추가된 파티원 목록 */}
                    <div className="flex flex-col gap-4">
                        <div className="font-bold text-xl border border-black">파티원 추가</div>

                        

                        {/* 파티원직접입력 */}
                        <div className="grid grid-cols-4 items-center gap-2 border-black border" >
                            <input className="w-[300px] col-span-3 p-3 border-2 border-gray-400 shadow-md rounded"
                                type="text" placeholder="파티원 이름 입력" value={partyMember}
                                onChange={(e) => setPartyMember(e.target.value)} />
                            <div className="border border-black">
                                <span><PartyFriendsList userId={userInfo?.id} onAddMember={handleSelectFriend} /></span>
                                {/* 파티원추가버튼 */}    
                                <span><Plus className="rounded h-10 text-white w-10 bg-primary shadow-md"
                                            onClick={handleAddPartyMember}/></span>
                                
                            
                            {/* 파티원초기화버튼 */}
                            <RotateCcw className="rounded h-[56px] text-white w-16 bg-primary shadow-md"
                                onClick={handleResetPartyMembers}>
                            </RotateCcw>
                            </div>
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
                    <div className=" font-bold p-4 text-2xl">메모</div>
                    <textarea
                        className="w-[982px] p-4 ml-6 rounded border border-solid border-gray-300 shadow-md"
                        name="content"
                        rows="4"
                        placeholder="내용을 입력하세요"
                        value={history.content}
                        onChange={handleChangeHistory}
                    />
                </div>



            </div>
            {/* 추가 버튼 */}
            {userInfo ?
                <div className="flex justify-end mr-10 p-4">
                    <Button variant="mocha" className="p-4 text-xl text-white"
                        onClick={handleClickAdd}>기록 저장
                    </Button>
                </div>
                : <></>}
        </>
    );
};

export default HistoryAddComponent;
