"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🚀 테마 변경 함수 (light ↔ dark 토글)
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // 🚀 서버 사이드 렌더링 문제 방지 (mounted 되기 전에는 아무것도 렌더링하지 않음)
  if (!mounted) return null;

  return (
    <Button variant="link" className="p-1" onClick={toggleTheme}>
      {theme === "dark" ? (
        <Sun className="h-[2rem] w-[2rem] text-white" />
      ) : (
        <Moon className="h-[2rem] w-[2rem] text-amber-800" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
