"use client";

import { useEffect, useState } from "react";
import { Edit, SquareX } from "lucide-react";
import { useCustomCookie } from "../common/useCustomCookie";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import DeleteButton from "../common/DeleteButton";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function FanswerList({ id, boardType }) {
  const [answerList, setAnswerList] = useState([]);
  const userInfo = useCustomCookie();
  const [content, setContent] = useState("");
  const router = useRouter()

  // API 엔드포인트 설정 (동적 게시판 대응)
  const API_HOST = `http://localhost:8080/api/${boardType}`;

  // 댓글 불러오기
  useEffect(() => {
    if (!id) return;
    const fetchAnswers = async () => {
      try {
        const res = await axios.get(`${API_HOST}/${id}/answers`);
        console.log("현재 댓글 리스트 : ", res.data)
        setAnswerList(res.data || []);
      } catch (error) {
        console.error(`${boardType} 게시판 댓글 불러오기 실패:`, error);
      }
    };
    fetchAnswers();
  }, [id, boardType]);

  // 댓글 등록
  const handleAnswerSubmit = async () => {
    if (!content.trim()) {
      alert("내용을 입력해 주세요.");
      return;
    }

    const { createdate, ...safeGamer } = userInfo;

    const newAnswer = {
      content: content,
      gamer: safeGamer,
      [`${boardType}`]: id,
    };

    try {
      const response = await axios.post(`${API_HOST}/answers/`, newAnswer, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.result === "등록 성공") {
        alert("댓글이 등록되었습니다.");
        setAnswerList((prevList) => [...prevList, response.data.answer]);
        setContent("");
      }
    } catch (error) {
      console.error(`${boardType} 게시판 댓글 등록 실패:`, error);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const handleAnswerDelete = async (id) => {
    try {
      await axios.delete(`${API_HOST}/answers/${id}`);
      setAnswerList((prevList) => prevList.filter((answer) => answer.id !== id));
    } catch (error) {
      console.error(`${boardType} 게시판 댓글 삭제 실패:`, error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-md">
      <h2 className="text-lg font-bold">댓글 [ {answerList.length} ]</h2>

      {/* 댓글 리스트 */}
      <div className="mt-2 space-y-4">
        {answerList.length > 0 ? (
          answerList.map((answer) => (
            <Card key={answer.id} className="p-2 -my-1">
              <div className="p-1">
                <div className="flex items-center">
                  <span className="text-md text-black mr-2">
                    {answer.gamer?.nickname || "알수 없음"}
                  </span>
                  {userInfo?.id === answer.gamer?.id ? (
                    <div className="flex items-center space-x-2 p-1">
                      <Edit size={18} className="text-blue-500" />
                      <DeleteButton
                        id={answer.id}
                        onDelete={() => handleAnswerDelete(answer.id)}
                        triggerButton={<SquareX size={18} className="text-red-500 cursor-pointer" />} />
                    </div>
                  ) : (<></>)}

                  <span className="text-sm text-gray-400">({answer.createdate})</span>
                </div>
                <p className="mt-1">{answer.content}</p>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">아직 댓글이 없습니다.</p>
        )}
      </div>

      {/* 댓글 입력 */}
      {userInfo?.id ? (
        <div className="mt-3 grid grid-cols-10 gap-2">
          <textarea className="w-full h-16 p-2 border rounded-md col-span-9"
                    placeholder="댓글을 입력하세요..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)} />
          <Button onClick={handleAnswerSubmit} variant="mocha" className="h-full text-md">
            댓글<br />등록
          </Button>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-10 gap-2">
          <textarea className="w-full h-16 p-2 border rounded-md col-span-9"
                    placeholder="댓글을 입력하세요..." disabled/>
          <Button onClick={()=> {
            alert("로그인이 필요합니다")
            router.push('/gamer')
          }} variant="mocha" className="h-full text-md">
            댓글<br />등록
          </Button>
        </div>
      )}

      <p className="mt-1 text-xs mb-1 text-red-500">
        명예훼손, 개인정보 유출, 분쟁 유발, 허위사실 유포 등의 글은 이용약관에 의해 제재될 수 있습니다.
      </p>
    </div>
  );
}
