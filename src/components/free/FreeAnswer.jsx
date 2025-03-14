"use client";

import { addFreeAnswer, getFree } from "@/api/free/freeapi";
import { API_SERVER_HOST } from "@/api/publicapi";
import axios from "axios";
import { Edit, SquareX } from "lucide-react";
import { useEffect, useState } from "react";
import { useCustomCookie } from "../common/useCustomCookie";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const host = API_SERVER_HOST

export default function FreeAnswer({ id }) {
  const [answerList, setAnswerList] = useState([])
  const userInfo = useCustomCookie()
  const [content, setContent] = useState("")
  

  // 댓글 불러오기
  useEffect(() => {
    if (!id) return
    const fetchAnswer = async () => {
      try {
        const free = await getFree(id)
        console.log("현재 res : ", free.answerList)
        setAnswerList(free.answerList)
      } catch (error) {
        console.error("댓글을 불러오는 중 오류 발생:", error);
      }
    };
    fetchAnswer();
  }, [id]);

  const handleAnswerSummit = async () => {
    if(!content.trim()){
      alert("내용을 입력해 주세요.")
      return
    }
    //댓글 데이터 매칭 설정
    const newAnswer = {
      content: content,
      gamer: userInfo,
      free: id,
    }
    
    try {
      console.log("현재 댓글 내용 : ", newAnswer)
      const response = await addFreeAnswer(newAnswer)
      if (response.result === "등록 성공") {
        alert("댓글이 등록되었습니다.");
        setAnswerList((prevList) => [...prevList, response.answer])
        setContent(""); // 입력 필드 초기화
      }
    } catch (error) {
      console.error("댓글 등록 중 오류 발생:", error);
      alert("댓글 등록에 실패했습니다.");
    }
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-md">
      <h2 className="text-lg font-bold ">댓글 [ {answerList.length} ]</h2>

      {/* 댓글 리스트 */}
      <div className="mt-2 space-y-4">
        {answerList.length > 0 ? (
          answerList.map(answer => (
            <Card key={answer.id} className="p-2 -my-1">
              <div  className="p-1">
                <div className="flex items-center">
                  {/* 닉네임 */}
                  <span className="text-md text-gray-600 underline mr-2">
                    {answer.gamer?.nickname || "알수 없음"}
                  </span>

                  {/* 아이콘 버튼 컨테이너 */}
                  <div className="flex items-center space-x-2 p-1">
                    <Edit size={18} className="text-blue-500"/>
                    <SquareX size={18} className="text-red-500"/>
                  </div>
                </div>
                {/* 댓글 내용 */}
                <p className="mt-1">{answer.content}</p>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">아직 댓글이 없습니다.</p>
        )}
      </div>

      {/* 댓글 입력 */}
      <div className="mt-3">
        <textarea
          className="w-full h-16 p-2 border rounded-md"
          placeholder="댓글을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {/* 공지사항 */}
        <p className="mt-1 text-xs mb-1 text-red-500">
          명예훼손, 개인정보 유출, 분쟁 유발, 허위사실 유포 등의 글은 이용약관에 의해 제재될 수 있습니다.
        </p>
        <Button onClick={handleAnswerSummit} variant="mocha">등록</Button>
      </div>


    </div>
  );
}
