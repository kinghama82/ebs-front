"use client"

import { useEffect, useState } from "react";



const ExRateComponent = () => {
    const [exchangeRates, setExchangeRates] = useState([]);   //api로 가져온 환율 데이터 저장 초기값은 빈 배열
    const [currentRateIndex, setCurrentRateIndex] = useState(0); //현재 보여줄 환율데이터의 인덱스 관리(슬라이드 애니메이션마다 이 인덱스 변경)
    const [error, setError] = useState(null); //api호출중 발생한 에러메세지 저장
    const [loading, setLoading] = useState(true); //api호출 상태를 관리 -> 로딩이 끝나면 false
    const [isAnimating, setIsAnimating] = useState(true); //애니메이션 상태 관리 true - 슬라이드인 /false- 슬라이드 아웃

    // 오늘 날짜를 YYYYMMDD 형식으로 변환하는 함수
    const getTodayDate = () => {
        const today = new Date();
        const hour = today.getHours(); // 현재 시간(hour 가져옴)
        if (hour < 11) {               // 11시 이전인 경우
            today.setDate(today.getDate() - 1); // 날짜를 하루 전으로 설정
        }
        const year = today.getFullYear();  // 연도를 yyyy 로 반환
        const month = String(today.getMonth() + 1).padStart(2, "0");
        //월표시 = month는 0부터 시작하기 때문에 +1 / padStart(2,"0")은 문자열의 길이를2로하고 길이가 1인경우 앞에 0 추가
        const day = String(today.getDate()).padStart(2, "0");
        //일표시 = day는 1부터 시작해서 그대로 씀 / padStart는 위와 동일한 내용
        return `${year}${month}${day}`;  //yyyyMMdd 형태로 보여줌(이런형식으로 많이 쓰임)
    };

    // 통화 기호 매핑
    const currencySymbols = {
        USD: "$",
        EUR: "€",
        "JPY(100)": "¥",
    };

    useEffect(() => {
        // API 호출
        const fetchExchangeRates = async () => {
            const today = getTodayDate();
            const apiUrl = `/site/program/financial/exchangeJSON?authkey=${process.env.REACT_APP_EXIM_API_KEY}&searchdate=${today}&data=AP01`;
                                                                          //.env 파일에 넣어놓은 API_KEY 불러옴
            try {
                const response = await fetch(apiUrl);  //지정된 url로 요청을 보냄(주로 get요청)
                                                       //await: fetch는 비동기 작업을 하므로 await를 써서 요청이 완료될때까지 기다림
                if (!response.ok) {       //http응답 상태 코드가 200번대(성공)인지 확인 404(리소스없음) 500(서버오류)인 경우 false
                    throw new Error(`HTTP error! status: ${response.status}`);

                }
                const data = await response.json(); //response.json -> 응답본문을 json으로 파싱하는 비동기 메소드
                                                    //json데이터를 자바스크립트 객체나 배열로 변환
                // 필요한 통화 필터링 (USD, EUR, JPY)
                const filteredRates = data.filter((item) =>
                                     //가져온 데이터 배열에서 특정 조건을 만족하는 항목만 걸러냄
                    ["USD", "EUR", "JPY(100)"].includes(item.cur_unit)
                );
                setExchangeRates(filteredRates); //필터링한 결과를 ExchangeRates에 저장
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        
        fetchExchangeRates();
    }, []);

    useEffect(() => {
        // 통화를 주기적으로 변경하는 타이머 설정    슬라이드 아웃 -> 인덱스 변경 -> 슬라이드 인
        const interval = setInterval(() => {
            setIsAnimating(false); //슬라이드 아웃 시작
            setTimeout( ()=> {
                setCurrentRateIndex((prevIndex) =>
                    exchangeRates.length > 0 ? (prevIndex + 1) % exchangeRates.length : 0
                );
                setIsAnimating(true); //슬라이드 인 시작
            },500); //슬라이드 아웃 후 대기 시간
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
        <div style={{ fontFamily: "Arial, sans-serif", padding: "10px" }}>
            <style>{keyframes}</style>
            <h1>오늘의 환율</h1>
            {currentRate ? (
                <div style={isAnimating ? slideInStyle : slideOutStyle}>
                    <p>{currentRate.cur_nm}({currencySymbols[currentRate.cur_unit]}) : {currentRate.kftc_deal_bas_r}</p>
                </div>                     // 통화 이름(통화 기호) : 환율 값
                ) : (<p>No exchange rate data available.</p>)}           
        </div>         //데이터가 없을 때 출력
    );
};

export default ExRateComponent;
