import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage first
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) {
                return savedTheme === "dark";
            }
            // Fallback to system preference
            return window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
        return false;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-subtle bg-bg-card text-text-soft hover:bg-bg-soft hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80 transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? (
                <Sun size={18} className="transition-transform duration-200 hover:rotate-90" />
            ) : (
                <Moon size={18} className="transition-transform duration-200 hover:-rotate-12" />
            )}
        </button>
    );
}
