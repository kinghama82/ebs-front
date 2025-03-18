'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { newgame } from '@/api/game/gameapi';

export default function NewGamePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        gameName: '',
        year: '',
        players: '',
        time: '',
        reage: '',
        company: '',
        sCompany: '',
        price: 0,
        enGameName: '',
        bestPlayers: '',
        avg: 0,
        gamerank: 0,
    });
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append("game", JSON.stringify(formData)); // JSON 데이터 추가
            if (imageFile) {
                data.append("img", imageFile); // 이미지 파일 추가
            }

            // API 호출 (axios 활용)
            const response = await newgame(data);

            // 성공 시 페이지 이동
            router.push('/games');
        } catch (error) {
            console.error('게임 등록 중 오류 발생:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4">게임 등록</h1>
            <form onSubmit={handleSubmit}>
                {/* 게임 정보 입력 폼 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="gameName">게임 이름</label>
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
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="players">영어게임이름</label>
                    <input
                        type="text"
                        name="enGameName"
                        id="enGameName"
                        value={formData.enGameName}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                {/* 연도 입력 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="year">연도</label>
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
                    <label className="block mb-1" htmlFor="players">플레이어 수</label>
                    <input
                        type="text"
                        name="players"
                        id="players"
                        value={formData.players}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="players">플레이 시간</label>
                    <input
                        type="text"
                        name="time"
                        id="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="players">나이</label>
                    <input
                        type="text"
                        name="reage"
                        id="reage"
                        value={formData.reage}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="players">베스트 인원</label>
                    <input
                        type="text"
                        name="bestPlayers"
                        id="bestPlayers"
                        value={formData.bestPlayers}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="players">출시회사</label>
                    <input
                        type="text"
                        name="company"
                        id="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="players">판매회사</label>
                    <input
                        type="text"
                        name="sCompany"
                        id="sCompany"
                        value={formData.sCompany}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="players">가격</label>
                    <input
                        type="text"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1" htmlFor="players">평점</label>
                    <input
                        type="text"
                        name="sCompany"
                        id="sCompany"
                        value={formData.avg}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* 이미지 파일 업로드 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="imgFile">이미지 파일 업로드</label>
                    <input
                        type="file"
                        name="imgFile"
                        id="imgFile"
                        onChange={handleFileChange}
                        className="w-full"
                        accept="image/*"
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
}
