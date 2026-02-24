import { useTheme } from "../context/ThemeContext";
import { SunMedium,Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-full transition-colors duration-300 hover:bg-white/10 focus:outline-none"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        // Sun icon (for switching to dark mode)
       <SunMedium />
      ) : (
        // Moon icon (for switching to light mode)
        <Moon />
      )}
    </button>
  );
}
