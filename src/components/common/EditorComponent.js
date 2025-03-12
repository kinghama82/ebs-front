'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { TvMinimalPlay, FileImage } from 'lucide-react'
import axios from 'axios'
import { TextStyle } from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import { useCustomCookie } from "@/components/common/useCustomCookie";
import { useRouter } from "next/navigation";

const EditorComponent = () => {
  const fileInputRef = useRef(null)
  const [imageUrl, setImageUrl] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')
  const [title, setTitle] = useState('')
  const userInfo = useCustomCookie();
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['paragraph', 'heading'] }),
      TextStyle,
      Color,
      Underline,
      Image,
    ],
    content: '',
  })

  useEffect(() => {
    console.log('이미지 URL 상태 업데이트:', imageUrl);
  }, [imageUrl]); // imageUrl이 변경될 때마다 실행

  const uploadImageToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/rulebook/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 서버에서 받은 이미지 URL 확인
      console.log('이미지 URL:', response.data.url);
      const fullImageUrl = `${response.data.url}`; // 서버 주소가 없으면 추가
      setImageUrl(fullImageUrl); // 전체 URL을 상태에 저장

      // 에디터에 이미지 삽입
      editor.commands.insertContent(`<img src="${fullImageUrl}" alt="uploaded image" />`);

    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };


  const extractVideoId = (url) => {
    const match = url.match(/(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/)
    return match ? match[1] : null
  }

  const insertYouTube = (link) => {
    if (link) {
      const videoId = extractVideoId(link);
      console.log('추출된 비디오 ID:', videoId);
      if (videoId) {
        setYoutubeLink(`https://www.youtube.com/embed/${videoId}`);
      } else {
        alert('유효한 유튜브 URL을 입력해주세요.');
      }
    }
  }

  const submitPost = async () => {
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }

    const formData = new FormData();

    // RulebookDTO 객체를 JSON 형식으로 변환 후 추가
    const rulebookData = {
      title,
      content: editor.getHTML(),
      nickname: userInfo.nickname,
      image_url: imageUrl, // 이미지 URL
      youtube_link: youtubeLink,
    };

    // JSON 객체를 문자열로 변환하여 추가
    formData.append('rulebook', JSON.stringify(rulebookData));

    // 파일 추가
    file.forEach((file) => {
      formData.append('files', files);  // 여러 파일을 추가
    });

    try {
      const response = await axios.post('http://localhost:8080/rulebook/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 이 부분은 생략해도 axios가 자동으로 처리
        },
      });

      alert('게시글 작성 완료');
      router.push('/rulebook');
    } catch (err) {
      console.error('게시글 작성 오류', err);
      alert('게시글 작성에 실패했습니다.');
    }
  };




  return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>게시글 작성</h1>
        <input
            type="text"
            placeholder="게시글 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '20px' }}
        />
        <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => uploadImageToServer(e.target.files[0])}
        />
        <button onClick={() => fileInputRef.current.click()}><FileImage /></button>

        {/* 업로드된 이미지 미리보기 */}
        {imageUrl && (
            <div>
              <img
                  src={imageUrl}
                  alt="업로드된 이미지"
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginTop: '20px' }}
              />
            </div>
        )}
        <button onClick={() => insertYouTube(prompt('유튜브 링크를 입력하세요:'))}><TvMinimalPlay /></button>
        <EditorContent editor={editor} style={{ border: '1px solid #ccc', minHeight: '200px', padding: '10px', borderRadius: '5px' }} />
        <button onClick={submitPost} style={{ marginTop: '20px' }}>게시글 작성</button>
      </div>
  )
}

export default EditorComponent;
