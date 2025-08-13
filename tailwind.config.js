/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#10B981", 600: "#059669" }, // Emerald
        neon: { lilac:"#A78BFA", mint:"#2DD4BF", cyan:"#22D3EE" }
      },
      boxShadow: { neon: "0 0 24px rgba(16,185,129,.45)" }
    },
  },
  plugins: [],
};
