"use client";

import { Clipboard, ClipboardCheck } from "lucide-react";
import { useState } from "react";

// 사용방법
// 사용할 페이지에서 const [url, setUrl] = useState("")
// useEffect 구문 안에서 setUrl(복사할 url 만들어서 셋팅)
// 그리고 버튼 소환해서 <CopyUrlButton url={url}/> 이렇게 넣어주면 됨

const CopyUrlButton = ({ url }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // 2초 후 "복사됨" 문구 숨기기
        } catch (err) {
            console.error("URL 복사 실패:", err);
        }
    };

    return (
        <div>
            {copied ? 
                <ClipboardCheck className="text-green-500" /> 
            : 
                <Clipboard onClick={handleCopy} className="cursor-pointer"/>} 
            
        </div>
    );
};

export default CopyUrlButton;
