"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";

export default function FreeAnswerList({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?postId=${postId}`);
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("댓글을 불러오는 중 오류 발생:", error);
      }
    };

    fetchComments();
  }, [postId]);

  // 댓글 추가 함수
  const addComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, content: newComment }),
      });

      if (!res.ok) throw new Error("댓글 추가 실패");

      const newEntry = await res.json();
      setComments([newEntry, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("댓글 추가 중 오류 발생:", error);
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-md">
      <h2 className="text-lg font-bold">댓글 ({comments.length})</h2>

      {/* 댓글 리스트 */}
      <div className="mt-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-t pt-2">
            <div className="text-sm text-gray-600">{comment.user.nickname} ({comment.createdAt})</div>
            <p className="mt-1">{comment.content}</p>
            <div className="text-sm text-gray-500 flex gap-3 mt-2">
              <button className="hover:underline">👍 {comment.likes}</button>
              <button className="hover:underline">👎 {comment.dislikes}</button>
              <button className="hover:underline">공감 확인</button>
              <button className="hover:underline text-red-500">신고</button>
            </div>
          </div>
        ))}
      </div>

      {/* 댓글 입력 */}
      <div className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full h-16 p-2 border rounded-md"
          placeholder="댓글을 입력하세요..."
        />
        <Button onClick={addComment} variant="mocha">등록</Button>
      </div>

      {/* 공지사항 */}
      <p className="mt-2 text-xs text-red-500">
        명예훼손, 개인정보 유출, 분쟁 유발, 허위사실 유포 등의 글은 이용약관에 의해 제재될 수 있습니다.
      </p>
    </div>
  );
}
