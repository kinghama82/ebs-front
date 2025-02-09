import ExRateComponent from "@/components/ExrateComponent";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>메인화면입니다다</h1>
      <Image src="/dice.jpg" alt="dice" width={500} height={500} />
      <ExRateComponent/>
    </div>
  );
}
