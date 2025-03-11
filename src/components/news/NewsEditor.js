"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { BulletList } from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import { CodeBlock } from "@tiptap/extension-code-block";
import EditorToolbar from "./EditorToolbar";
import EditorContentArea from "./EditorContentArea";
import axios from "axios";

const NewsEditor = ({ setContent, setYoutubeUrl, setImageUrls }) => {
    const editor = useEditor({
        extensions: [StarterKit, TextAlign, Image, BulletList, OrderedList, CodeBlock],
        content: "",
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    const fileInputRef = useRef(null);

    // ✅ 유튜브 링크를 별도 필드로 저장
    const insertYouTube = () => {
        const link = prompt("유튜브 링크를 입력하세요:");
        if (!link) return;

        const videoId = extractVideoId(link);
        if (videoId) {
            const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
            setYoutubeUrl(youtubeEmbedUrl); // ✅ 유튜브 링크를 별도 필드에 저장
        } else {
            alert("유효한 유튜브 URL을 입력해주세요.");
        }
    };

    // ✅ 유튜브 URL에서 비디오 ID 추출
    const extractVideoId = (url) => {
        const match = url.match(
            /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/))([^"&?\/\s]{11})/
        );
        return match ? match[1] : null;
    };

    // ✅ 이미지 업로드 함수 수정
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:8080/news/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const imageUrl = response.data.url;
            setImageUrls((prev) => [...prev, imageUrl]); // ✅ 이미지 URL 상태에 추가
            editor.chain().focus().setImage({ src: imageUrl }).run(); // ✅ 에디터에 이미지 삽입
        } catch (error) {
            console.error("이미지 업로드 오류:", error);
        }
    };

    return (
        <div className="flex flex-col gap-4 border rounded-lg p-4 bg-gray-50 shadow">
            <EditorToolbar editor={editor} insertYouTube={insertYouTube} handleFileUpload={handleFileUpload} />
            <EditorContentArea editor={editor} />
        </div>
    );
};

export default NewsEditor;
