import React, { useState, useEffect,} from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import axios from 'axios'

const TiptapEditor = ({ postId }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content,
  })

  useEffect(() => {
    // 서버에서 기존 게시글 불러오기
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/rulebook/${postId}`)
        setTitle(response.data.title)
        setContent(response.data.content)
        editor.commands.setContent(response.data.content)  // 에디터에 불러오기
      } catch (error) {
        console.error('게시글 로드 실패:', error)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId, editor])

  const handleSave = async () => {
    const updatedContent = editor.getHTML()
    try {
      await axios.put(`http://localhost:8080/rulebook/update/${postId}`, {
        title,
        content: updatedContent,
      })
      alert('게시글이 성공적으로 수정되었습니다!')
    } catch (error) {
      console.error('게시글 수정 실패:', error)
      alert('게시글 수정에 실패했습니다.')
    }
  }

  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>Tiptap 에디터 - 게시글 수정</h1>
      
      {/* 제목 입력 */}
      <input
        type="text"
        placeholder="게시글 제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '20px' }}
      />

      {/* 에디터 콘텐츠 */}
      <div style={{ outline: '2px solid #D97706', padding: '10px', borderRadius: '5px', minHeight: '200px' }}>
        <EditorContent editor={editor} />
      </div>

      {/* 수정 버튼 */}
      <button
        onClick={handleSave}
        style={{
          backgroundColor: '#D97706',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px',
        }}
      >
        게시글 수정
      </button>
    </div>
  )
}

export default TiptapEditor
