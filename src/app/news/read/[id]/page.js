"use client";

import { getNews } from "@/api/news/newsAPI";
import { API_SERVER_HOST } from "@/api/publicapi";
import DeleteButton from "@/components/common/DeleteButton";
import Top5 from "@/components/common/Top5";
import { useCustomCookie } from "@/components/common/useCustomCookie";
import FanswerList from "@/components/free/FreeAnswer";
import NewsList from "@/components/news/NewsList";
import { Button } from "@/components/ui/button";
import axios from "axios";
import DOMPurify from "dompurify";
import { Dices, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const initState = {
    title: '',
    content: '',
    gamer: '',
    date: '',
    voter: [],
    view: 0,
    answerList: []
}

const NewsDetail = () => {
    const router = useRouter()
    const params = useParams();
    const id = params.id;
    const [copied, setCopied] = useState(false);
    const userInfo = useCustomCookie()
    const [news, setNews] = useState(initState)
    const [currentUrl, setCurrentUrl] = useState("")

    //주소복사
    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    //뉴스글 불러오기
    useEffect(() => {
        if (!id) return
        const fetchNews = async () => {
            try {
                const res = await getNews(id)
                setNews(res || initState)
            }
            catch (error) {
                console.error("News 게시글 로드 실패 : ", error)
                setNews(initState)
            }
        }
        fetchNews()
    }, [id])

    const handleClickDelete = async (id) => {
        return await axios.delete(`${API_SERVER_HOST}/api/news/${id}`)
    }
    const handleClickVote = async () => {
        if (!id || !userInfo?.id) {
            alert("로그인이 필요합니다.")
            return
        }
        try {
            const res = await axios.post(`${API_SERVER_HOST}/api/news/${id}/vote?gamerId=${userInfo.id}`);
            if (res.status === 200) {
                alert("추천 완료")
                const updateNews = await getNews(id)
                setNews(updateNews)
            }
        } catch (error) {
            alert(error.response?.data || "추천 실패")
        }
    }
    //주소복사버튼
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            alert("클립보드에 주소 복사 완료") // 2초 후 "복사됨" 문구 숨기기
        } catch (err) {
            console.error("URL 복사 실패:", err);
        }
    };
    //유튜브 iframe 설정 허용
        const sanitizedContent = DOMPurify.sanitize(news.content, {
            ADD_TAGS: ["iframe"],
            ADD_ATTR: ["allowfullscreen", "frameborder", "src"]
        });

    return (
        <>
            <div className="p-1">
                {/* 최상단 게시판 이름 부분 */}
                <div className="mx-auto w-full max-w-6xl dark:text-white">
                    <div className="flex justify-center text-4xl py-1 font-semibold"
                        style={{ marginTop: '20px', backgroundColor: 'transparent', color: '#D97706', borderBottom: '2px solid #D97706' }}>
                        <Dices size={30} />뉴스 게시판
                    </div>
                </div>

                {/* 중단 조회수 추천수 부분 */}
                <div className="max-w-6xl mx-auto p-2 mt-2 rounded">
                    <Top5 boardType="news" />
                </div>

                {/* 하단 상세페이지 부분 */}
                <div className="max-w-6xl mx-auto p-2 mt-2 border-b-2 border-t-2 border-amber-600">
                    {/* 헤드부분 */}
                    <div className="border-b-2 border-amber-600 justify-between p-1 flex" >
                        <span className="w-2/12 text-lg font-bold">{news.gamer.nickname}</span>
                        <span className="w-2/12 text-start text-lg">{news.createdate}</span>
                        <div>
                            <span className="w-2/12 text-end mr-8">조회 : {news.view}</span>
                            <span className="w-2/12 text-end mr-4">추천 : {news.voter.length}</span>
                        </div>
                    </div>
                    {/* 헤드 및 카테고리 목록 / 댓글 링크 */}
                    <div >
                        <div className="grid grid-cols-4 p-1">
                            <span className="col-span-3">[ {news.category} ]</span>
                            <div className="grid grid-cols-2">
                                <span />
                                <div className="grid grid-cols-3">
                                    <span className="col-span-2 text-end mr-1"><Link href={'/news'}>목록 </Link> | </span>
                                    <span className="text-center"><Link href="#answerList">댓글</Link></span>
                                </div>
                            </div>
                        </div>
                        {/* 제목 내용 */}
                        <div>
                            <div className="text-3xl font-bold mt-4">{news.title}</div>
                            <div>
                                {/* ✅ 텍스트 본문 출력 */}
                                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                                    className="detail-content text-xl mt-4 p-2"
                                />

                                {/* ✅ 이미지 리스트 출력 */}
                                {news.imageList && news.imageList.length > 0 && (
                                    <div>
                                        {news.imageList.map((fileName, index) => (
                                            <img key={`${fileName}-${index}`} src={`${API_SERVER_HOST}/api/news/view/${fileName}`}
                                                alt="게시글 이미지"
                                                className="mt-4" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center">
                            <Button className="font-bold" variant="outline"
                                onClick={handleClickVote}><ThumbsUp className="text-blue-500" />{news.voter.length}</Button>
                        </div>
                        <div className="grid grid-cols-6 border-b-2 border-amber-600">
                            <div className=" grid-cols-4 flex items-center">
                                <div className="mr-2"><Link href={'/news'}>목록 </Link> | </div>
                                <div><Link href="#answerList">댓글</Link></div>
                            </div>
                            <div className="col-span-4"></div>
                            {userInfo?.id === news.gamer?.id ? (
                                <div className="flex justify-end gap-2 mb-1">
                                    <Button size="sm" className="font-bold"
                                        onClick={() => router.push(`/news/modify/${news.id}`)}>수정</Button>
                                    <DeleteButton id={news.id} onDelete={handleClickDelete}
                                        redirectTo="/news"
                                        triggerButton={<Button variant="destructive" size="sm">삭제</Button>} />
                                </div>
                            ) : <></>}

                        </div>
                    </div>
                    <div className="mt-1">
                        <Button size="xs" className="mr-2 text-white"
                            onClick={() => handleCopy()}>주소복사</Button>
                        {currentUrl}
                    </div>
                </div>

                {/* 댓글리스트부분 */}
                <div id="answerList" className="max-w-6xl mx-auto bg-neutral-200 rounded p-2 bg mt-1">
                    <FanswerList boardType="news" id={news.id} />
                </div>
            </div>
            <div className="max-w-6xl mx-auto mt-2">
                <Suspense fallback={<div>로딩 중...</div>}>
                    <NewsList boardType="news" />
                </Suspense>

            </div>

        </>
    );
};

export default NewsDetail;
