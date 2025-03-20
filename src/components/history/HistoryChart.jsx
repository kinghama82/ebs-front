"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Chart } from "chart.js";
import { useEffect } from "react";


ChartJS.register(ArcElement, Tooltip, Legend);

// 가운데 텍스트 플러그인 추가
const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
        const { width } = chart;
        const { height } = chart;
        const ctx = chart.ctx;
        ctx.restore();

        // 총 전적 계산
        const totalGames = chart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);

        // 텍스트 스타일 설정
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "#333"; // 글씨 색상
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // 도넛 중앙 위치
        const x = width / 2;
        const y = height /2;

        // ✅ 텍스트 위치 조정 (여기서 조정 가능!)
        const titleYOffset = 30; 
        const valueYOffset = -8;  
        
        // 윗줄 총 전적수
        ctx.font = "bold 40px Arial";
        ctx.fillStyle = "#333"; // 진한 색
        ctx.fillText(`${totalGames}`, x, y + valueYOffset); // 🔥 위치 조정

         // 아랫줄 플레이
         ctx.font = "bold 22px Arial";
         ctx.fillStyle = "#666"; // 회색 계열
         ctx.textAlign = "center";
         ctx.textBaseline = "middle";
         ctx.fillText("플레이", x, y + titleYOffset);
        
        ctx.save();
    },
};

const HistoryChart = ({ win, draw, lose }) => {
    useEffect(()=>{
        Chart.register(centerTextPlugin)

        return () => {
            Chart.unregister(centerTextPlugin)
        }
    },[])

    const data = {
        labels: ["승", "무", "패"],
        datasets: [
            {
                data: [win, draw, lose], // 전달된 데이터 값 사용
                backgroundColor: ["#4CAF50", "#FFC107", "#F44336"], // 초록색, 노란색, 빨간색
                hoverBackgroundColor: ["#388E3C", "#FFA000", "#D32F2F"], // 호버 색상
                borderWidth: 2,
                hoverOffset: 15,
            },
        ],
    };

    const options = {
        responsive: true,
        cutout: "50%",
        plugins: {
            legend: { display: false, position: "top" },
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(0, 0, 0, 0.8)", // 툴팁 배경색
                titleAlign: "center", // 제목 중앙 정렬
                bodyAlign: "center", // 본문 중앙 정렬
                displayColors: true, // 색상 박스 숨김
                padding: 10, // 내부 여백 증가
                callbacks: {
                    title: () => "",
                    label: (tooltipItem) => {
                        const label = tooltipItem.label; // "승", "무", "패"
                        const value = tooltipItem.raw; // 해당 값
                        return ` ${label}: ${value}회`; // 한 줄로 표시
                    },
                },
            },
        },
    };

    return (
         <div className="w-65 h-65 flex justify-center items-center">
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default HistoryChart
