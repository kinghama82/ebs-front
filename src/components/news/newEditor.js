"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

const TiptapEditor = ({ onSave }) => {
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [showYoutubeInput, setShowYoutubeInput] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]); // ✅ 모달에서 추가된 파일 (임시 저장)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Youtube,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Underline,
            Strike,
            Blockquote,
            BulletList,
            OrderedList,
            ListItem,
        ],
        content: "<p>여기에 내용을 입력하세요...</p>",
        editorProps: {
            immediatelyRender: false, // ✅ SSR 문제 해결
        },
    });

    if (!editor) return null;

    /** ✅ 유튜브 추가 */
    const addYoutubeVideo = () => {
        if (youtubeUrl) {
            editor.chain().focus().setYoutubeVideo({ src: youtubeUrl, width: 560, height: 315 }).run();
            setShowYoutubeInput(false);
            setYoutubeUrl("");
        }
    };

    /** ✅ 모달 열기 (새로운 이미지 추가 시 초기화) */
    const openImageModal = () => {
        setSelectedFiles([]); // ✅ 새 이미지 추가를 위해 초기화
        setShowImageModal(true);
    };

    /** ✅ 드래그앤드롭 및 파일 선택으로 이미지 추가 */
    const handleImageUpload = (event) => {
        event.preventDefault();

        let files = [];
        if (event.dataTransfer) {
            files = Array.from(event.dataTransfer.files);
        } else if (event.target.files) {
            files = Array.from(event.target.files);
        }

        if (files.length > 0) {
            setSelectedFiles(files); // ✅ 새 이미지만 추가 (기존 이미지 유지 X)
        }
    };

    /** ✅ 기존 내용을 유지하면서 새로운 이미지만 추가 */
    const addImagesToEditor = async () => {
        if (selectedFiles.length === 0) return;

        const imagePromises = selectedFiles.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        });

        try {
            const imageUrls = await Promise.all(imagePromises);

            imageUrls.forEach((src) => {
                editor.chain().focus().setImage({ src }).run();
            });

            // ✅ 모달 닫을 때 `selectedFiles` 초기화
            setTimeout(() => {
                setShowImageModal(false);
                setSelectedFiles([]); // ✅ 중복 추가 방지
            }, 100);
        } catch (error) {
            console.error("이미지 로딩 중 오류 발생:", error);
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-md">
            <div className="flex gap-2 mb-2">
                <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn">B</button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn">I</button>
                <button onClick={() => setShowYoutubeInput(true)} className="btn">🎥 유튜브</button>
                <button onClick={openImageModal} className="btn">🖼 이미지</button>
            </div>

            {/* ✅ 유튜브 추가 입력 필드 */}
            {showYoutubeInput && (
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="유튜브 URL 입력"
                        className="border p-1 flex-1"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <button onClick={addYoutubeVideo} className="btn">✅ 추가</button>
                    <button onClick={() => setShowYoutubeInput(false)} className="btn">❌ 취소</button>
                </div>
            )}

            {/* ✅ 이미지 업로드 모달 */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-2">이미지 업로드</h2>

                        {/* ✅ 드래그앤드롭 영역 */}
                        <div
                            className="border-2 border-dashed p-6 text-center"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleImageUpload}
                        >
                            <p>이미지를 여기에 드래그하세요.</p>
                        </div>

                        {/* ✅ 파일 선택 버튼 */}
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="mt-2" />

                        {/* ✅ 이미지 미리보기 */}
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {selectedFiles.map((file, index) => (
                                <img key={index} src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover" />
                            ))}
                        </div>

                        {/* ✅ 추가 버튼 */}
                        <div className="flex justify-end mt-4">
                            <button onClick={addImagesToEditor} className="btn bg-blue-500 text-white px-4 py-2 rounded">추가</button>
                            <button onClick={() => setShowImageModal(false)} className="btn ml-2 px-4 py-2 rounded">취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Tiptap 에디터 */}
            <EditorContent editor={editor} className="border p-2 min-h-[200px]" />

            {/* ✅ 저장 버튼 */}
            <button
                onClick={() => onSave(editor.getHTML(), youtubeUrl, selectedFiles)}
                className="mt-2 bg-blue-500 text-white p-2 rounded"
            >
                저장하기
            </button>
        </div>
    );
};

export default TiptapEditor;
