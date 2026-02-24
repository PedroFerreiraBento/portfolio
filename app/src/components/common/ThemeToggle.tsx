import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== "undefined") {
            return document.documentElement.classList.contains("dark");
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

    // Handle system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
            // Only follow system if user has no manual preference
            if (!localStorage.getItem("theme")) {
                setIsDark(e.matches);
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <button
            onClick={toggleTheme}
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
