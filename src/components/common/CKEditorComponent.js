'use client';

import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function CKEditorComponent() {
    const [editorData, setEditorData] = useState('Welcome to CKEditor 5!');

    return (
        <div>
            <CKEditor
                editor={ClassicEditor}
                data={editorData}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditorData(data);
                }}
                config={{
                    toolbar: [
                        'heading', '|',
                        'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                        'insertTable', 'imageUpload', 'mediaEmbed', '|',
                        'undo', 'redo'
                    ],
                    mediaEmbed: {
                        previewsInData: true
                    }
                }}
            />
        </div>
    );
}
