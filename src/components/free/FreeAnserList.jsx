"use client";

import { useState } from "react";
import { Button } from "../ui/button";



export default function FreeAnswerList() {
  const [comments, setComments] = useState([]);

  const [newComment, setNewComment] = useState("");

  // 댓글 추가 함수
  const addComment = () => {
    if (newComment.trim() === "") return;

    const newEntry = {
      id: comments.length + 1,
      user: "🆕 새 유저",
      time: new Date().toISOString().replace("T", " ").slice(0, 19),
      text: newComment,
      likes: 0,
      dislikes: 0,
    };

    setComments([newEntry, ...comments]);
    setNewComment("");
  };

  // 좋아요 증가 함수
  const likeComment = (id) => {
    setComments(
      comments.map((comment) =>
        comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
      )
    );
  };

  // 싫어요 증가 함수
  const dislikeComment = (id) => {
    setComments(
      comments.map((comment) =>
        comment.id === id ? { ...comment, dislikes: comment.dislikes + 1 } : comment
      )
    );
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-md">
      <h2 className="text-lg font-bold">댓글 ({comments.length})</h2>

      {/* 댓글 리스트 */}
      <div className="mt-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-t pt-2">
            <div className="text-sm text-gray-600">{comment.user} ({comment.time})</div>
            <p className="mt-1">{comment.text}</p>
            <div className="text-sm text-gray-500 flex gap-3 mt-2">
              <button onClick={() => likeComment(comment.id)} className="hover:underline">
                👍 {comment.likes}
              </button>
              <button onClick={() => dislikeComment(comment.id)} className="hover:underline">
                👎 {comment.dislikes}
              </button>
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
        <Button className="" onClick={addComment} variant="mocha">등록</Button>
      </div>

      {/* 공지사항 */}
        <p className="mt-2 text-xs text-red-500">
            명예훼손, 개인정보 유출, 분쟁 유발, 허위사실 유포 등의 글은 이용약관에 의해 제재될 수 있습니다.
        </p>
            
      
      
    </div>
  );
}
