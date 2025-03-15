//src/components/ai/ChatBox.js
"use client";

import { useState, useRef, useEffect } from "react";
import { API_SERVER_HOST } from "@/api/publicapi";

const ChatBox = () => {
    const [messages, setMessages] = useState([]); // { sender: "user" | "bot", text: string }
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // 스크롤을 맨 아래로 내리는 함수
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 메시지 전송 핸들러 (API 호출 포함 예정)
    const sendMessage = async () => {
        if (!inputValue.trim()) return;

        // 사용자 메시지 추가
        const userMessage = { sender: "user", text: inputValue };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setLoading(true);

        try {
            // 백엔드 API 호출 (예시: /api/chat 엔드포인트)
            const response = await fetch(`${API_SERVER_HOST}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage.text }),
            });
            const data = await response.json();

            const botMessage = { sender: "bot", text: data.reply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("채팅 API 호출 실패:", error);
            const errorMessage = { sender: "bot", text: "오류가 발생했습니다. 다시 시도해주세요." };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* 대화 영역 */}
            <div className="flex-1 overflow-y-auto p-4 border rounded-lg">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-2 rounded ${msg.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"}`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <div className="mt-4 flex">
                <input
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 border p-2 rounded-l-lg"
                />
                <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-lg"
                    disabled={loading}
                >
                    {loading ? "전송 중..." : "전송"}
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
