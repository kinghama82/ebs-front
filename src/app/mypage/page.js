"use client";
import BasicMenu from "@/components/menus/BasicMenu";
import { useCustomCookie } from "@/components/common/useCustomCookie";
import { useEffect, useState } from "react";
import { getTotalRecord } from "@/api/history/historyApi";
import HistoryChart from "@/components/history/HistoryChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendsList from "@/components/friends/FriendsList";
import GameBookmarks from "@/components/bookmarks/GameBookmarks";
import { uploadProfileImage, getGamer, updateGamerProfile } from "@/api/gamerApi";
import axios from "axios"; // ✅ axios 추가
import { API_SERVER_HOST } from "@/api/publicapi"; // API 서버 주소

const MyPage = () => {
    const user = useCustomCookie();
    const [selectedStatsTab, setSelectedStatsTab] = useState("myletter");
    const [record, setRecord] = useState({ win: 0, draw: 0, lose: 0 });
    const [selectedFile, setSelectedFile] = useState(null);
    const [gamer, setUser] = useState(null);
    const [newNickname, setNewNickname] = useState("");
    // 추가: 닉네임 수정 모드를 위한 상태 변수
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [posts, setPosts] = useState([]);  // ✅ posts 상태 추가
    const [comments, setComments] = useState([]); // ✅ 댓글 상태 추가


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

    useEffect(() => {
        if (!user || !user.id) return;
        getTotalRecord(user.id)
            .then(recordResponse => setRecord(recordResponse))
            .catch(error => console.error("전적 데이터 불러오기 실패:", error));
    }, [user]);

    useEffect(() => {
        if (!user || !user.id) return;

        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`${API_SERVER_HOST}/api/boards/user/${user.id}`);
                console.log("✅ 내가 쓴 글 목록:", response.data);
                setPosts(response.data);
            } catch (error) {
                console.error("❌ 게시글 불러오기 실패:", error);
                setPosts({});
            }
        };

        fetchUserPosts(); // ✅ 여기에서 실행
    }, [user]); // ✅ user가 바뀌면 실행되도록 의존성 추가

    useEffect(() => {
        if (!user || !user.id) return;

        // 댓글 데이터 가져오기
        const fetchUserComments = async () => {
            try {
                const response = await axios.get(`${API_SERVER_HOST}/api/boards/user/${user.id}/comments`);
                console.log("✅ 내가 작성한 댓글:", response.data);
                setComments(response.data);
            } catch (error) {
                console.error("❌ 댓글 불러오기 실패:", error);
                setComments({});
            }
        };

        fetchUserComments();
    }, [user]);

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


    // 프로필 변경 (이미지) 업로드
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


    // 닉네임 변경 처리
    const handleNicknameUpdate = async () => {
        if (!newNickname || !gamer?.email) return;

        try {
            // 닉네임 업데이트를 위한 데이터 준비
            const updatedData = { ...gamer, nickname: newNickname };
            await updateGamerProfile(updatedData);
            // 닉네임 업데이트 후, 다시 전체 사용자 정보를 불러옴
            const updatedUser = await getGamer(gamer.email);
            setUser(updatedUser);
            setNewNickname("");
        } catch (error) {
            console.error("닉네임 업데이트 실패:", error);
        }
    };

    return (
        <div>
            <BasicMenu />
            <div className="w-full max-w-6xl mx-auto">
                <h1 className="mt-4 text-4xl font-bold text-center">마이 페이지</h1>

                {/* 프로필 & 탭 영역 */}
                <div className="bg-white my-2 w-full flex flex-col md:flex-row md:space-x-12 justify-between h-[450px]">
                    {/* 유저 정보 */}
                    <div
                        className="w-full px-10 py-10 rounded-lg content-center bg-no-repeat bg-cover bg-center"
                        style={{
                            backgroundImage: "url('/8c18_66p5_210415.jpg')",
                            backgroundSize: "700px 500px",
                            backgroundPosition: "center",
                        }}
                    >
                        {user ? (
                            <div className="m-auto flex flex-row justify-between h-72">
                                <div>
                                    <img
                                        src={
                                            gamer?.profileImage && gamer.profileImage.trim() !== ""
                                                // ? `http://localhost:8080${gamer.profileImage}`
                                                ? `http://43.202.30.85${gamer.profileImage}`
                                                : "/allIcon.png"
                                        }
                                        alt="프로필 이미지"
                                        className="w-44 h-44 rounded-full mx-auto border-2 border-red-700"
                                    />

                                    {/* 닉네임 & 버튼들 */}
                                    <div className="mt-4 text-center">
                                        {!isEditingNickname ? (
                                            <>
                                                <h2 className="text-2xl font-semibold">
                                                    {gamer ? gamer.nickname : user.nickname}
                                                </h2>

                                                {/* 버튼 2개를 가로로 배치 */}
                                                <div className="mt-3 flex justify-center gap-2">
                                                    <button
                                                        onClick={() => setIsEditingNickname(true)}
                                                        className="px-2.5 py-1.5 bg-green-500 text-white rounded-md"
                                                    >
                                                        닉네임 수정
                                                    </button>

                                                    <div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                            id="profileUpload"
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                document.getElementById("profileUpload").click()
                                                            }
                                                            className="px-2.5 py-1.5 bg-blue-500 text-white rounded-md"
                                                        >
                                                            프로필 변경
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="mt-1 flex flex-col items-center">
                                                <input
                                                    type="text"
                                                    placeholder="새 닉네임 입력"
                                                    value={newNickname}
                                                    onChange={(e) => setNewNickname(e.target.value)}
                                                    className="border p-2 rounded mb-1"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={async () => {
                                                            await handleNicknameUpdate();
                                                            setIsEditingNickname(false);
                                                        }}
                                                        className="px-3 py-2 bg-green-500 text-white rounded-md"
                                                    >
                                                        변경 완료
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsEditingNickname(false);
                                                            setNewNickname("");
                                                        }}
                                                        className="px-3 py-2 bg-gray-500 text-white rounded-md"
                                                    >
                                                        취소
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 text-justify text-xl justify-end w-60">
                                    <div className="flex justify-between">
                                        <strong>아이디:</strong> {user.email}
                                    </div>
                                    <div className="flex justify-between">
                                        <strong>이름:</strong> {user.name}
                                    </div>
                                    <div className="flex justify-between">
                                        <strong>나이:</strong> {user.age}
                                    </div>
                                    <div className="flex justify-between">
                                        <strong>전화번호:</strong> {user.phone}
                                    </div>
                                    <div className="flex justify-between">
                                        <strong>활동점수:</strong> {user.level}
                                    </div>
                                    <div className="flex justify-between">
                                        <strong>가입일:</strong> {new Date(user.createdate).toLocaleDateString()}
                                    </div>
                                    <div className="flex justify-between">
                                        <strong className={"whitespace-nowrap"}>주소:</strong>
                                        <div className={"ms-3 text-base"} >{user.address}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-lg">로그인이 필요합니다.</p>
                        )}
                    </div>

                    {/* 친구 목록 & 게임 북마크 */}
                    <aside className="bg-slate-200 w-full rounded-lg">
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
                        댓글보기
                    </button>
                </div>

                {selectedStatsTab === "myletter" ? (
                    <div className="p-4 bg-slate-200 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">내가 쓴 글</h2>
                        {Object.keys(posts).length > 0 ? (
                            Object.entries(posts).map(([boardType, items]) => (
                                <div key={boardType} className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">
                                        {boardType.toUpperCase()} 게시판
                                    </h3>
                                    <ul>
                                        {items.map((post) => (
                                            <li key={post.id} className="py-2 border-b">
                                                <h3 className="font-semibold">{post.title}</h3>
                                                <p className="text-sm text-gray-500">{post.createdate}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">게시글이 없습니다.</p>
                        )}
                    </div>
                ) : (
                    <div className="p-4 bg-slate-200 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">내가 작성한 댓글</h2>
                        {Object.keys(comments).length > 0 ? (
                            Object.entries(comments).map(([boardType, items]) => (
                                <div key={boardType} className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">
                                        {boardType.toUpperCase()} 게시판 댓글
                                    </h3>
                                    <ul>
                                        {items.map((comment) => (
                                            <li key={comment.id} className="py-2 border-b">
                                                <p className="font-semibold">{comment.content}</p>
                                                <p className="text-sm text-gray-500">{comment.createdate}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">작성한 댓글이 없습니다.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPage;
