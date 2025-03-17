"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tiptap = () => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>안녕하세요! 🌟</p>",
    });

    if (!editor) {
        return null; // 에디터가 로드될 때까지 null 반환
    }

    return (
        <div className="border p-4 rounded-lg">
            <EditorContent editor={editor} />
        </div>
    );
};

export default Tiptap;
