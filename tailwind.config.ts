import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ring: {
          blue: "#0073e6",
          dark: "#0b0f19",
          surface: "#131a29",
          card: "#182235",
          border: "#24324a",
          highlight: "#1e2c45",
          accent: "#00a3ff",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
          text: "#f8fafc",
          subtext: "#94a3b8",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        focus: "0 0 0 4px rgba(0, 163, 255, 0.65), 0 0 30px rgba(0, 163, 255, 0.35)",
        "card-glow": "0 10px 40px -10px rgba(0, 0, 0, 0.7)",
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-slow": "pulseSlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.35s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
