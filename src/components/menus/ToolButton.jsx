"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Pencil, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function ToolButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const menuRef = useRef(null); // 메뉴 컨테이너 참조

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 바깥 클릭 감지 핸들러
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleScrollButtonClick = () => {
    if (isAtTop) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div ref={menuRef} className="fixed bottom-5 right-5 flex flex-col items-end gap-2 z-50">
      {isOpen && (
        <div className="flex flex-col gap-2">
          {/* 글 작성 버튼 */}
          <Button
            title="글 작성"
            onClick={() => (window.location.href = "/write")}
            className="w-12 h-12 rounded-full shadow-lg bg-[#AD927A] text-white font-bold hover:bg-[#8C7A65]"
          >
            <Pencil size={30} />
          </Button>

          {/* 스크롤 버튼 */}
          <Button
            onClick={handleScrollButtonClick}
            className="w-12 h-12 rounded-full shadow-lg bg-[#AD927A] text-white font-bold hover:bg-[#8C7A65]"
            title={isAtTop ? "맨 아래로" : "맨 위로"}
          >
            {isAtTop ? <ChevronDown size={30} /> : <ChevronUp size={30} />}
          </Button>
        </div>
      )}

      {/* 메뉴 열기/닫기 버튼 (애니메이션 추가) */}
      <motion.div
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full shadow-lg bg-[#AD927A] text-white font-bold hover:bg-[#8C7A65]"
          title={isOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          <Plus size={30} />
        </Button>
      </motion.div>
    </div>
  );
}
