import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f6ff",
          100: "#e8edff",
          200: "#d2dcff",
          300: "#b1c1ff",
          400: "#8297f6",
          500: "#4b5caa",
          600: "#3f4f97",
          700: "#364281",
          800: "#30376a",
          900: "#2d345b",
          950: "#1d2341",
        },
        slate: {
          950: "#071a1f",
        },
      },
      boxShadow: {
        soft: "0 20px 50px rgba(7, 26, 31, 0.12)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
