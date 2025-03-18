// app/chat/page.js
"use client";

import ChatBox from "@/components/ai/ChatBox";

const ChatPage = () => {
    return (
        <div className="min-h-screen p-4">
            <h1 className="text-3xl font-bold text-center mb-4">
                <div className="w-2/6 -mb-2 m-auto">
                <img src="/logo.png" />
            </div></h1>
            <ChatBox />
        </div>
    );
};

export default ChatPage;
