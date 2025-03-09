"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import PropTypes from "prop-types";

export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    if (resolvedTheme) {
      document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    }

  }, [resolvedTheme]);

  return (
    <NextThemesProvider attribute="class">
      {/* 🚀 Hydration 오류 방지: 서버에서는 빈 값, 클라이언트에서만 테마 적용 */}
      <div className={mounted ? resolvedTheme : undefined} suppressHydrationWarning>
        {children}
      </div>
    </NextThemesProvider>
  );
}

// 🔥 props 검증 추가
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
