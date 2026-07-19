"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

type ResolvedTheme = "light" | "dark" | null;
type ThemeContextValue = { resolvedTheme: ResolvedTheme; toggleTheme: () => void };

const STORAGE_KEY = "nexo-theme";
const THEME_EVENT = "nexo-theme-change";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function readTheme(): ResolvedTheme {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => onStoreChange();
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  media.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
    media.removeEventListener("change", onChange);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resolvedTheme = useSyncExternalStore(subscribeToTheme, readTheme, () => null);

  useEffect(() => {
    if (!resolvedTheme) return;
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const value = useMemo<ThemeContextValue>(() => ({
    resolvedTheme,
    toggleTheme: () => {
      const nextTheme = readTheme() === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      document.documentElement.style.colorScheme = nextTheme;
      window.dispatchEvent(new Event(THEME_EVENT));
    },
  }), [resolvedTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme debe utilizarse dentro de ThemeProvider.");
  return context;
}
