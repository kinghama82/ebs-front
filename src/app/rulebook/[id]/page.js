'use client'

import React, { useEffect, useState } from "react";
import BasicMenu from "@/components/menus/BasicMenu";
import axios from "axios";
import { X } from 'lucide-react';
import AnswerList from "@/components/common/AnswerList"
import AnswerForm from "@/components/common/AnswerForm";
import {useCustomCookie} from "@/components/common/useCustomCookie";
import {router} from "next/client";
import { useRouter } from "next/navigation";

const PostDetailPage = () => {
  const [ruleDetail, setRuleDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const [answers, setAnswers] = useState([]); // 답글 목록 상태 추가
     const [isVoted, setIsVoted] = useState(false); // 추천 여부 상태 추가
    const userInfo = useCustomCookie();
    const router = useRouter();

  useEffect(() => {
    const url = window.location.href;
    const idFromUrl = url.split("/").pop();
    setId(idFromUrl);
  }, []);



  useEffect(() => {
    if (id) {
      axios
          .get(`http://localhost:8080/rulebook/${id}`)
          .then((response) => {
            setRuleDetail(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("게시글 상세조회 오류", error);
            setLoading(false);
          });

      // 답글 목록 가져오기
      axios
          .get(`http://localhost:8080/rulebook/${id}/answers`)
          .then((response) => {
            setAnswers(response.data); // 답글 목록 상태 업데이트
          })
          .catch((error) => {
            console.error("답글 목록 조회 오류", error);
          });
    }
  }, [id]);

  const handleEditClick = () => {
    window.location.href = `/rulebook/modify/${id}`;
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      axios
          .delete(`http://localhost:8080/rulebook/delete/${id}`)
          .then((response) => {
            console.log("게시글 삭제 성공", response);
            alert("삭제되었습니다.");
            window.location.href = "/rulebook";
          })
          .catch((error) => {
            console.error("게시글 삭제 오류", error);
            alert("삭제 중 오류가 발생했습니다.");
          });
    }
  };

  const handleAnswerAdded = (newAnswer) => {
    setAnswers([...answers, newAnswer]); // 새로운 답글 추가
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!ruleDetail) {
    return <div>No data available</div>;
  }

  //날짜 포맷 함수
    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleString('ko-KR', options);  // 한국식 날짜 포맷
    };


    const handleVoteClick = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/rulebook/${id}/vote`, null, {
                params: { gamerId: userInfo.id } // 쿠키에서 가져온 사용자 ID
            });

            console.log("추천 성공", response.data);
            alert("추천이 완료되었습니다!"); // ✅ 추천 성공 알림창 띄우기

            window.location.href = `/rulebook/${id}`;
        } catch (error) {
            console.error("추천 오류", error);
            alert("중복 추천은 불가능 합니다!"); // ✅ 추천 실패 알림창 띄우기
        }
    };


  return (
      <div>
        <BasicMenu />

        <div className="mx-auto w-full max-w-4xl p-4">
          <div className="text-black text-4xl py-3">
            {ruleDetail.title}
          </div>

          <div className="w-full" style={{ borderBlock: '2px solid #D97706' }}>
            <div className="flex justify-end text-sm text-gray-600 gap-4">
              <p><strong>작성자:</strong>{ruleDetail.writer.nickname}</p>
              <p><strong>작성일:</strong> {formatDate(ruleDetail.createdate)}</p>
              <p><strong>조회수:</strong> {ruleDetail.viewCount}</p>
              <p><strong>추천수:</strong> {ruleDetail.voteCount}</p> {/* 추천수 표시 */}
            </div>

            <div
                className="editor-content"
                dangerouslySetInnerHTML={{ __html: ruleDetail.content }} style={{ marginTop: '20px' }}
            />

              {/* 수정 및 삭제 버튼이 작성자만 보이도록 조건 추가 */}
              {ruleDetail.writer.id === userInfo.id && (
                  <div className="flex justify-end gap-3" style={{ marginBottom: '3px' }}>
                      <button onClick={handleEditClick} style={{ color: 'white', background: '#D97706', borderRadius: '15%', padding: '3px' }}>수정</button>
                      <button onClick={() => handleDeleteClick(id)} style={{ background: '#D97706', borderRadius: '15%', padding: '3px', color: 'white' }}><X size={25} /></button>
                  </div>
              )}

              {/* 추천 버튼 추가 */}
              <div className="flex justify-center mt-4">
                  <button
                      onClick={handleVoteClick}
                      disabled={isVoted}  // 이미 추천한 경우 버튼 비활성화
                      style={{ background: '#D97706', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>
                      {isVoted ? "이미 추천하셨습니다" : "추천하기"}
                  </button>
              </div>
          </div>

            {/* 답글 목록 */}

            <AnswerList answers={answers} />

          {/* 답글 추가 폼 */}
          <AnswerForm rulebookId={id} onAnswerAdded={handleAnswerAdded} />


        </div>
      </div>
  );
};

export default PostDetailPage;
