"use client";
import { useState, useRef, useEffect } from "react";
import { API_SERVER_HOST } from "@/api/publicapi";

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!inputValue.trim()) return;
        const userMessage = { sender: "user", text: inputValue };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setLoading(true);

        try {
            const response = await fetch(`${API_SERVER_HOST}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage.text }),
            });
            const data = await response.json();

            if (data.reply.startsWith("🎲 추천 게임:")) {
                const lines = data.reply.split("\n");
                const gameData = {
                    name: lines[0].replace("🎲 추천 게임: **", "").replace("**", ""),
                    players: lines[1].replace("👥 인원: ", ""),
                    time: lines[2].replace("⏳ 플레이 시간: ", ""),
                    company: lines[3].replace("📝 제작사: ", ""),
                    img: lines[4].replace("🖼️ ![게임 이미지](", "").replace(")", ""),
                };

                setMessages((prev) => [...prev, { sender: "bot", game: gameData }]);
            } else {
                setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { sender: "bot", text: "오류가 발생했습니다. 다시 시도해주세요." }]);
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
            <div className="flex-1 overflow-y-auto p-4 border rounded-lg">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2 rounded ${msg.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"}`}>
                        {msg.game ? (
                            <div className="p-2 border rounded-lg bg-white shadow">
                                <strong className="text-lg">{msg.game.name}</strong>
                                <p>👥 {msg.game.players} | ⏳ {msg.game.time}</p>
                                <p>📝 {msg.game.company}</p>
                                <img
                                    src={msg.game.img || "/default-game.jpg"}
                                    alt={msg.game.name}
                                    className="w-32 h-32 rounded mt-2"
                                />
                            </div>
                        ) : msg.text}
                    </div>
                ))}
            </div>

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
