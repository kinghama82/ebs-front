// src/components/GameRegistrationForm.jsx
"use client";
import { useState } from "react";
import { newgame } from "../api/game/gameapi";

const GameRegistrationForm = () => {
    // 게임 등록에 필요한 필드를 상태로 관리합니다.
    const [formData, setFormData] = useState({
        gameName: "",
        year: "",
        players: "",
        time: "",
        reage: "",
        company: "",
        sCompany: "",
        price: "",
        enGameName: "",
        bestPlayers: "",
        avg: "",
        gamerank: "",
        img: ""
    });

    // 입력 필드의 값이 변경될 때 상태 업데이트
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // 폼 제출 시 API를 호출하여 게임 데이터를 등록합니다.
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // newgame 함수로 서버에 데이터를 전송
            const result = await newgame(formData);
            console.log("등록 결과:", result);
            alert("게임이 성공적으로 등록되었습니다!");
            // 등록 후 폼 리셋
            setFormData({
                gameName: "",
                year: "",
                players: "",
                time: "",
                reage: "",
                company: "",
                sCompany: "",
                price: "",
                enGameName: "",
                bestPlayers: "",
                avg: "",
                gamerank: "",
                img: ""
            });
        } catch (error) {
            console.error("게임 등록 실패:", error);
            alert("게임 등록에 실패하였습니다.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4">게임 등록</h1>
            <form onSubmit={handleSubmit}>
                {/* 게임 이름 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="gameName">
                        게임 이름
                    </label>
                    <input
                        type="text"
                        name="gameName"
                        id="gameName"
                        value={formData.gameName}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                {/* 연도 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="year">
                        연도
                    </label>
                    <input
                        type="text"
                        name="year"
                        id="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* 플레이어 수 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="players">
                        플레이어 수
                    </label>
                    <input
                        type="text"
                        name="players"
                        id="players"
                        value={formData.players}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* 시간 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="time">
                        시간
                    </label>
                    <input
                        type="text"
                        name="time"
                        id="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* reage 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="reage">
                        Reage
                    </label>
                    <input
                        type="text"
                        name="reage"
                        id="reage"
                        value={formData.reage}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* 회사 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="company">
                        회사
                    </label>
                    <input
                        type="text"
                        name="company"
                        id="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* 보조 회사 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="sCompany">
                        보조 회사
                    </label>
                    <input
                        type="text"
                        name="sCompany"
                        id="sCompany"
                        value={formData.sCompany}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* 가격 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="price">
                        가격
                    </label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* 영어 게임 이름 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="enGameName">
                        영어 게임 이름
                    </label>
                    <input
                        type="text"
                        name="enGameName"
                        id="enGameName"
                        value={formData.enGameName}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* 베스트 플레이어 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="bestPlayers">
                        베스트 플레이어
                    </label>
                    <input
                        type="text"
                        name="bestPlayers"
                        id="bestPlayers"
                        value={formData.bestPlayers}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* 평균 점수 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="avg">
                        평균 점수
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        name="avg"
                        id="avg"
                        value={formData.avg}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* 게임 랭크 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="gamerank">
                        게임 랭크
                    </label>
                    <input
                        type="number"
                        name="gamerank"
                        id="gamerank"
                        value={formData.gamerank}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* 이미지 URL 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="img">
                        이미지 URL
                    </label>
                    <input
                        type="text"
                        name="img"
                        id="img"
                        value={formData.img}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* 제출 버튼 */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                >
                    게임 등록
                </button>
            </form>
        </div>
    );
};

export default GameRegistrationForm;
