"use client"
import { API_SERVER_HOST } from "@/api/publicapi";
import { getQuestion } from "@/api/qustion/questionApi";
import DeleteButton from "@/components/common/DeleteButton";
import Top5 from "@/components/common/Top5";
import { useCustomCookie } from "@/components/common/useCustomCookie";
import FanswerList from "@/components/free/FreeAnswer";
import BasicMenu from "@/components/menus/BasicMenu";
import QuestionList from "@/components/qeustion/QuestionList";
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

const QuestionReadPage = () => {
    const router = useRouter()
    const params = useParams();
    const id = params.id;
    const [copied, setCopied] = useState(false);
    const userInfo = useCustomCookie()
    const [question, setQuestion] = useState(initState)
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

    //질문글 불러오기
    useEffect(() => {
        if (!id) return
        const fetchQuestion = async () => {
            try {
                const res = await getQuestion(id)
                setQuestion(res || initState)

            }
            catch (error) {
                console.error("질문글 로드 실패 : ", error)
                setQuestion(initState)
            }
        }
        fetchQuestion()

    }, [id])

    // const fileName = extractImgName(free.content)

    const handleClickDelete = async (id) => {
        return await axios.delete(`${API_SERVER_HOST}/api/question/${id}`)
    }
    const handleClickVote = async () => {
        if (!id || !userInfo?.id) {
            alert("로그인이 필요합니다.")
            return
        }
        try {
            const res = await axios.post(`${API_SERVER_HOST}/api/question/${id}/vote?gamerId=${userInfo.id}`);
            if (res.status === 200) {
                alert("추천 완료")
                const updateFree = await getQuestion(id)
                setQuestion(updateFree)
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
    const sanitizedContent = DOMPurify.sanitize(question.content, {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["allowfullscreen", "frameborder", "src"]
    });

    return (
        <>
            <BasicMenu />
            <div className="p-1">
                {/* 최상단 게시판 이름 부분 */}
                <div className="mx-auto w-full max-w-6xl dark:text-white">
                    <div className="flex justify-center text-4xl py-1"
                        style={{ marginTop: '20px', backgroundColor: 'transparent', color: '#D97706', borderBottom: '2px solid #D97706' }}>
                        <Dices size={30} />질문 게시판
                    </div>
                </div>

                {/* 중단 조회수 추천수 부분 */}
                <div className="max-w-6xl mx-auto p-2 mt-2 rounded">
                    <Top5 boardType="question" />
                </div>

                {/* 하단 상세페이지 부분 */}
                <div className="max-w-6xl mx-auto p-2 mt-2 border-b-2 border-t-2 border-amber-600">
                    {/* 헤드부분 */}
                    <div className="border-b-2 border-amber-600 justify-between p-1 flex" >
                        <span className="w-2/12 text-lg font-bold">{question.gamer.nickname}</span>
                        <span className="w-2/12 text-start text-lg">{question.createdate}</span>
                        <div>
                            <span className="w-2/12 text-end mr-8">조회 : {question.view}</span>
                            <span className="w-2/12 text-end mr-4">추천 : {question.voter.length}</span>
                        </div>
                    </div>
                    {/* 헤드 및 카테고리 목록 / 댓글 링크 */}
                    <div >
                        <div className="grid grid-cols-4 p-1">
                            <span className="col-span-3">카테고리</span>
                            <div className="grid grid-cols-2">
                                <span />
                                <div className="grid grid-cols-3">
                                    <span className="col-span-2 text-end mr-1"><Link href={'/question'}>목록 </Link> | </span>
                                    <span className="text-center"><Link href="#answerList">댓글</Link></span>
                                </div>
                            </div>
                        </div>
                        {/* 제목 내용 */}
                        <div>
                            <div className="text-3xl font-bold mt-4">{question.title}</div>
                            <div>
                                {/* ✅ 텍스트 본문 출력 */}
                                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                                    className="detail-content text-xl mt-4 p-2"
                                />

                                {/* ✅ 이미지 리스트 출력 */}
                                {question.imageList && question.imageList.length > 0 && (
                                    <div>
                                        {question.imageList.map((fileName, index) => (
                                            <img key={`${fileName}-${index}`} src={`${API_SERVER_HOST}/api/question/view/${fileName}`}
                                                alt="게시글 이미지"
                                                className="mt-4" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center">
                            <Button className="font-bold" variant="outline"
                                onClick={handleClickVote}><ThumbsUp className="text-blue-500" />{question.voter.length}</Button>
                        </div>
                        <div className="grid grid-cols-6 border-b-2 border-amber-600">
                            <div className=" grid-cols-4 flex items-center">
                                <div className="mr-2"><Link href={'/question'}>목록 </Link> | </div>
                                <div><Link href="#answerList">댓글</Link></div>
                            </div>
                            <div className="col-span-4"></div>
                            {userInfo?.id === question.gamer?.id ? (
                                <div className="flex justify-end gap-2 mb-1">
                                    <Button size="sm" className="font-bold"
                                        onClick={() => router.push(`/question/modify/${question.id}`)}>수정</Button>
                                    <DeleteButton id={question.id} onDelete={handleClickDelete}
                                        redirectTo="/question"
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
                    <FanswerList boardType="question" id={question.id} />
                </div>
            </div>
            <div className="max-w-6xl mx-auto mt-2">
                <Suspense fallback={<div>로딩 중...</div>}>
                    <QuestionList boardType="question" />
                </Suspense>

            </div>

        </>
    )
}
export default QuestionReadPage