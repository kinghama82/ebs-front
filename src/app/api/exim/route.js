

export async function GET(request) {
    // .env에서 API_KEY 가져오기
    const apiKey = process.env.API_KEY;

    // 요청 파라미터 추출
    const url = new URL('https://www.koreaexim.go.kr/site/program/financial/exchangeJSON');
    const searchParams = new URLSearchParams(request.url.split('?')[1]);

    // 오늘 날짜 구하기 (YYYYMMDD 형식)
    const today = new Date();
    const hour = today.getHours(); // 현재 시간(hour 가져옴)
    if (hour < 11) {               // 11시 이전인 경우
        today.setDate(today.getDate() - 1); // 날짜를 하루 전으로 설정
    }
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;

    // API 호출에 필요한 파라미터 추가
    searchParams.append('authkey', apiKey);
    searchParams.append('searchdate', formattedDate);
    searchParams.append('data', 'AP01');
    url.search = searchParams.toString();

    // API 요청
    try {
        console.log("현재 요청 Url : ", url)
        const response = await fetch(url,{
            
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            mode: "cors", 
        })
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const data = await response.json();
        if (!data || data.length === 0) {
            throw new Error("API에서 유효한 데이터를 받지 못했습니다.");
        }

        // 필터링할 통화 종류 (USD, EUR, JPY(100))
        const filteredRates = data.filter(item =>
            ['USD', 'EUR', 'JPY(100)'].includes(item.cur_unit)
        );

        return new Response(JSON.stringify(filteredRates), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}