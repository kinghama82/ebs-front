import { Card, CardContent } from "@/components/ui/card";
import { Book, Brain, Club, Dice5, Gamepad2, Search, Sword, Users, Zap } from "lucide-react";

const categories = [
    { name: "전략", icon: <Gamepad2 size={40} /> },
    { name: "파티", icon: <Users size={40} /> },
    { name: "추리", icon: <Search size={40} /> },
    { name: "RPG", icon: <Sword size={40} /> },
    { name: "교육", icon: <Book size={40} /> },
    { name: "카드", icon: <Club size={40} /> },
    { name: "주사위", icon: <Dice5 size={40} /> },
    { name: "기억력", icon: <Brain size={40} /> },
    { name: "액션", icon: <Zap size={40} /> },
];

const CategoryIcons = () => {
    return (
        <div className="relative flex justify-center space-x-7">
            {categories.map((category, index) => (
                <Card key={index} className="w-25 h-24 flex flex-col border border-black items-center justify-center">
                    <CardContent className="flex flex-col items-center p-2">
                        {category.icon}
                        <span className="mt-2 text-xs font-semibold">{category.name}</span>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CategoryIcons;
