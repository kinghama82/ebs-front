export async function GET(request) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("❌ API_KEY가 설정되지 않았습니다.");
        return new Response(JSON.stringify({ error: "API_KEY가 설정되지 않았습니다." }), { status: 500 });
    }

    // 날짜 계산 (오전 11시 이전이면 전날 데이터 요청)
    const today = new Date();
    const hour = today.getHours();
    if (hour < 11) {
        today.setDate(today.getDate() - 1);
    }
    const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, "");

    const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${apiKey}&searchdate=${formattedDate}&data=AP01`;

    try {

        const response = await fetch(url);
        if (!response.ok) {
            console.error(`❌ API 요청 실패: ${response.status}`);
            return new Response(JSON.stringify({ error: `API 요청 실패: ${response.status}` }), { status: response.status });
        }

        const data = await response.json();

        // API 오류 응답 (result: 3) 처리
        if (!Array.isArray(data) || data.length === 0 || (data[0].result && data[0].result === 3)) {
            console.error("❌ 환율 데이터 없음");
            return new Response(JSON.stringify({ error: "환율 데이터를 가져올 수 없습니다." }), { status: 500 });
        }

        // 필터링할 통화 종류 (USD, EUR, JPY(100))
        const filteredRates = data.filter(item =>
            ["USD", "EUR", "JPY(100)"].includes(item.cur_unit)
        );

        return new Response(JSON.stringify(filteredRates), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("❌ API 호출 중 오류 발생:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
