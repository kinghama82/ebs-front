  'use client'
  
  import React, { useRef, useState, useEffect } from 'react'
  import { useEditor, EditorContent } from '@tiptap/react'
  import { StarterKit } from '@tiptap/starter-kit'
  import { Image } from '@tiptap/extension-image'
  import { TvMinimalPlay, FileImage, AlignRight, AlignLeft, AlignJustify } from 'lucide-react'
  import axios from 'axios'
  import { Node } from '@tiptap/core'
  import { TextStyle } from '@tiptap/extension-text-style'
  import { Underline } from '@tiptap/extension-underline'
  import styles from '@/styles/Editor.module.css'
  import { TextAlign } from '@tiptap/extension-text-align'
  import Color from '@tiptap/extension-color'
  import { Mark, mergeAttributes } from '@tiptap/core';
  import { SketchPicker } from 'react-color'
  
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
  
  // 게시글 작성 컴포넌트
  const EditorComponent = () => {
    const fileInputRef = useRef(null)
    const [imageUrl, setImageUrl] = useState('')  // 이미지 미리보기 상태 추가
    const [title, setTitle] = useState('')
    const [colorPickerVisible, setColorPickerVisible] = useState(false) // 색상 선택기 상태 정의
    const [selectedColor, setSelectedColor] = useState('#000000') // 기본 색상 검정색
    const [selectedFontSize, setSelectedFontSize] = useState(16); // 기본 글자 크기 설정
    const [dropdownVisible, setDropdownVisible] = useState(false); // 드롭다운 보이기/숨기기 상태
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null); // 글자 크기 버튼에 대한 참조 추가
  
    // 글자 크기 드롭다운 위치 조정
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  
    const editor = useEditor({
      extensions: [
        StarterKit,
        TextAlign.configure({
          types: ['paragraph', 'heading'],
        }),
        TextStyle.configure({ mergeNestedSpanStyles: true }), // 글자 크기, 색상 적용 확장
        FontSize,
        Color,
        Underline,  // 밑줄 기능 확장
        Image.configure({
          uploadImage: async (file) => {
            // 이미지 업로드 처리
          }
        }),
        YouTube, // YouTube 노드 확장 사용
      ],
      content: [],
    })
  
    // 서버에 이미지를 업로드하고 URL 반환
    const uploadImageToServer = async (file) => {
      const formData = new FormData()
      formData.append('file', file)
  
      try {
        const response = await axios.post('http://localhost:8080/rulebook/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        const imageUrl = response.data.url
        console.log("업로드된 이미지 URL", imageUrl)
        return imageUrl
      } catch (error) {
        console.error('이미지 업로드 오류:', error)
        throw new Error('이미지 업로드에 실패했습니다.')
      }
    }
  
    // 유튜브 링크를 입력받아 에디터에 유튜브 콘텐츠 삽입
    const insertYouTube = (link) => {
      if (link) {
        const videoId = extractVideoId(link)
        if (videoId) {
          const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`
          editor.chain().focus().setYouTube(youtubeEmbedUrl).run()  // setYouTube로 유튜브 iframe 삽입
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
  
      console.log("html", editor.getHTML());
  
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
  
        window.location.href = '/rulebook';
  
      } catch (err) {
        console.error('게시글 작성 오류', err.response || err);
        alert('게시글 작성에 실패했습니다.');
      }
  
    };
  
    // 색상 선택기 토글 함수
    const toggleColorPicker = () => {
      setColorPickerVisible(!colorPickerVisible);
    }
  
    // 색상 선택 후 적용
    const handleColorChange = (color) => {
      setSelectedColor(color.hex); // 선택한 색상을 상태에 저장
      editor.chain().focus().setColor(color.hex).run(); // 에디터에 색상 적용
    }
  
       // 글자 크기 드롭다운 변경 처리
       const handleFontSizeChange = (size) => {
        setSelectedFontSize(size);
        editor.chain().focus().setFontSize(size).run();
        setDropdownVisible(false); // 선택 후 드롭다운 숨기기
      }

      //드롭다운
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
          }
        };
  
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);
  
        // 글자 크기 버튼 클릭 시 드롭다운 위치 설정
    const handleFontSizeDropdownClick = () => {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: buttonRect.bottom, // 버튼 아래에 드롭다운이 위치하도록 설정
        left: buttonRect.left,  // 버튼 왼쪽에 맞춰서 드롭다운 위치 설정
      });
      setDropdownVisible(!dropdownVisible); // 드롭다운 토글
    };
  
  
  
    return (
      <div
        style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: 'transparent', borderRadius: '8px' }}
      >
        <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px', marginTop: '50px' }}>게시글 작성</h1>
  
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
                  }}
                >
                  <div
                    className={styles.dropdownItemp}
                    onClick={() => handleFontSizeChange(16)}
                  >
                    16px
                  </div>
                  <div
                    className="dropdownItem"
                    onClick={() => handleFontSizeChange(18)}
                  >
                    18px
                  </div>
                  <div
                    className="dropdownItem"
                    onClick={() => handleFontSizeChange(20)}
                  >
                    20px
                  </div>
                  <div
                    className="dropdownItem"
                    onClick={() => handleFontSizeChange(24)}
                  >
                    24px
                  </div>
                  <div
                    className="dropdownItem"
                    onClick={() => handleFontSizeChange(30)}
                  >
                    30px
                  </div>
                  <div
                    className="dropdownItem"
                    onClick={() => handleFontSizeChange(36)}
                  >
                    36px
                  </div>
                  <div
                    className="dropdownItem"
                    onClick={() => handleFontSizeChange(40)}
                  >
                    40px
                  </div>
                  <div
                    className="dropdownItem"
                    onClick={() => handleFontSizeChange(48)}
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
    )
  }
  
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
