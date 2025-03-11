//src/app/news/create/page.js
"use client";

import React, { useState } from "react";
import axios from "axios";
import { useCustomCookie } from "@/components/common/useCustomCookie";
import NewsEditor from "@/components/news/NewsEditor";

const NewsForm = () => {
    const userInfo = useCustomCookie();
    const [title, setTitle] = useState("");
    const [boardType, setBoardType] = useState("");
    const [content, setContent] = useState(""); // ✅ 에디터에서 받아온 내용
    const [selectedFiles, setSelectedFiles] = useState([]); // ✅ 이미지 선택

    // ✅ 이미지 파일 선택 시 로컬 상태에 저장 (즉시 업로드 X)
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles([...selectedFiles, ...files]);
    };

    // ✅ 게시글 제출 시 모든 데이터 함께 업로드
    const submitNews = async () => {
        if (!title || !content || !boardType) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("writerId", userInfo.id);
        formData.append("typeId", boardType);

        selectedFiles.forEach((file) => {
            formData.append(`images`, file);
        });

        try {
            await axios.post("http://localhost:8080/news/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("뉴스가 성공적으로 등록되었습니다!");
            window.location.href = "/news";
        } catch (error) {
            console.error("게시글 업로드 오류:", error);
            alert("업로드에 실패했습니다.");
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">뉴스 작성</h1>
            <input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded-md mb-3" />
            <NewsEditor setContent={setContent} />
            <button onClick={submitNews} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">게시하기</button>
        </div>
    );
};

export default NewsForm;
