"use client";

import React, { useRef, useState } from "react";
import { AlignRight, AlignLeft, AlignJustify, FileImage, TvMinimalPlay, Bold, Italic, Strikethrough, Underline } from "lucide-react";
import { SketchPicker } from "react-color";
import { Button } from "@/components/ui/button";

const EditorToolbar = ({ editor, insertYouTube }) => {
    const [colorPickerVisible, setColorPickerVisible] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#000000");
    const fileInputRef = useRef(null);

    if (!editor) {
        return null;
    }

    // 색상 선택
    const toggleColorPicker = () => {
        setColorPickerVisible(!colorPickerVisible);
    };

    const handleColorChange = (color) => {
        setSelectedColor(color.hex);
        editor.chain().focus().setColor(color.hex).run();
    };

    return (
        <div className="flex items-center bg-gray-100 rounded-lg p-3 gap-2 shadow-md">
            {/* 글자 스타일 */}
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={20} /></Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={20} /></Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={20} /></Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline size={20} /></Button>

            {/* 색상 선택 */}
            <Button variant="ghost" onClick={toggleColorPicker}>색상</Button>
            {colorPickerVisible && (
                <div className="absolute top-12 z-50 bg-white p-2 shadow-md rounded-lg">
                    <SketchPicker color={selectedColor} onChangeComplete={handleColorChange} />
                </div>
            )}

            {/* 정렬 */}
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft size={20} /></Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignJustify size={20} /></Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight size={20} /></Button>

            {/* ✅ 유튜브 삽입 버튼 */}
            <Button variant="ghost" size="icon" onClick={insertYouTube}><TvMinimalPlay size={20} /></Button>
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current.click()}><FileImage size={20} /></Button>

            {/* 파일 업로드 input */}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
        </div>
    );
};

export default EditorToolbar;
