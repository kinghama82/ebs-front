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
  const [imageWidth, setImageWidth] = useState(300); // 이미지의 기본 너비 상태
  const [imageHeight, setImageHeight] = useState(200); // 이미지의 기본 높이 상태
  const editorContainerRef = useRef(null); // 드래그 앤 드롭을 위한 ref 추가
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
      Image.configure({
        HTMLAttributes: {
          style: 'width: 300px; height: auto;', // 초기 사이즈 설정
        },
      }),
      YouTube,
      FontSize,
    ],
    content: '',
    editorProps: {
      handleDrop(view, event, slice, moved) {
        event.preventDefault(); // 기본 드롭 이벤트 방지

        const files = event.dataTransfer.files;
        if (files.length > 0) {
          const file = files[0];

          if (file.type.startsWith("image/")) {
            uploadImageToServer(file);
            return true; // 이미지 업로드 처리 완료
          }
        }

        // 텍스트 드래그 & 드롭은 기본 동작 유지
        return false;
      },
    },
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



  //이미지 업로드 함수
  const uploadImageToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    console.log("업로드할 파일:", file);
    console.log("FormData 확인:", formData.get('file'));

    try {
      const response = await axios.post('http://localhost:8080/rulebook/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fullImageUrl = response.data;
      console.log("업로드 성공:", fullImageUrl);
      setImageUrl(fullImageUrl);
      editor.commands.insertContent(`<img src="${fullImageUrl}" alt="uploaded image" onerror="console.log('이미지 로딩 실패:', this.src)" />`);



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

  const handleDrag = (e) => {
    e.preventDefault();

    let newWidth = e.clientX - e.target.offsetLeft;
    let newHeight = e.clientY - e.target.offsetTop;

    // 이미지 크기를 제한 (최소, 최대 크기)
    newWidth = Math.max(100, Math.min(newWidth, 600));
    newHeight = Math.max(100, Math.min(newHeight, 400));

    setImageWidth(newWidth);
    setImageHeight(newHeight);
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
      <div
          style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: 'transparent', borderRadius: '8px' }}
      >
        <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px', marginTop: '50px' }}>게시글 수정</h1>

        {/* 제목 입력 */}
        <input
            type="text"
            placeholder="게시글 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '30px', outline: '2px solid #D97706', borderRadius: '5px' }}
        />


        {/* 파일 입력 엘리먼트 */}
        <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(event) => {
              const file = event.target.files[0];
              if (file && file.type.startsWith('image/')) {
                setImageUrl(URL.createObjectURL(file));  // 미리보기용 이미지 설정
                editor.chain().focus().setImage({ src: URL.createObjectURL(file) }).run(); // 에디터에 이미지 삽입
                uploadImageToServer(file);  // 업로드 실행
              }
            }}
        />

        {/* 에디터 콘텐츠 */}
        <div
            style={{
              outline: '2px solid #D97706',
              borderRadius: '5px',
              minHeight: '350px',
              cursor: 'text',
              backgroundColor: 'transparent',
            }}
            onClick={() => editor?.commands.focus()}
        >


          {/* 에디터 툴바 */}
          <div style={{ display: 'flex', gap: '30px', borderRadius: '5px' }}>
            <div>
              <button onClick={() => editor.chain().focus().toggleBold().run()} style={GetButtonStyle(editor, 'bold')}><strong>B</strong></button>
              <button onClick={() => editor.chain().focus().toggleItalic().run()} style={GetButtonStyle(editor, 'italic')}><em>I</em></button>
              <button onClick={() => editor.chain().focus().toggleStrike().run()} style={GetButtonStyle(editor, 'strike')}><s>S</s></button>

              {/* 색상 팔레트 버튼 */}
              <button onClick={toggleColorPicker} style={buttonStyle}>색상</button>
              {colorPickerVisible && (
                  <div style={{ position: 'absolute', zIndex: 1000 }}>
                    <SketchPicker color={selectedColor} onChangeComplete={handleColorChange} />
                  </div>
              )}

              {/* 글자 크기 버튼 */}
              <button
                  ref={buttonRef} // 글자 크기 버튼에 참조 추가
                  onClick={handleFontSizeDropdownClick} // 클릭 시 드롭다운 토글
                  style={buttonStyle}
              >
                글자 크기
              </button>
              {dropdownVisible && (
                  <div
                      ref={dropdownRef} // 드롭다운 참조
                      style={{
                        position: 'absolute',
                        top: `${dropdownPosition.top}px`, // 동적으로 위치 설정
                        left: `${dropdownPosition.left}px`, // 동적으로 위치 설정
                        backgroundColor: 'white',
                        border: '1px solid #D97706',
                        borderRadius: '5px',
                        padding: '10px',
                        maxHeight: '160px', // 최대 높이를 설정하여 스크롤 생기도록 함
                        overflowY: 'auto',
                        zIndex: 1000,
                      }}
                  >
                    <div
                        className="dropdownItem"
                        onClick={() => handleFontSizeChange(16)}
                        style={dropdownItem}
                    >
                      16px
                    </div>
                    <div
                        className="dropdownItem"
                        onClick={() => handleFontSizeChange(18)}
                        style={dropdownItem}
                    >
                      18px
                    </div>
                    <div
                        className="dropdownItem"
                        onClick={() => handleFontSizeChange(20)}
                        style={dropdownItem}
                    >
                      20px
                    </div>
                    <div
                        className="dropdownItem"
                        onClick={() => handleFontSizeChange(24)}
                        style={dropdownItem}
                    >
                      24px
                    </div>
                    <div
                        className="dropdownItem"
                        onClick={() => handleFontSizeChange(30)}
                        style={dropdownItem}
                    >
                      30px
                    </div>
                    <div
                        className="dropdownItem"
                        onClick={() => handleFontSizeChange(36)}
                        style={dropdownItem}
                    >
                      36px
                    </div>
                    <div
                        className="dropdownItem"
                        onClick={() => handleFontSizeChange(40)}
                        style={dropdownItem}
                    >
                      40px
                    </div>
                    <div
                        className="dropdownItem"
                        onClick={() => handleFontSizeChange(48)}
                        style={dropdownItem}
                    >
                      48px
                    </div>
                  </div>
              )}

              {/* 밑줄 버튼 */}
              <button onClick={() => editor.chain().focus().toggleUnderline().run()} style={buttonStyle}><u>U</u></button>

              <button onClick={() => editor.chain().focus().setTextAlign('left').run()} style={AlignButtonStyle(editor, 'left')}><AlignLeft /></button>
              <button onClick={() => editor.chain().focus().setTextAlign('center').run()} style={AlignButtonStyle(editor, 'center')}><AlignJustify /></button>
              <button onClick={() => editor.chain().focus().setTextAlign('right').run()} style={AlignButtonStyle(editor, 'right')}><AlignRight /></button>
            </div>

            <div>
              <button onClick={() => insertYouTube(prompt('유튜브 링크를 입력하세요:'))} style={buttonStyle}><TvMinimalPlay /></button>
              <button onClick={() => fileInputRef.current.click()} style={buttonStyle}><FileImage /></button>
            </div>
          </div>

          {/* 텍스트 입력 */}
          <div className={styles.ProseMirror} style={{ padding: '10px' }}>

            <EditorContent editor={editor} />
          </div>
        </div>

        {/* 게시글 작성 버튼 */}
        <button onClick={submitPost} style={{ ...buttonStyle, marginTop: '20px', backgroundColor: '#D97706' }}>
          게시글 작성
        </button>

      </div>
  );
};

const dropdownItem = {
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
    fontSize: '15px',
  };
};

export default EditorComponent;
