'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditExample from '../jhkexample/EditExample';
import axios from 'axios';
import { API_SERVER_HOST } from '@/api/publicapi';
import { useCustomCookie } from './useCustomCookie';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function BoardEditor({ id, boardType }) {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [tempImage, setTempImage] = useState(null); // ✅ 단일 이미지만 허용
    const userInfo = useCustomCookie();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [category, setCategory] = useState(null)

    
    // ✅ 기존 게시글 불러오기
    useEffect(() => {
        if (id) {
            axios.get(`${API_SERVER_HOST}/api/${boardType}/${id}`)
                .then(({ data }) => {
                    setTitle(data.title);
                    setContent(data.content);
                })
                .catch(error => console.error("게시글 불러오기 실패:", error));
        }
    }, [id]);

    const handleChangeCategory = (category) => {
        console.log("현재 선택한 카테고리 : ", category)
        setCategory(category)
    }

    const handleImageUpload = (newImage) => {
        setTempImage(newImage); // ✅ 새 이미지가 추가되면 기존 이미지 대체
    };

    const handleSave = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        let updatedContent = content;
        let uploadedImgFile = null;

        // ✅ 이미지 업로드
        if (tempImage) {
            const formData = new FormData();
            formData.append('file', tempImage.file);


            try {
                const { data: uploadFileName } = await axios.post(
                    `${API_SERVER_HOST}/api/${boardType}/upload`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );

                uploadedImgFile = uploadFileName;

                if (uploadedImgFile) {
                    updatedContent = updatedContent.replace(
                        tempImage.preview,
                        `${API_SERVER_HOST}/api/${boardType}/view/${uploadedImgFile}`
                    );
                }
            } catch (error) {
                console.error('이미지 업로드 실패:', error);
                return;
            }
        }

        const { createdate, ...safeGamer } = userInfo;

        // ✅ uploadFileNames를 배열로 저장 (이미지가 없으면 빈 배열)
        const payload = {
            title,
            content: updatedContent,
            gamer: safeGamer?.id ? safeGamer : null,
            uploadFileNames: [uploadedImgFile].flat(),
            category
        };
        try {
            await axios.post(`${API_SERVER_HOST}/api/${boardType}/`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            router.push(`/${boardType}`);
        } catch (error) {
            console.error('게시글 저장 실패:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-2 mb-2">
            <div className='flex justify-between w-full'>
                {/* 카테고리 */}
                <div className='w-1/6 mr-2 flex items-center'>
                    <Select onValueChange={handleChangeCategory}>
                        <SelectTrigger className="border-2 border-gray-400">
                            <SelectValue placeholder="카테고리" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="잡담">잡담</SelectItem>
                                <SelectItem value="유머">유머</SelectItem>
                                <SelectItem value="정보">정보</SelectItem>
                                <SelectItem value="질문">질문</SelectItem>
                                {userInfo?.roleNames?.includes("ADMIN") ? (
                                    <div>
                                        <SelectItem value="뉴스">뉴스</SelectItem>
                                        <SelectItem value="공지">공지</SelectItem>
                                    </div>                                    
                                ) : (
                                <></>
                                )}                                
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* 제목입력칸 */}
                <input
                    type="text"
                    className="relative w-5/6 border-2 border-gray-400 rounded p-2 mb-4 mt-4"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <EditExample
                boardType={boardType}
                content={content}
                onUpdate={setContent}
                tempImage={tempImage}
                setTempImage={setTempImage}
                onImageUpload={handleImageUpload}
            />
            <div className='mt-2 flex justify-between'>
                <Button variant="mocha" onClick={() => router.push(`/${boardType}`)}>목록</Button>
                <Button variant="mocha" onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? "저장 중..." : "등록"}
                </Button>
            </div>
        </div>
    );
}
