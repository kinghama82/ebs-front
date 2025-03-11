"use client";

import React from "react";
import { EditorContent } from "@tiptap/react";

const EditorContentArea = ({ editor }) => {
    if (!editor) {
        return <div className="text-gray-500">에디터를 불러오는 중...</div>;
    }

    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md min-h-[300px]">
            <EditorContent editor={editor} />
        </div>
    );
};

export default EditorContentArea;
