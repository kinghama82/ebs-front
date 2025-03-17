'use client';

import BulletList from '@tiptap/extension-bullet-list';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import EditToolbar from './EditToolbar';
import TextStyle from '@tiptap/extension-text-style';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

export default function EditExample({ content, onUpdate, tempImages, setTempImages }) {
  const editor = useEditor({
    extensions: [
        StarterKit.configure({
            bulletList: false,
            orderedList: false,
            listItem: false,
            horizontalRule: false,
        }),
        BulletList,
        OrderedList,
        ListItem,
        Color,                  //색상
        Image.configure({
          HTMLAttributes:{
            style: 'width: 300px; height: auto;',
          },
        }),                  //이미지추가
        TextAlign.configure({
            types: ['heading', 'paragraph'],                      //정렬가능요소
            alignments: ['left', 'center', 'right', 'justify'],   //정렬옵션
        }),
        Underline,
        Youtube.configure({
            controls: true,
            nocookie: true,
        }),
        Placeholder.configure({                      //빈칸 안내표시
            placeholder: '여기에 글을 작성하세요',    //들어갈 문구
        }),
        Link.configure({         //링크삽입
            openOnClick: true,
            autolink: true,
        }),
        TextStyle,          //색상적용하려면 필수요소
        HorizontalRule.configure({
            HTMLAttributes: {
                class: 'my-custom-class',
            }
        }),     //구분선
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },immediatelyRender: false,
  });

  useEffect(() => {
    return () => editor && editor.destroy();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className='-mt-2'>
      <EditToolbar editor={editor} tempImages={tempImages} setTempImages={setTempImages}/>  
      <EditorContent editor={editor} className="tiptap border-2 border-gray-400 rounded-md" />
    </div>
  );
}
