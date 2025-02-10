'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
            // JSON 데이터를 문자열로 변환하여 "game" 파트로 추가
            data.append("game", JSON.stringify(formData));
            // 이미지 파일이 있다면 "img" 파트로 추가
            if (imageFile) {
                data.append("img", imageFile);
            }

            const response = await fetch('http://localhost:8080/games', {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                router.push('/games');
            } else {
                console.error('게임 생성 실패');
            }
        } catch (error) {
            console.error('에러 발생:', error);
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
                        플레이시간
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
                        권장연령
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
                        판매사
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
                {/* 이미지 파일 선택 */}
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="imgFile">
                        이미지 파일 업로드
                    </label>
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

/*

<div>
    <label>이미지 업로드:</label>
    <input type="file" accept="image/!*" onChange={handleFileChange} />
</div>
*/
