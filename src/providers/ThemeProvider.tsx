"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  forcedTheme,
}: {
  children: ReactNode;
  forcedTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(forcedTheme ?? "light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (forcedTheme) return;
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setThemeState(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark");
    }
  }, [forcedTheme]);

  useEffect(() => {
    if (!mounted) return;
    const active = forcedTheme ?? theme;
    document.documentElement.setAttribute("data-theme", active);
    document.documentElement.classList.toggle("dark", active === "dark");
    if (!forcedTheme) localStorage.setItem("theme", active);
  }, [theme, mounted, forcedTheme]);

  const toggleTheme = () => {
    if (forcedTheme) return;
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: Theme) => {
    if (forcedTheme) return;
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme: forcedTheme ?? theme, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
