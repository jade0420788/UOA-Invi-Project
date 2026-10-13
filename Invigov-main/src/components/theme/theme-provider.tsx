"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const THEMES = [
  { id: "classic", label: "Classic" },
  { id: "midnight", label: "Midnight" },
  { id: "harbor", label: "Harbor" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const ThemeContext = createContext<{
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}>({ theme: "classic", setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("classic");

  const applyTheme = (next: ThemeId) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("invigov-theme", next);
  };

  useEffect(() => {
    const saved = window.localStorage.getItem("invigov-theme");
    if (saved === "classic" || saved === "midnight" || saved === "harbor") {
      applyTheme(saved);
    } else {
      applyTheme("classic");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
