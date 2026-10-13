"use client";

import { THEMES, useTheme } from "@/components/theme/theme-provider";

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-switcher" role="group" aria-label="Color theme">
      {THEMES.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={theme === item.id}
          className={theme === item.id ? "is-active" : ""}
          onClick={() => setTheme(item.id)}
        >
          <span className={`swatch swatch-${item.id}`} aria-hidden="true" />
          {compact ? <span className="sr-only">{item.label}</span> : item.label}
        </button>
      ))}
    </div>
  );
}
