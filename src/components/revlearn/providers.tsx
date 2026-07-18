"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export const useRLTheme = () => useContext(ThemeCtx);

export function RevLearnProviders({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Default to light unless user has previously chosen dark
    const stored = localStorage.getItem("rl-theme") as Theme | null;
    setTheme(stored ?? "light");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-rl", theme);
    localStorage.setItem("rl-theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/revlearn-sw.js", { scope: "/revlearn" })
        .catch(() => {});
    }
  }, []);

  const toggle = useCallback(
    () => setTheme(t => (t === "light" ? "dark" : "light")),
    []
  );

  // Render immediately — no visibility:hidden flash
  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      <div className="rl-root" data-rl={mounted ? theme : "light"}>
        {children}
      </div>
    </ThemeCtx.Provider>
  );
}