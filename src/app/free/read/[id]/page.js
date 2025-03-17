"use client"
import { deleteFree, getFree } from "@/api/free/freeapi";
import { API_SERVER_HOST } from "@/api/publicapi";
import DeleteButton from "@/components/common/DeleteButton";
import Top5 from "@/components/common/Top5";
import { useCustomCookie } from "@/components/common/useCustomCookie";
import FanswerList from "@/components/free/FreeAnswer";
import FreeList from "@/components/free/FreeList";
import BasicMenu from "@/components/menus/BasicMenu";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Dices, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import DOMPurify from "dompurify"

const initState = {
    title: '',
    content: '',
    gamer: '',
    date: '',
    voter: [],
    view: 0,
    answerList: []
}

const FreeReadPage = () => {
    const router = useRouter()
    const params = useParams();
    const id = params.id;
    const [copied, setCopied] = useState(false);
    const userInfo = useCustomCookie()
    const [free, setFree] = useState(initState)
    const [currentUrl, setCurrentUrl] = useState("")

    // //정확한 파일이름
    // const extractImgName = (htmlContent) => {
    //     const doc = new DOMParser().parseFromString(htmlContent, "text/html")
    //     const imgTag = doc.querySelector("img")
    //     if (imgTag) {
    //         let src = imgTag.getAttribute("src")
    //         return src.split("/").pop()
    //     }
    //     return null
    // }



    //주소복사
    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    //자게글 불러오기
    useEffect(() => {
        if (!id) return
        const fetchFree = async () => {
            try {
                const res = await getFree(id)
                setFree(res || initState)

            }
            catch (error) {
                console.error("Free 게시글 로드 실패 : ", error)
                setFree(initState)
            }
        }
        fetchFree()

    }, [id])

    // const fileName = extractImgName(free.content)

    const handleClickDelete = async (id) => {
        return await deleteFree(id)
    }
    const handleClickVote = async () => {
        if (!id || !userInfo?.id) {
            alert("로그인이 필요합니다.")
            return
        }
        try {
            const res = await axios.post(`${API_SERVER_HOST}/api/free/${id}/vote?gamerId=${userInfo.id}`);
            if (res.status === 200) {
                alert("추천 완료")
                const updateFree = await getFree(id)
                setFree(updateFree)
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
    return (
        <>
            <BasicMenu />
            <div className="p-1">
                {/* 최상단 게시판 이름 부분 */}
                <div className="mx-auto w-full max-w-6xl dark:text-white">
                    <div className="flex justify-center text-4xl py-1"
                        style={{ marginTop: '20px', backgroundColor: 'transparent', color: '#D97706', borderBottom: '2px solid #D97706' }}>
                        <Dices size={30} />자유 게시판
                    </div>
                </div>

                {/* 중단 조회수 추천수 부분 */}
                <div className="max-w-6xl mx-auto p-2 mt-2 rounded">
                    <Top5 boardType="free" />
                </div>

                {/* 하단 상세페이지 부분 */}
                <div className="max-w-6xl mx-auto p-2 mt-2 border-b-2 border-t-2 border-amber-600">
                    {/* 헤드부분 */}
                    <div className="border-b-2 border-amber-600 justify-between p-1 flex" >
                        <span className="w-2/12 text-lg font-bold">{free.gamer.nickname}</span>
                        <span className="w-2/12 text-start text-lg">{free.createdate}</span>
                        <div>
                            <span className="w-2/12 text-end mr-8">조회 : {free.view}</span>
                            <span className="w-2/12 text-end mr-4">추천 : {free.voter.length}</span>
                        </div>
                    </div>
                    {/* 헤드 및 카테고리 목록 / 댓글 링크 */}
                    <div >
                        <div className="grid grid-cols-4 p-1">
                            <span className="col-span-3">카테고리</span>
                            <div className="grid grid-cols-2">
                                <span />
                                <div className="grid grid-cols-3">
                                    <span className="col-span-2 text-end mr-1"><Link href={'/free'}>목록 </Link> | </span>
                                    <span className="text-center"><Link href="#answerList">댓글</Link></span>
                                </div>
                            </div>
                        </div>
                        {/* 제목 내용 */}
                        <div>
                            <div className="text-3xl font-bold mt-4">{free.title}</div>
                            <div>
                                {/* ✅ 텍스트 본문 출력 */}
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(free.content) }}
                                    className="detail-content text-xl mt-4 p-2"
                                />

                                {/* ✅ 이미지 리스트 출력 */}
                                {free.imageList && free.imageList.length > 0 && (
                                    <div>
                                        {free.imageList.map((fileName, index) => (
                                            <img key={`${fileName}-${index}`} src={`${API_SERVER_HOST}/api/free/view/${fileName}`}
                                                alt="게시글 이미지"
                                                className="mt-4" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center">
                            <Button className="font-bold" variant="outline"
                                onClick={handleClickVote}><ThumbsUp className="text-blue-500" />{free.voter.length}</Button>
                        </div>
                        <div className="grid grid-cols-6 border-b-2 border-amber-600">
                            <div className=" grid-cols-4 flex items-center">
                                <div className="mr-2"><Link href={'/free'}>목록 </Link> | </div>
                                <div><Link href="#answerList">댓글</Link></div>
                            </div>
                            <div className="col-span-4"></div>
                            {userInfo?.id === free.gamer?.id ? (
                                <div className="flex justify-end gap-2 mb-1">
                                    <Button size="sm" className="font-bold"
                                        onClick={() => router.push(`/free/modify/${free.id}`)}>수정</Button>
                                    <DeleteButton id={free.id} onDelete={handleClickDelete}
                                        redirectTo="/free"
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
                    <FanswerList boardType="free" id={free.id} />
                </div>
            </div>
            <div className="max-w-6xl mx-auto mt-2">
                <Suspense fallback={<div>로딩 중...</div>}>
                    <FreeList boardType="free" />
                </Suspense>

            </div>

        </>
    )
}
export default FreeReadPage;