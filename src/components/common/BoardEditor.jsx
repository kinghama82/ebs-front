'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditExample from '../jhkexample/EditExample';
import axios from 'axios';
import { API_SERVER_HOST } from '@/api/publicapi';
import { useCustomCookie } from './useCustomCookie';

export default function BoardEditor({ id, boardType }) {
    const router = useRouter()
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [tempImages, setTempImages] = useState([])
    const [imageList, setImageList] = useState([])
    const userInfo = useCustomCookie()
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (id) {
            // 기존 게시글 불러오기
            fetch(`/api/${boardType}/${id}`)
                .then(res => res.json())
                .then(data => {
                    setTitle(data.title)
                    setContent(data.content)
                    setImageList(data.imageList || [])
                });
        }
    }, [id]);


    const handleSave = async () => {
        if (isSubmitting) return; // ✅ 이미 요청 중이면 실행하지 않음
        setIsSubmitting(true); // ✅ 요청 시작

        let updatedContent = content; // 기본적으로 입력한 본문 사용
        let uploadedImgFiles = []

        // ✅ 이미지가 포함된 경우, 먼저 서버에 업로드 후 URL을 본문에 반영
        if (tempImages.length > 0) {
            const formData = new FormData();
            tempImages.forEach((tempImage) => {
                formData.append('files', tempImage.file);
            });

            try {
                const { data: uploadFileNames } = await axios.post(`${API_SERVER_HOST}/api/${boardType}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                console.log("📸 업로드된 이미지 URL:", uploadFileNames);
                uploadedImgFiles = uploadFileNames

                // ✅ Base64 이미지를 업로드된 파일명으로 변경
                tempImages.forEach((tempImage, index) => {
                    updatedContent = updatedContent.replace(tempImage.preview, `${API_SERVER_HOST}/api/${boardType}/view/${uploadedImgFiles[index]}`);
                });

            } catch (error) {
                console.error('이미지 업로드 실패:', error);
                return;
            }
        }

        console.log("📝 저장될 게시글 내용:", updatedContent); // ✅ content가 올바른지 확인

        const { createdate, ...safeGamer } = userInfo;

        // ✅ 게시글 저장 요청 (이미지는 URL로 변환된 상태)
        const payload = {
            title,
            content: updatedContent,
            gamer: safeGamer,
            uploadFileNames: [...imageList, ...uploadedImgFiles]
        };

        try {
            await axios.post(`${API_SERVER_HOST}/api/${boardType}/`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            router.push(`/${boardType}`);
        } catch (error) {
            console.error('게시글 저장 실패:', error);
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <div className="p-4">
            <input
                type="text"
                className="w-full border p-2 mb-4"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <EditExample content={content} onUpdate={setContent} tempImages={tempImages} setTempImages={setTempImages} />
            <button
                onClick={handleSave}
                disabled={isSubmitting}
                className={`mt-4 px-4 py-2 rounded ${isSubmitting ? "bg-gray-400" : "bg-blue-500 text-white"}`}
            >
                {isSubmitting ? "저장 중..." : "저장하기"}
            </button>
        </div>
    );
}
