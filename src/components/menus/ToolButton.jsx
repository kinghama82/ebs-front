"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Pencil, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

//특정주소에서 안보이게
const HIDDEN_PATHS = ["/games", "/news", "/mypage"]

//현재 주소 읽어오기(localhost:8080/free <-- 여까지 읽어옴)
const useBaseURL = () => {
  const pathname = usePathname(); // "/free/create"
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin; // "http://localhost:8080"
      const basePath = pathname.split('/').slice(0, 2).join('/'); // "/free"
      setBaseUrl(`${origin}${basePath}/create`)
    }
  }, [pathname])
  return baseUrl;
};

export default function ToolButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const menuRef = useRef(null); // 메뉴 컨테이너 참조
  const pathname = usePathname()
  const router = useRouter();
  const baseURL = useBaseURL();


  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);



  const goToBaseUrl = () => {
    if (baseURL) {
      router.push(baseURL);
    }
  }

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
    <div ref={menuRef} className="fixed bottom-5 right-8 flex flex-col items-end gap-2 z-50">
      {isOpen && (
        <div className="flex flex-col gap-2">
          {/* 글 작성 버튼 */}
          {!(pathname === "/" ||HIDDEN_PATHS.some((path) => pathname.startsWith(path))) && (
            <Button
              title="글 작성"
              onClick={goToBaseUrl}
              className="w-12 h-12 rounded-full shadow-lg bg-[#AD927A] text-white font-bold hover:bg-[#8C7A65]"
            >
              <Pencil size={30} />
            </Button>
          )}
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
