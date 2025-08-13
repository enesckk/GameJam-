/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#10B981", 600: "#059669" }, // Emerald
        neon: { lilac:"#A78BFA", mint:"#2DD4BF", cyan:"#22D3EE" }
      },
      boxShadow: { neon: "0 0 24px rgba(16,185,129,.45)" },

      /* >>> EKLEDİK <<< */
      keyframes: {
        "bg-pan": {
          "0%":   { transform: "scale(1) rotate(0deg)" },
          "100%": { transform: "scale(1.15) rotate(6deg)" },
        },
      },
      animation: {
        "bg-pan": "bg-pan 18s ease-in-out infinite alternate",
      },
      backgroundImage: {
        "gradient-hero":
          "radial-gradient(1200px 600px at 10% -20%, rgba(124,58,237,.28), transparent), radial-gradient(900px 500px at 110% 10%, rgba(45,212,191,.22), transparent), linear-gradient(120deg, #0ea5e9, #8b5cf6 55%, #22c55e)",
      },
    },
  },
  plugins: [],
};
