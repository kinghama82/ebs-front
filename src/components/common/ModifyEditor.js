'use client'

import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import React, { useState, useEffect } from 'react';
import { Image } from '@tiptap/extension-image';
import axios from 'axios';
import { Node } from '@tiptap/core'

// YouTube 노드 정의
const YouTube = Node.create({
  name: 'youtube',
  group: 'block',  // 블록 요소로 설정
  content: 'inline*',
  inline: false,
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'iframe[src^="https://www.youtube.com/embed/"]',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      {
        ...HTMLAttributes,
        width: '100%',
        height: '315',
        frameborder: '0',
        allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
        allowFullScreen: true,
      },
    ]
  },
  addCommands() {
    return {
      setYouTube: (src) => ({ chain }) => {
        return chain().insertContent(`<iframe src="${src}" width="100%" height="315" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>`).run()
      },
    }
  },
})

//수정에디터
const ModifyEditor = ({ postId, initialContent, initialTitle }) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const editor = useEditor({
    extensions: [StarterKit, Image, YouTube],
    content: initialContent,  // 초기 콘텐츠 설정
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(initialContent);  // HTML 콘텐츠를 안전하게 로드
    }
  }, [editor, initialContent]);

  const updatePost = async () => {
    const updatedContent = editor.getHTML(); // 수정된 콘텐츠 가져오기
    console.log("수정된 콘텐츠:", updatedContent);

    if (!title) {
      alert('제목을 입력하세요');
      return;
    }

    const formData = new FormData();

    // 수정된 content를 JSON 형태로 formData에 추가
    const rulebookData = {
      title: title,
      content: updatedContent
    };

    formData.append('rulebook', new Blob([JSON.stringify(rulebookData)], { type: 'application/json' }));

    try {
      // 서버에 게시글 데이터 전송
      const response = await axios.put(`http://localhost:8080/rulebook/modify/${postId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('게시글 작성 완료');

      window.location.href = '/rulebook';
      
  } catch (err) {
      console.error('게시글 작성 오류', err.response || err);
      alert('게시글 작성에 실패했습니다.');
  }
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="게시글 제목"
        style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '20px' }}
      />

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()} style={buttonStyle}><strong>B</strong></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} style={buttonStyle}><em>I</em></button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} style={buttonStyle}><s>S</s></button>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '20px' }}>
        <EditorContent editor={editor} />
      </div>

      <button onClick={updatePost} style={buttonStyle}>
        게시글 수정 완료
      </button>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 15px',
  margin: '10px 5px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default ModifyEditor;

