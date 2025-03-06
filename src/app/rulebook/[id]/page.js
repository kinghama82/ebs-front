'use client'

import React, { useEffect, useState } from "react";
import BasicMenu from "@/components/menus/BasicMenu";
import axios from "axios";

const PostDetailPage = () => {
  const [ruleDetail, setRuleDetail] = useState(null);  // 게시글 상세 데이터 상태
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [id, setId] = useState(null);  // ID를 직접 URL에서 받아오기

  useEffect(() => {
    // URL에서 id를 추출 (클라이언트에서만)
    const url = window.location.href;
    const idFromUrl = url.split("/").pop();  // URL에서 마지막 부분을 id로 추출
    setId(idFromUrl);
  }, []);

  useEffect(() => {
    if (id) {
      // API에서 해당 ID의 상세 정보를 가져옵니다.
      axios
        .get(`http://localhost:8080/rulebook/${id}`)
        .then((response) => {
          setRuleDetail(response.data);  // 서버에서 받은 게시글 데이터를 상태에 저장
          setLoading(false);  // 로딩 완료
        })
        .catch((error) => {
          console.error("게시글 상세조회 오류", error);
          setLoading(false);  // 오류가 나도 로딩 종료
        });
    }
  }, [id]);


  const handleEditClick = () => {
    window.location.href = `/rulebook/modify/${id}`;  // 수정 페이지로 이동
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      axios
        .delete(`http://localhost:8080/rulebook/${id}`)
        .then((response) => {
          console.log("게시글 삭제 성공", response);
          alert("삭제되었습니다.");
          window.location.href = "/rulebook"; // 삭제 후 목록 페이지로 리디렉션
        })
        .catch((error) => {
          console.error("게시글 삭제 오류", error);
          alert("삭제 중 오류가 발생했습니다.");
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;  // 로딩 중에는 "Loading..." 표시
  }

  if (!ruleDetail) {
    return <div>No data available</div>;  // 데이터가 없을 경우
  }

  return (
    <div>
      <BasicMenu /> {/* 메뉴 컴포넌트 추가 */}

      <div className="mx-auto w-full max-w-4xl p-4">
        <div className="bg-[#813D00] text-white text-3xl py-4 text-center">
          RuleBook Detail
        </div>

        <div className="w-full bg-yellow-100 p-4">
          <h2 className="text-2xl font-bold mb-4">{ruleDetail.title}</h2>

          {/* content는 HTML 형식이므로 dangerouslySetInnerHTML을 사용해 출력 */}
          <div
            className="editor-content"
            dangerouslySetInnerHTML={{ __html: ruleDetail.content }}
          />

          <div className="flex justify-between text-sm text-gray-600">
            <p><strong>작성자:</strong> {ruleDetail.writerId}</p>
            <p><strong>작성일:</strong> {ruleDetail.createdate}</p>
          </div>
        </div>
        <button onClick={handleEditClick}>수정</button> {/* 수정 버튼 클릭 시 수정 페이지로 이동 */}
        <button onClick={() => handleDeleteClick(id)}>삭제</button> {/* 삭제 버튼 클릭 시 삭제 요청 */}
      </div>
    </div>
  );
};

export default PostDetailPage;
