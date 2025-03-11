"use client"
import { useEffect, useState } from "react";

const ExRateComponent = () => {
    const [exchangeRates, setExchangeRates] = useState([]);
    const [currentRateIndex, setCurrentRateIndex] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAnimating, setIsAnimating] = useState(true);

    const currencySymbols = {
        USD: "$",
        EUR: "€",
        "JPY(100)": "¥",
    };

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/exim');
                const data = await response.json();
                if (response.ok) {
                    setExchangeRates(data);
                } else {
                    setError(data.error || "환율 데이터를 가져올 수 없습니다.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchExchangeRates();
    }, []);

    useEffect(() => {
        if (exchangeRates.length === 0) return;

        const interval = setInterval(() => {
            setIsAnimating(false);
            setTimeout(() => {
                setCurrentRateIndex((prevIndex) =>
                    (prevIndex + 1) % exchangeRates.length
                );
                setIsAnimating(true);
            }, 500);
        }, 4000);

        return () => clearInterval(interval);
    }, [exchangeRates]);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>❌ 오류: {error}</p>;
    if (exchangeRates.length === 0) return <p>환율 데이터 없음</p>;

    const currentRate = exchangeRates[currentRateIndex];

    const slideInStyle = {
        animation: "slideIn 0.7s ease forwards",
    };
    const slideOutStyle = {
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
        <div style={{ fontFamily: "Arial, sans-serif" }}>
            <style>{keyframes}</style>
            {currentRate ? (
                <div style={isAnimating ? slideInStyle : slideOutStyle}>
                    <p>{currentRate.cur_nm} ({currencySymbols[currentRate.cur_unit]}) : {currentRate.kftc_deal_bas_r}</p>
                </div>
            ) : (
                <p>환율 데이터 없음</p>
            )}
        </div>
    );
};

export default ExRateComponent;
