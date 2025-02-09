"use client";

import { useEffect, useState } from "react";

const ExRateComponent = () => {
    const [exchangeRates, setExchangeRates] = useState([]); // API로 가져온 환율 데이터를 저장, 초기값은 빈 배열
    const [currentRateIndex, setCurrentRateIndex] = useState(0); // 현재 보여줄 환율 데이터의 인덱스를 관리
    const [error, setError] = useState(null); // API 호출 중 발생한 에러 메시지를 저장
    const [loading, setLoading] = useState(true); // API 호출 상태를 관리, 로딩이 끝나면 false
    const [isAnimating, setIsAnimating] = useState(true); // 애니메이션 상태를 관리, true - 슬라이드 인, false - 슬라이드 아웃
    const [lastAvailableRates, setLastAvailableRates] = useState([]); // 마지막으로 사용 가능한 환율 데이터를 저장
    const [rateDate, setRateDate] = useState(''); // 환율 데이터의 날짜를 저장

    // 오늘 날짜를 YYYYMMDD 형식으로 변환하는 함수
    const getTodayDate = (daysBefore = 0) => {
        const today = new Date();
        const hour = today.getHours(); // 현재 시간(hour)을 가져옴
        if (hour < 11 && daysBefore === 0) { // 11시 이전인 경우
            daysBefore = 1; // 날짜를 하루 전으로 설정
        }
        today.setDate(today.getDate() - daysBefore);
        const year = today.getFullYear(); // 연도를 yyyy로 반환
        const month = String(today.getMonth() + 1).padStart(2, "0"); // 월을 2자리로 반환
        const day = String(today.getDate()).padStart(2, "0"); // 일을 2자리로 반환
        return `${year}${month}${day}`; // yyyyMMdd 형태로 반환
    };

    // 통화 기호 매핑
    const currencySymbols = {
        USD: "$",
        EUR: "€",
        "JPY(100)": "¥",
    };

    useEffect(() => {
        // API 호출
        const fetchExchangeRates = async (daysBefore = 0, retryCount = 0) => {
            const searchDate = getTodayDate(daysBefore);
            const apiUrl = `/api/site/program/financial/exchangeJSON?authkey=${process.env.NEXT_PUBLIC_EXIM_API_KEY}&searchdate=${searchDate}&data=AP01`;

            try {
                const response = await fetch(apiUrl); // 지정된 URL로 요청을 보냄
                if (!response.ok) { // HTTP 응답 상태 코드가 200번대(성공)인지 확인
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json(); // 응답 본문을 JSON으로 파싱
                // 필요한 통화 필터링 (USD, EUR, JPY)
                const filteredRates = data.filter((item) =>
                    ["USD", "EUR", "JPY(100)"].includes(item.cur_unit)
                );
                if (filteredRates.length > 0) {
                    setExchangeRates(filteredRates); // 필터링한 결과를 exchangeRates에 저장
                    setLastAvailableRates(filteredRates); // 마지막으로 사용 가능한 환율 데이터를 저장
                    setRateDate(searchDate); // 환율 데이터의 날짜를 저장
                } else if (daysBefore < 5) {
                    fetchExchangeRates(daysBefore + 1); // 데이터가 없으면 하루 전으로 다시 호출
                }
            } catch (err) {
                if (retryCount < 3) {
                    fetchExchangeRates(daysBefore, retryCount + 1); // 재시도 횟수를 제한
                } else {
                    setError(err.message); // 에러 메시지를 저장
                }
            } finally {
                setLoading(false); // 로딩 상태를 false로 설정
            }
        };

        fetchExchangeRates(); // 컴포넌트가 마운트될 때 API 호출
    }, []);

    useEffect(() => {
        // 통화를 주기적으로 변경하는 타이머 설정
        const interval = setInterval(() => {
            setIsAnimating(false); // 슬라이드 아웃 시작
            setTimeout(() => {
                setCurrentRateIndex((prevIndex) =>
                    exchangeRates.length > 0 ? (prevIndex + 1) % exchangeRates.length : 0
                );
                setIsAnimating(true); // 슬라이드 인 시작
            }, 500); // 슬라이드 아웃 후 대기 시간
        }, 4000); // 4초마다 실행

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 해제
    }, [exchangeRates]);

    if (loading) return <p className="text-gray-500">Loading...</p>; // 로딩 중일 때 표시
    if (error) return <p className="text-red-500">Error: {error}</p>; // 에러 발생 시 표시

    const currentRate = exchangeRates.length > 0 ? exchangeRates[currentRateIndex] : lastAvailableRates[currentRateIndex];

    // 스타일 정의
    const slideInStyle = { // 슬라이드 인: 아래에서 위로
        animation: "slideIn 0.7s ease forwards",
    };
    const slideOutStyle = { // 슬라이드 아웃: 위로 사라짐
        animation: "slideOut 0.7s ease forwards",
    };
    const keyframes = `
        @keyframes slideIn {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(-100%); opacity: 0; }
        }
    `;

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
            <style>{keyframes}</style>
            <h1>오늘의 환율 (기준일: {rateDate})</h1>
            {currentRate ? (
                <div style={isAnimating ? slideInStyle : slideOutStyle}>
                    <p>
                        {currentRate.cur_nm} ({currencySymbols[currentRate.cur_unit]}) : {currentRate.kftc_deal_bas_r}
                    </p>
                </div> // 통화 이름(통화 기호) : 환율 값
            ) : (
                <p>No exchange rate data available.</p> // 데이터가 없을 때 표시
            )}
        </div>
    );
};

export default ExRateComponent;
