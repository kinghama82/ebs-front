'use client'

import React, { useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { Youtube } from 'lucide-react'
import axios from 'axios'
import { Extension } from '@tiptap/core'

// YouTube 확장 정의 수정
const YouTube = Extension.create({
  name: 'youtube',
  group: 'block',
  inline: false,
  content: 'text*',
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
        return chain().insertContent(`<iframe src="${src}" />`).run()
      },
    }
  },
})

const TiptapEditor = () => {
  const fileInputRef = useRef(null)
  const [title, setTitle] = useState('')  // 게시글 제목을 입력 받을 상태 추가
  const [imageUrl, setImageUrl] = useState('')  // 이미지 미리보기 상태 추가

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        uploadImage: async (file) => {
          const uploadImageUrl = await uploadImageToServer(file)
          editor.chain().focus().setImage({ src: uploadImageUrl }).run()
          setImageUrl(uploadImageUrl)  // 미리보기 URL 설정
          return uploadImageUrl
        },
      }),
      YouTube,  // 수정된 YouTube 확장 사용
    ],
    content: [],
  })

  // 서버에 이미지를 업로드하고 URL 반환
  const uploadImageToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        // 서버에 이미지 업로드
        const response = await axios.post('http://localhost:8080/rulebook/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // 서버에서 반환된 이미지 URL
        return response.data.url; 
    } catch (error) {
        console.error('이미지 업로드 오류:', error);
        throw new Error('이미지 업로드에 실패했습니다.');
    }
  };

  // 유튜브 링크를 입력받아 에디터에 유튜브 콘텐츠 삽입
  const insertYouTube = (link) => {
    if (link) {
      const videoId = extractVideoId(link)
      if (videoId) {
        const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`
        editor.chain().focus().setYouTube(youtubeEmbedUrl).run()
      } else {
        alert('유효한 유튜브 URL을 입력해주세요.')
      }
    }
  }

  // 유튜브 링크에서 비디오 ID 추출하는 함수
  const extractVideoId = (url) => {
    const match = url.match(/(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/)
    return match ? match[1] : null
  }

  // 게시글 작성 함수
  const submitPost = async () => {
    const content = editor.getHTML();

    if (!title) {
        alert('제목을 입력해주세요.');
        return;
    }

    const formData = new FormData();
    const rulebookData = { title: title, content: content };
    formData.append('rulebook', new Blob([JSON.stringify(rulebookData)], { type: 'application/json' }));

    try {
        // 서버에 게시글 데이터 전송
        const response = await axios.post('http://localhost:8080/rulebook/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        alert('게시글 작성 완료');
    } catch (error) {
        console.error('게시글 작성 오류', error.response || error);
        alert('게시글 작성에 실패했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>Tiptap 에디터</h1>

      {/* 제목 입력 */}
      <input
        type="text"
        placeholder="게시글 제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '20px' }}
      />

      {/* 에디터 툴바 */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()} style={buttonStyle}><strong>B</strong></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} style={buttonStyle}><em>I</em></button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} style={buttonStyle}><s>S</s></button>
        <button onClick={() => insertYouTube(prompt('유튜브 링크를 입력하세요:'))} style={buttonStyle}><Youtube /></button>
        <button onClick={() => fileInputRef.current.click()} style={buttonStyle}>📸</button>
      </div>

      {/* 파일 입력 엘리먼트 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(event) => setImageUrl(URL.createObjectURL(event.target.files[0]))}  // 미리보기용 이미지 설정
      />

      {/* 이미지 미리보기 */}
      {imageUrl && (
        <div style={{ marginBottom: '20px' }}>
          <h3>이미지 미리보기</h3>
          <img src={imageUrl} alt="미리보기" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
        </div>
      )}

      {/* 에디터 콘텐츠 */}
      <div style={{ outline: '2px solid #D97706', padding: '10px', borderRadius: '5px' }}>
        <EditorContent editor={editor} />
      </div>

      {/* 게시글 작성 버튼 */}
      <button onClick={submitPost} style={{ ...buttonStyle, marginTop: '20px', backgroundColor: '#D97706' }}>
        게시글 작성
      </button>
    </div>
  )
}

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 15px',
  margin: '0 5px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
}

export default TiptapEditor
