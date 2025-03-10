"use client"

import { useEffect, useState } from "react";

const ExRateComponent = () => {
    const [exchangeRates, setExchangeRates] = useState([]);   //api로 가져온 환율 데이터 저장 초기값은 빈 배열
    const [currentRateIndex, setCurrentRateIndex] = useState(0); //현재 보여줄 환율데이터의 인덱스 관리(슬라이드 애니메이션마다 이 인덱스 변경)
    const [error, setError] = useState(null); //api호출중 발생한 에러메세지 저장
    const [loading, setLoading] = useState(true); //api호출 상태를 관리 -> 로딩이 끝나면 false
    const [isAnimating, setIsAnimating] = useState(true); //애니메이션 상태 관리 true - 슬라이드인 /false- 슬라이드 아웃

    // 통화 기호 매핑
    const currencySymbols = {
        USD: "$",
        EUR: "€",
        "JPY(100)": "¥",
    };

    useEffect(() => {
        // API 호출
        const fetchExchangeRates = async () => {                                                                                                           
            try {
                const response = await fetch('/api/exim');  // Next.js API Route에 요청
                const data = await response.json();
                if (response.ok) {
                  setExchangeRates(data); // 데이터를 상태에 저장
                } else {
                  setError(data.error || "API 요청 실패");
                }
              } catch (err) {
                setError(err.message); // 에러 처리
              } finally {
                setLoading(false); // 로딩 끝
              }
        };
        fetchExchangeRates();
    }, []);

    useEffect(() => {
        // 통화를 주기적으로 변경하는 타이머 설정    슬라이드 아웃 -> 인덱스 변경 -> 슬라이드 인
        const interval = setInterval(() => {
            setIsAnimating(false); //슬라이드 아웃 시작
            setTimeout(() => {
                setCurrentRateIndex((prevIndex) =>
                    exchangeRates.length > 0 ? (prevIndex + 1) % exchangeRates.length : 0
                );
                setIsAnimating(true); //슬라이드 인 시작
            }, 500); //슬라이드 아웃 후 대기 시간
        }, 4000); // 4초마다 실행

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 해제
    }, [exchangeRates]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const currentRate = exchangeRates[currentRateIndex];

    //스타일 정의
    const slideInStyle = {     //슬라이드인 : 아래에서 위로
        animation: "slideIn 0.7s ease forwards",
    };
    const slideOutStyle = {    //현재 표시된 데이터가 위로 사라짐
        animation: "slideOut 0.7s ease forwards",
    };
    const keyframes = `
        @keyframes slideIn {
            from{ transform: translateY(100%); opacity: 0; }
            to{ transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOut {
            from{ transform: translateY(0); opacity: 1; }
            to{ transform: translateY(-100%); opacity: 0; }
        }
    `;

    return (
        <div style={{ fontFamily: "Arial, sans-serif" }}>
            <style>{keyframes}</style>
            {currentRate ? (
                <div style={isAnimating ? slideInStyle : slideOutStyle}>
                    <p>{currentRate.cur_nm}({currencySymbols[currentRate.cur_unit]}) : {currentRate.kftc_deal_bas_r}</p>
                </div>                     // 통화 이름(통화 기호) : 환율 값
            ) : (<p>No exchange rate data available.</p>)}
        </div>         //데이터가 없을 때 출력
    );
};

export default ExRateComponent;
