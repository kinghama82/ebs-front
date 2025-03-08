// app/rulebook/modify/[id]/page.js
import React from 'react';
import ModifyEditor from '@/components/common/ModifyEditor';
import axios from 'axios';

// Server Component: 서버에서 게시글 데이터를 가져옵니다.
async function fetchPostData(postId) {
  try {
    const response = await axios.get(`http://localhost:8080/rulebook/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post data:', error);
    return null;
  }
}

const EditPostPage = async ({ params }) => {
  const { id } = params; // URL에서 postId를 받아옵니다.

  // 서버에서 해당 게시글의 데이터 가져오기
  const postData = await fetchPostData(id);

  // 서버에서 데이터가 없으면 404 페이지로 이동
  if (!postData) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>게시글 수정</h1>
        {/* EditorComponent에 postId와 기존 데이터를 전달 */}
        <ModifyEditor postId={id} initialContent={postData.content} initialTitle={postData.title} />
      </div>
  );
};

export default EditPostPage;