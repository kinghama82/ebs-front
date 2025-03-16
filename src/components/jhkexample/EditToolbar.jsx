'use client';

import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Eraser,
    Image as ImageIcon,
    Link as LinkIcon,
    List,
    Minus,
    Youtube
} from 'lucide-react';
import { useState } from 'react';

export default function EditToolbar({ editor, tempImages, setTempImages }) {


  if (!editor) return null;

  const colors = ['#FF0000', '#0000FF', '#008000', '#000000', '#FFA500'];

  const addImage = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
  
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      // 미리보기로 표시
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const imagePreview = reader.result;
        setTempImages((prev) => [...prev, { file, preview: imagePreview }]);
  
        // 에디터에 미리보기 이미지 삽입
        editor.chain().focus().setImage({ src: imagePreview }).run();
      };
    };
  
    fileInput.click();
  };  

  const addYoutubeVideo = () => {
    const url = window.prompt('유튜브 영상 URL을 입력하세요.');
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const setLink = () => {
    const url = window.prompt('링크 URL을 입력하세요.');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="flex gap-2 mb-2">
      <button onClick={() => editor.chain().focus().toggleBold().run()} title="굵게">
        <Bold size={18} />
      </button>

      <button onClick={() => editor.chain().focus().toggleUnderline().run()} title="밑줄">
        <span className="underline text-lg">U</span>
      </button>

      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} title="왼쪽 정렬">
        <AlignLeft size={18} />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} title="가운데 정렬">
        <AlignCenter size={18} />
      </button>
      
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} title="오른쪽 정렬">
        <AlignRight size={18} />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} title="양쪽 정렬">
        <AlignJustify size={18} />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()} title="수평선">
        <Minus size={18} />
      </button>

      <button onClick={() => editor.chain().focus().toggleBulletList().run()} title="글머리 기호">
        <List size={18} />
      </button>

      <button onClick={addImage} title="이미지 추가">
        <ImageIcon size={18} />
      </button>

      <button onClick={addYoutubeVideo} title="유튜브 영상 추가">
        <Youtube size={18}/>
      </button>

      <button onClick={setLink} title="링크 추가">
        <LinkIcon size={18} />
      </button>

      <button onClick={() => editor.chain().focus().unsetColor().run()} title="색상 초기화">
        <Eraser size={18} />
      </button>

      {colors.map((color) => (
        <button
          key={color}
          onClick={() => editor.chain().focus().setColor(color).run()}
          style={{ backgroundColor: color }}
          className="w-5 h-5 rounded-full border"
          title={`${color}색상 적용`}
        />
      ))}
    </div>
  );
}
