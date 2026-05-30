import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bleu: {
          black: "#050508",
          electric: "#0066FF",
          cyan: "#00AAFF",
          gold: "#C89020",
          white: "#F0F0F0",
          pista: "#050b16",
          entrepiso: "#0b1522",
          "entrepiso-vip": "#1a1402",
          "vip-n3": "#15100a",
          "ultra-vip": "#0e0820",
          barra: "#050e0e",
          backstage: "#180204",
          "backstage-border": "#aa0022",
          "ultra-table": "#9933cc",
        },
      },
      fontFamily: {
        bebas: ["var(--font-bebas)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      backdropBlur: {
        glass: "12px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 102, 255, 0.5)",
        "glow-gold": "0 0 20px rgba(200, 144, 32, 0.5)",
        "glow-purple": "0 0 20px rgba(153, 51, 204, 0.5)",
        "glow-green": "0 0 20px rgba(34, 197, 94, 0.5)",
      },
      animation: {
        "pulse-green": "pulse-green 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-green": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.7)" },
          "50%": { boxShadow: "0 0 0 12px rgba(34, 197, 94, 0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
