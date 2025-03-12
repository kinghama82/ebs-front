'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { TvMinimalPlay, FileImage, AlignLeft, AlignJustify, AlignRight } from 'lucide-react'
import axios from 'axios'
import { TextStyle } from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import { useCustomCookie } from "@/components/common/useCustomCookie";
import { useRouter } from "next/navigation";
import YouTube from '@/components/common/Youtube'
import { SketchPicker } from "react-color";
import styles from '@/styles/Editor.module.css'
import { Mark, mergeAttributes } from '@tiptap/core';

// 글자 크기 확장 정의
export const FontSize = Mark.create({
  name: 'fontSize',

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => element.style.fontSize.replace('px', ''),
        renderHTML: (attributes) => {
          if (!attributes.size) return {};
          return { style: `font-size: ${attributes.size}px` };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[style]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setFontSize:
          (size) =>
              ({ chain }) => {
                return chain().setMark('fontSize', { size }).run();
              },
    };
  },
});

const EditorComponent = () => {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [title, setTitle] = useState('');
  const userInfo = useCustomCookie();
  const router = useRouter();
  const [colorPickerVisible, setColorPickerVisible] = useState(false); // 색상 선택기 상태 정의
  const [selectedColor, setSelectedColor] = useState('#000000'); // 기본 색상 검정색
  const [selectedFontSize, setSelectedFontSize] = useState(16); // 기본 글자 크기 설정
  const [dropdownVisible, setDropdownVisible] = useState(false); // 드롭다운 보이기/숨기기 상태
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null); // 글자 크기 버튼에 대한 참조 추가
  // 글자 크기 드롭다운 위치 조정
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });


  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['paragraph', 'heading'] }),
      TextStyle,
      Color,
      Underline,
      Image,
      YouTube,
      FontSize,
    ],
    content: '',
  });



  useEffect(() => {
    // 처음 로드 시 에디터에 포커스
    if (editor) {
      editor.chain().focus().run();
    }
  }, [editor]);

  const handleEditorClick = () => {
    if (editor) {
      editor.chain().focus().run(); // 클릭 시 포커스를 강제로 에디터로 이동
    }
  };

  const uploadImageToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/rulebook/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fullImageUrl = response.data;
      setImageUrl(fullImageUrl);
      editor.commands.insertContent(`<img src="${fullImageUrl}" alt="uploaded image" />`);

    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const extractVideoId = (url) => {
    const match = url.match(/(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  }

  const insertYouTube = (link) => {
    if (link) {
      const videoId = extractVideoId(link);
      if (videoId) {
        const iframeHtml = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        editor.commands.insertContent(iframeHtml);
        setYoutubeLink(link);
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
      writerId: userInfo.id,
      imageUrls: imageUrl ? [imageUrl] : [],
      youtubeLinks: youtubeLink ? [youtubeLink] : [],
    };

    try {
      const response = await axios.post('http://localhost:8080/rulebook/create', rulebookData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('게시글 작성 완료');
      router.push('/rulebook');
    } catch (err) {
      console.error("🚨 게시글 작성 오류:", err);
      alert('게시글 작성에 실패했습니다.');
    }
  };

  const toggleColorPicker = () => {
    setColorPickerVisible(!colorPickerVisible);
  }

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    editor.chain().focus().setColor(color.hex).run();
  }

  const handleFontSizeChange = (size) => {
    setSelectedFontSize(size);
    editor.chain().focus().setFontSize(size).run();
    setDropdownVisible(false);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFontSizeDropdownClick = () => {
    const buttonRect = buttonRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: buttonRect.bottom,
      left: buttonRect.left,
    });
    setDropdownVisible(!dropdownVisible);
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

        <button onClick={() => insertYouTube(prompt('유튜브 링크를 입력하세요:'))}><TvMinimalPlay /></button>

        <div style={{ display: 'flex', gap: '30px', marginBottom: '20px' }}>
          <div>
            <button onClick={() => editor.chain().focus().toggleBold().run()} style={GetButtonStyle(editor, 'bold')}><strong>B</strong></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} style={GetButtonStyle(editor, 'italic')}><em>I</em></button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} style={GetButtonStyle(editor, 'strike')}><s>S</s></button>

            <button onClick={toggleColorPicker} style={buttonStyle}>색상</button>
            {colorPickerVisible && (
                <div style={{ position: 'absolute', zIndex: 1000 }}>
                  <SketchPicker color={selectedColor} onChangeComplete={handleColorChange} />
                </div>
            )}

            <button
                ref={buttonRef}
                onClick={handleFontSizeDropdownClick}
                style={buttonStyle}
            >
              글자 크기
            </button>
            {dropdownVisible && (
                <div
                    ref={dropdownRef}
                    style={{
                      position: 'absolute',
                      top: `${dropdownPosition.top}px`,
                      left: `${dropdownPosition.left}px`,
                      backgroundColor: 'white',
                      border: '1px solid #D97706',
                      borderRadius: '5px',
                      padding: '10px',
                      maxHeight: '160px',
                      overflowY: 'auto',
                    }}
                >
                  <div className="dropdownItem" onClick={() => handleFontSizeChange(16)}>16px</div>
                  <div className="dropdownItem" onClick={() => handleFontSizeChange(18)}>18px</div>
                  <div className="dropdownItem" onClick={() => handleFontSizeChange(20)}>20px</div>
                  <div className="dropdownItem" onClick={() => handleFontSizeChange(24)}>24px</div>
                  <div className="dropdownItem" onClick={() => handleFontSizeChange(30)}>30px</div>
                  <div className="dropdownItem" onClick={() => handleFontSizeChange(36)}>36px</div>
                  <div className="dropdownItem" onClick={() => handleFontSizeChange(40)}>40px</div>
                  <div className="dropdownItem" onClick={() => handleFontSizeChange(48)}>48px</div>
                </div>
            )}

            <button onClick={() => editor.chain().focus().toggleUnderline().run()} style={buttonStyle}><u>U</u></button>

            <button onClick={() => editor.chain().focus().setTextAlign('left').run()} style={AlignButtonStyle(editor, 'left')}><AlignLeft /></button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()} style={AlignButtonStyle(editor, 'center')}><AlignJustify /></button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()} style={AlignButtonStyle(editor, 'right')}><AlignRight /></button>
          </div>
        </div>

        <div className={styles.ProseMirror} style={{ padding: '10px', cursor: 'text' }} onClick={handleEditorClick}>
          <EditorContent editor={editor} style={{ border: '1px solid #ccc', minHeight: '200px', padding: '10px', borderRadius: '5px', outline: 'none' }} />
        </div>

        <button onClick={submitPost} style={{ marginTop: '20px' }}>게시글 작성</button>
      </div>
  );
};


const dropdownItemStyle = {
  padding: '5px 10px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-in-out', // 부드러운 색상 전환 효과 추가
};

const dropdownItemHoverStyle = {
  backgroundColor: '#007bff',  // 마우스를 올렸을 때 배경색 (파란색)
  color: 'white',  // 텍스트 색상 변경
};

const buttonStyle = {
  backgroundColor: 'transparent',
  color: 'black',
  padding: '10px 15px',
  margin: '0 5px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
}

//툴바 스타일
const GetButtonStyle = (editor, type) => {
  const isActive = editor?.isActive(type); // 활성화 여부 확인

  return {
    backgroundColor: 'transparent',
    color: isActive ? '#D97706' : 'black', // 활성화되면 색상을 변경
    padding: '10px 15px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  };
};

//정렬 버튼 스타일
const AlignButtonStyle = (editor, type) => {
  const alignment = editor?.getAttributes('paragraph')?.textAlign;

  const isActive = alignment === type;

  return {
    backgroundColor: 'transparent',
    color: isActive ? '#D97706' : 'black',
    padding: '10px 15px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  };
};

export default EditorComponent;
