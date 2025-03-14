"use client";
import BasicMenu from "@/components/menus/BasicMenu";
import { useCustomCookie } from "@/components/common/useCustomCookie";
import { useEffect, useState } from "react";
import { getTotalRecord } from "@/api/history/historyApi";
import HistoryChart from "@/components/history/HistoryChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendsList from "@/components/friends/FriendsList";
import GameBookmarks from "@/components/bookmarks/GameBookmarks";
import { uploadProfileImage, getGamer  } from "@/api/gamerApi"; // 업로드 API 함수


const MyPage = () => {
    const user = useCustomCookie();
    const [selectedStatsTab, setSelectedStatsTab] = useState("stats");
    const [record, setRecord] = useState({ win: 0, draw: 0, lose: 0 });
    const [selectedFile, setSelectedFile] = useState(null);
    const [gamer, setUser] = useState(null);

    useEffect(() => {
        if (!user || !user.email) return;
        const fetchUser = async () => {
            try {
                const userData = await getGamer(user.email);
                setUser(userData);
            } catch (error) {
                console.error("사용자 정보 불러오기 실패:", error);
            }
        };
        fetchUser();
    }, [user]);

    // 파일 선택 시 상태에 저장
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !gamer?.email) return;

        setSelectedFile(file); // 선택된 파일을 상태로 저장 (선택적)

        try {
            const res = await uploadProfileImage(gamer.email, file);
            console.log("업로드 결과:", res);

            // 서버에서 삭제 후 새 이미지 업로드 완료 -> 새 데이터 가져오기
            const updatedUser = await getGamer(gamer.email);
            setUser(updatedUser);
        } catch (error) {
            console.error("프로필 업로드 실패:", error);
        }
    };

    /*const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };*/

    // 프로필 변경 버튼 클릭 시 업로드
    const handleProfileUpload = async () => {
        if (!selectedFile || !gamer?.email) return;

        try {
            const res = await uploadProfileImage(gamer.email, selectedFile);
            console.log("업로드 결과:", res);

            // 서버에서 삭제 후 새 이미지 업로드 완료 -> 새 데이터 가져오기
            const updatedUser = await getGamer(gamer.email);
            setUser(updatedUser);

            setSelectedFile(null);
        } catch (error) {
            console.error("프로필 업로드 실패:", error);
        }
    };

    /*const handleProfileUpload = async () => {
        if (!selectedFile || !gamer?.email) return;

        try {
            const res = await uploadProfileImage(gamer.email, selectedFile);
            console.log("업로드 결과:", res);

            // 업데이트 후, 다시 전체 사용자 정보를 가져올 때 이메일 전달
            const updatedUser = await getGamer(gamer.email);
            setUser(updatedUser);

            setSelectedFile(null);
        } catch (error) {
            console.error("프로필 업로드 실패:", error);
        }
    };*/

    return (
        <div>
            <BasicMenu />
            <div className="w-full max-w-6xl mx-auto">
                <h1 className="mt-4 text-4xl font-bold text-center">마이 페이지</h1>

                {/* 프로필 & 탭 영역 */}
                <div className="bg-white my-2 w-full flex flex-col md:flex-row md:space-x-12 justify-between h-[450px]  ">
                    {/* 유저 정보 */}
                    <div className=" w-full px-10 py-10 rounded-lg  content-center bg-no-repeat bg-cover bg-center"
                         style={{ backgroundImage: "url('/8c18_66p5_210415.jpg')",
                             backgroundSize: "700px 500px", // 배경 이미지 크기 조절
                             backgroundPosition: "center"}}>
                        {user ? (
                            <div className="m-auto flex flex-row justify-between h-72 "
                                >
                                <div >
                                    {/*<img
                                        src={
                                            user?.profileImage && user.profileImage.trim() !== ""
                                                ? `http://localhost:8080${user.profileImage}` // 백엔드 도메인 포함
                                                : "/allIcon.png" // 기본 이미지 경로
                                        }
                                        alt="프로필 이미지"
                                        className="w-44 h-44 rounded-full mx-auto border-2 border-red-700"
                                    />*/}

                                    <img
                                        src={
                                            gamer?.profileImage && gamer.profileImage.trim() !== ""
                                                ? `http://localhost:8080${gamer.profileImage}`
                                                : "/allIcon.png"
                                        }
                                        alt="프로필 이미지"
                                        className="w-44 h-44 rounded-full mx-auto border-2 border-red-700"
                                    />


                                    <h2 className=" text-center text-2xl font-semibold mt-4">{user.nickname}</h2>
                                    {/* 파일 선택 + 업로드 버튼 */}
                                    <div className="mt-4 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="profileUpload"
                                        />
                                        <button
                                            onClick={() => document.getElementById("profileUpload").click()} // 버튼 클릭 -> input 실행
                                            className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md"
                                        >
                                            프로필 변경
                                        </button>
                                    </div>
                                </div>


                                <div className=" space-y-2 text-justify text-xl justify-end w-60 ">
                                    <div className="flex justify-between">
                                        <strong>아이디:</strong> {user.email}</div>
                                    <div className="flex justify-between">
                                        <strong>이름:</strong> {user.name}</div>
                                    <div className="flex justify-between">
                                        <strong>나이:</strong> {user.age}</div>
                                    <div className="flex justify-between">
                                        <strong>전화번호:</strong> {user.phone}</div>
                                    <div className="flex justify-between">
                                        <strong>활동점수:</strong> {user.level}</div>
                                    <div className="flex justify-between">
                                        <strong>가입일:</strong> {new Date(user.createdate).toLocaleDateString()}</div>
                                    <div className="flex justify-between">
                                        <strong>주소:</strong> {user.address}</div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-lg">로그인이 필요합니다.</p>
                        )}
                    </div>

                    {/* 친구 목록 & 게임 북마크 */}
                    <aside className="bg-slate-200 w-full  rounded-lg">
                        <Tabs defaultValue="mate" className="w-full dark:bg-[#0a0b0c]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="mate">친구목록</TabsTrigger>
                                <TabsTrigger value="game">게임북마크</TabsTrigger>
                            </TabsList>
                            <TabsContent value="mate">
                                <FriendsList userId={user?.id} />
                            </TabsContent>
                            <TabsContent value="game">
                                <GameBookmarks userId={user?.id} />
                            </TabsContent>
                        </Tabs>
                    </aside>
                </div>

                {/* 내 글 / 전적통계 */}
                <div className="flex justify-start space-x-4 my-2">
                    <button
                        className={`bg-orange-100 text-black font-bold px-4 py-2 rounded-md mt-2 border ${
                            selectedStatsTab === "myletter" ? "bg-[#d5ba98] text-black" : "bg-transparent text-[#d5ba98]"
                        }`}
                        onClick={() => setSelectedStatsTab("myletter")}
                    >
                        내가 쓴 글
                    </button>
                    <button
                        className={`bg-orange-100 text-black font-bold px-4 py-2 rounded-md mt-2 border ${
                            selectedStatsTab === "stats" ? "bg-[#d5ba98] text-black" : "bg-transparent text-[#d5ba98]"
                        }`}
                        onClick={() => setSelectedStatsTab("stats")}
                    >
                        전적 통계
                    </button>
                </div>

                {/* 전적 통계 표시 */}
                {selectedStatsTab === "stats" ? (
                    <div className="bg-slate-200 w-full h-[160px] md:h-[400px]">
                        <div className="flex flex-row gap-12 rounded-md mt-6 max-w-6xl mx-auto border-1 bg-gray-300 min-h-96">
                            <div className="m-1 basis-6/12 card border-black dark:border-white dark:bg-[#0a0b0c]">
                                <div className="font-bold text-2xl text-center dark:text-white">전 적 통 계</div>
                                <div className="flex p-2 space-x-4">
                                    <div className="w-1/2 flex justify-center items-center ml-10">
                                        <HistoryChart win={record.win} draw={record.draw} lose={record.lose} />
                                    </div>
                                    <div className="w-1/2 flex flex-col justify-center items-center text-xl">
                                        <h2 className="text-xl font-bold dark:text-white">게임 전적</h2>
                                        <p className="text-gray-700 mt-2 font-bold dark:text-white">
                                            Win : <span className="text-green-500 font-semibold"> {record.win}</span> 회
                                        </p>
                                        <p className="text-gray-700 font-bold dark:text-white">
                                            Draw : <span className="text-yellow-500 font-semibold"> {record.draw}</span> 회
                                        </p>
                                        <p className="text-gray-700 font-bold dark:text-white">
                                            Lose : <span className="text-red-500 font-semibold"> {record.lose}</span> 회
                                        </p>
                                        <p className="text-gray-700 mt-3 font-bold dark:text-white">
                                            승률 :{" "}
                                            <span className="text-green-500 font-semibold">
                                                {record.win + record.draw + record.lose > 0
                                                    ? ((record.win / (record.win + record.draw + record.lose)) * 100).toFixed(1)
                                                    : 0}
                                            </span>{" "}
                                            %
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>내가 쓴 글 목록</div>
                )}
            </div>
        </div>
    );
};

export default MyPage;
