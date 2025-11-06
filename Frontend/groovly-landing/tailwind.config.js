/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f0f10",
        surface: "#161616",
        card: "#1f1f23",
        muted: "#9aa0a6",
        accent: "#ffd166",
      },
      fontFamily: {
        display: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "noise-soft": "radial-gradient(circle at 20% 20%, rgba(255, 209, 102, 0.08), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.05), transparent 55%)",
      },
      boxShadow: {
        glow: "0 30px 60px rgba(0, 0, 0, 0.6)",
      },
      keyframes: {
        blink: {
          "0%": { opacity: "1" },
          "50%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
