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
    const [selectedFiles, setSelectedFiles] = useState([]);

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
        content: "", // 초기 내용은 빈 문자열
        editorProps: {
            immediatelyRender: false,
        },
    });

    if (!editor) return null;

    /** 유튜브 추가 */
    const addYoutubeVideo = () => {
        if (youtubeUrl) {
            editor.chain().focus().setYoutubeVideo({ src: youtubeUrl, width: 560, height: 315 }).run();
            setShowYoutubeInput(false);
            setYoutubeUrl("");
        }
    };

    /** 모달 열기 */
    const openImageModal = () => {
        setSelectedFiles([]); // 새 파일 선택을 위해 초기화
        setShowImageModal(true);
    };

    /** 이미지 선택 이벤트 */
    const handleImageUpload = (event) => {
        event.preventDefault();
        const files = event.target.files ? Array.from(event.target.files) : [];
        if (files.length > 0) {
            // 기존 파일 유지하며 새 파일 추가
            setSelectedFiles((prev) => [...prev, ...files]);
        }
    };

    /** 여러 개의 이미지 업로드 및 삽입 (JSON 노드 방식) */
    const addImagesToEditor = async () => {
        if (selectedFiles.length === 0) return;

        try {
            // 파일들을 서버에 업로드하고 URL을 받아옴
            const uploadPromises = selectedFiles.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("http://localhost:8080/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) throw new Error("Upload failed");

                const data = await response.json();
                return data.imageUrl;
            });

            const imageUrls = await Promise.all(uploadPromises);

            // 각 이미지 URL을 JSON 이미지 노드로 변환
            const imageNodes = imageUrls.map((src) => ({
                type: "image",
                attrs: { src, alt: "uploaded image" },
            }));

            // 현재 커서가 문단 내부일 수 있으므로 문단 분리 후 삽입
            editor.chain().focus("end").splitBlock().run();
            editor.chain().focus("end").insertContent(imageNodes).run();

            setShowImageModal(false);
            setSelectedFiles([]);
        } catch (error) {
            console.error("이미지 업로드 오류:", error);
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

            {/* 유튜브 입력 필드 */}
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

            {/* 이미지 업로드 모달 */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-2">이미지 업로드</h2>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="mt-2" />
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {selectedFiles.map((file, index) => (
                                <img key={index} src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover" />
                            ))}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={addImagesToEditor} className="btn bg-blue-500 text-white px-4 py-2 rounded">
                                추가
                            </button>
                            <button onClick={() => setShowImageModal(false)} className="btn ml-2 px-4 py-2 rounded">
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tiptap 에디터 */}
            <EditorContent editor={editor} className="border p-2 min-h-[200px]" />

            {/* 저장 버튼 */}
            <button onClick={() => onSave(editor.getHTML(), youtubeUrl, selectedFiles)} className="mt-2 bg-blue-500 text-white p-2 rounded">
                저장하기
            </button>
        </div>
    );
};

export default TiptapEditor;
