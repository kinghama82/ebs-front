'use client'

import React, { useRef, useState } from 'react'
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
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [title, setTitle] = useState('');
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
  });

  const uploadImageToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/rulebook/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fullImageUrl = response.data.url;
      setImageUrl(fullImageUrl);

      // 에디터에 이미지 삽입
      editor.commands.insertContent(`<img src="${fullImageUrl}" alt="uploaded image" />`);
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const extractVideoId = (url) => {
    const match = url.match(/(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const insertYouTube = (link) => {
    if (link) {
      const videoId = extractVideoId(link);
      if (videoId) {
        setYoutubeLink(`https://www.youtube.com/embed/${videoId}`);
      } else {
        alert('유효한 유튜브 URL을 입력해주세요.');
      }
    }
  };

  const submitPost = async () => {
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }

    const rulebookData = {
      title,
      content: editor.getHTML(),
      nickname: userInfo.nickname,
      image_url: imageUrl,
      youtube_link: youtubeLink,
    };

    // 📌 서버에 보내기 전에 rulebookData 로그 확인
    console.log("📌 서버로 보낼 데이터:", rulebookData);

   /* const formData = new FormData();
    formData.append('rulebook', JSON.stringify(rulebookData));
*/
    try {
      const response = await axios.post('http://localhost:8080/rulebook/create', rulebookData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 📌 응답 데이터 확인
      console.log("✅ 서버 응답:", response.data);

      alert('게시글 작성 완료');
      router.push('/rulebook');
    } catch (err) {
      console.error("🚨 게시글 작성 오류:", err);
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
  );
};

export default EditorComponent;
