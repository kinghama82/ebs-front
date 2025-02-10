import ExRateComponent from "@/components/ExrateComponent";
import Image from "next/image";
// app/page.js

/**
 * 백엔드 API에서 게임 목록을 가져옵니다.
 * cache: 'no-store' 옵션은 매번 최신 데이터를 가져오도록 합니다.
 */


/**
 * Home 컴포넌트는 서버 컴포넌트로 동작하며,
 * 백엔드에서 데이터를 불러와 게임 목록을 렌더링합니다.
 */
export default async function Home() {
  

  return (
    <div>
      <h1>메인화면입니다다</h1>
      <Image src="/dice.jpg" alt="dice" width={500} height={500} />
      <ExRateComponent/>
    </div>
  );
}
