'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditExample from '../jhkexample/EditExample';
import axios from 'axios';
import { API_SERVER_HOST } from '@/api/publicapi';
import { useCustomCookie } from './useCustomCookie';
import { Button } from '../ui/button';

export default function BoardEditor({ id, boardType }) {
    const router = useRouter()
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [tempImage, setTempImage] = useState([])
    const [imageList, setImageList] = useState([])
    const userInfo = useCustomCookie()
    const [isSubmitting, setIsSubmitting] = useState(false)

    //기존 게시글 불러오기
    useEffect(() => {
        if (id) {
            getFree(id).then(data => {
                setTitle(data.title);
                setContent(data.content);
                setImageList(data.uploadFileNames || []);
            }).catch(error => console.error("게시글 불러오기 실패:", error));
        }
    }, [id]);


    const handleSave = async () => {
        if (isSubmitting) return; // ✅ 이미 요청 중이면 실행하지 않음
        setIsSubmitting(true); // ✅ 요청 시작

        let updatedContent = content; // 기본적으로 입력한 본문 사용
        let uploadedImgFile = ""

        const formData = new FormData();
        // ✅ 이미지가 포함된 경우, 먼저 서버에 업로드 후 URL을 본문에 반영
        if (tempImage) {            
            formData.append('files', tempImage.file);
            try {
                const { data: uploadFileName } = await axios.post(`${API_SERVER_HOST}/api/${boardType}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                console.log("📸 업로드된 이미지 URL:", uploadFileName);
                uploadedImgFile = uploadFileName;

                // ✅ Base64 이미지를 업로드된 파일명으로 변경
                updatedContent = updatedContent.replace(tempImage.preview, `${API_SERVER_HOST}/api/${boardType}/view/${uploadedImgFile}`);
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
            uploadFileNames: uploadedImgFile ? [uploadedImgFile] : [...imageList]
        };

        try {
            if(id){
                //수정모드
                await axios.put(`${API_SERVER_HOST}/api/${boardType}/${id}`, payload,{
                    headers: {'Content-Type' : 'application/json'},
                })
                
            }else{
                //작성모드
                await axios.post(`${API_SERVER_HOST}/api/${boardType}/`, payload, {
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            
            router.push(`/${boardType}`);
        } catch (error) {
            console.error('게시글 저장 실패:', error);
        } finally {
            setIsSubmitting(false)
        }
    }


return (
    <div className="p-2 mb-2">
        <input
            type="text"
            className="w-full border-2 border-gray-400 rounded p-2 mb-4 mt-4"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <EditExample content={content} onUpdate={setContent} tempImages={tempImage} setTempImages={setTempImage} />
        <div className='mt-2 grid grid-cols-12'>
            <Button variant="mocha" className="mt-2">목 록</Button>
            <div className='grid col-span-10' />
            <Button
                className="mt-2"
                variant="mocha"
                onClick={handleSave}
                disabled={isSubmitting}
            >
                {isSubmitting ? "저장 중..." : "등 록"}
            </Button>
        </div>

    </div>
);
}
