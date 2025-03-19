import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Brain, Club, Dice5, Gamepad2, Search, Sword, Users } from "lucide-react";

const categories = [
    { name: "전체", icon: <img src="allIcon.png" className="w-[50px]" /> },
    { name: "전략", icon: <Gamepad2 size={40} /> },
    { name: "파티", icon: <Users size={40} /> },
    { name: "추리", icon: <Search size={40} /> },
    { name: "RPG", icon: <Sword size={40} /> },
    { name: "교육", icon: <Book size={40} /> },
    { name: "카드", icon: <Club size={40} /> },
    { name: "주사위", icon: <Dice5 size={40} /> },
    { name: "기억력", icon: <Brain size={40} /> },
];

const CategoryIcons = () => {
    const router = useRouter();

    const handleCategoryClick = (categoryName) => {
        if (categoryName === "전체") {
            router.push("/games"); // ✅ "전체" 클릭 시 "/games"로 이동
        } else {
            router.push(`/category/${encodeURIComponent(categoryName)}`); // ✅ 나머지는 기존 방식 유지
        }
    };

    return (
        <div className="relative flex justify-center space-x-7">
            {categories.map((category, index) => (
                <Card
                    key={index}
                    className="w-25 h-24 flex flex-col border border-black items-center justify-center cursor-pointer hover:bg-gray-200 hover:text-black"
                    onClick={() => handleCategoryClick(category.name)} // ✅ 클릭 이벤트 함수 사용
                >
                    <CardContent className="flex flex-col items-center p-2">
                        {category.icon}
                        <span className="mt-2 text-base font-bold">{category.name}</span>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CategoryIcons;
