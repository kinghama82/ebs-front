'use client'

import React, { useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { Node } from '@tiptap/core'
import axios from 'axios'
import { Youtube } from 'lucide-react'

const YouTube = Node.create({
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
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        uploadImage: async (file) => {
          const imageUrl = await uploadImageToServer(file)
          return imageUrl
        },
      }),
      Link,
      YouTube,
    ],
    content:[],
  })

  // 서버에 이미지를 업로드하고 URL 반환
  const uploadImageToServer = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()
    return data.url
  }

  // 이미지 업로드 처리 함수
  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    const imageUrl = await uploadImageToServer(file)
    editor.chain().focus().setImage({ src: imageUrl }).run()
  }

  // 유튜브 링크를 입력받아 에디터에 유튜브 콘텐츠 삽입
  const insertYouTube = (link) => {
    if (link) {
      const videoId = extractVideoId(link)
      if (videoId) {
        const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
        editor.chain().focus().setYouTube(youtubeEmbedUrl).run();
      } else {
        alert('유효한 유튜브 URL을 입력해주세요.');
      }
    }
  }

  // 유튜브 링크에서 비디오 ID 추출하는 함수
  const extractVideoId = (url) => {
    const match = url.match(/(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  }

  // 게시글 작성 함수
  const submitPost = async () => {
    const content = editor.getHTML();
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }
  
    const formData = {
      title,
      content,
    };

    console.log(formData)
  
    try {
      // 서버 요청 시 content-type을 명시적으로 설정하여 전송
      const response = await axios.post(
        'http://localhost:8080/rulebook', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
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
        <button onClick={() => insertYouTube(prompt('유튜브 링크를 입력하세요:'))} style={buttonStyle}><Youtube/></button>
        <button onClick={() => fileInputRef.current.click()} style={buttonStyle}>📸</button>
      </div>

      {/* 파일 입력 엘리먼트 */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />

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
