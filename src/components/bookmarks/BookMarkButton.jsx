import { useEffect, useState } from "react";
import { Dices, Dice4 } from "lucide-react";
import { useCustomCookie } from "../common/useCustomCookie";
import axios from "axios";
import { API_SERVER_HOST } from "@/api/publicapi";

const BookMarkButton = ({ gameId }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkId, setBookmarkId] = useState(null); // 북마크 ID 저장
    const user = useCustomCookie();

    useEffect(() => {
        if (!user || !user.id) return 
        
        fetchBookmarks();
        
    }, [user, gameId]);

    // ✅ 현재 게임이 북마크 되어 있는지 확인
    const fetchBookmarks = async () => {
        if(!user || !user.id) return;
        try {
            const response = await axios.get(`${API_SERVER_HOST}/api/bookmarks/${user.id}`);
            if (Array.isArray(response.data)) { // ✅ 응답이 배열인지 확인
                const bookmarkedGame = response.data.find((bookmark) => bookmark.gameId === gameId);

                if (bookmarkedGame) {
                    setIsBookmarked(true);
                    setBookmarkId(bookmarkedGame.id); // 북마크 ID 저장 (삭제할 때 사용)
                } else {
                    setIsBookmarked(false);
                    setBookmarkId(null);
                }
            } else{
                console.error("예상치 못한 API 응답: ", response.data)
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
            // ✅ 404 에러 시 빈 배열 처리
            setIsBookmarked(false);
            setBookmarkId(null);
            } else {
            console.error("❌ 북마크 데이터 불러오기 실패:", err);
            }
        }
    };

    // 북마크 추가
    const addBookmark = async () => {
        if(!user || !user.id) return;
        try {
            const response = await axios.post(`${API_SERVER_HOST}/api/bookmarks`, {
                gamerId: user.id,
                gameId: gameId,
            });

            setIsBookmarked(true);
            setBookmarkId(response.data.id); 
        } catch (err) {
            console.error("❌ 게임 북마크 추가 실패:", err);
        }
    };

    //북마크 삭제
    const removeBookmark = async () => {
        if(!user || !user.id) return;
        if (!bookmarkId) return;

        try {
            await axios.delete(`${API_SERVER_HOST}/api/bookmarks/${bookmarkId}`);
            setIsBookmarked(false);
            setBookmarkId(null);
        } catch (err) {
            console.error("❌ 게임 북마크 삭제 실패:", err);
        }
    };

    return (
        <button onClick={isBookmarked ? removeBookmark : addBookmark}>
            {isBookmarked ? <Dices className="text-yellow-500" /> : <Dice4 />}
        </button>
    );
};

export default BookMarkButton;
