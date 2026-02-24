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
      },
    },
  },
  plugins: [],
};
