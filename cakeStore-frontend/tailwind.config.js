/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bakery: {
          primary: "#E9BCB7", // Soft Pink
          secondary: "#4A3728", // Dark Cocoa
          accent: "#F9F1E7", // Cream
          // Dark mode counterparts
          darkBg: "#2B1B17", // Deep Espresso
          darkPrimary: "#B97A6A", // Muted Pink
          darkAccent: "#E5D3C5", // Muted Cream
        },
        primary: "#ec4899",
        secondary: "#f97316",
        theme: {
          light: {
            bg: "#f8fafc",        // Very light slate for Admin Layout bg
            card: "#ffffff",      // Pure white for cards
            text: "#0f172a",      // Very dark blue/slate for high contrast text
            muted: "#475569",     // Darkened muted slate text for better visibility (placeholders)
            border: "#cbd5e1",    // Slightly darker soft borders
            primary: "#f43f5e",   // Rose primary
          },
          dark: {
            bg: "#0f172a",        // Deep slate bg
            card: "#1e293b",      // Lighter slate for cards
            text: "#f8fafc",      // Bright white for text
            muted: "#94a3b8",     // Muted text
            border: "#334155",    // Dark slate borders
            primary: "#fb7185",   // Lighter rose primary
          },
        },
      },
    },
  },
  plugins: [],
};
