import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#4A0E10",
          deep: "#2E0608",
          light: "#641015",
          bright: "#7A1A1E"
        },
        ink: {
          DEFAULT: "#121212",
          soft: "#1C1B1B"
        },
        rev: {
          orange: "#FF6B1A",
          orangeDeep: "#E5560D",
          peach: "#FFD9A8",
          peachSoft: "#FFE9CC"
        },
        cream: "#F5EDEA",
        paper: "#F3F1EF",
        slate: {
          ink: "#1E1B1A",
          body: "#5C5552"
        },
        glass: "rgba(255,255,255,0.06)"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,107,26,.3), 0 30px 80px -10px rgba(0,0,0,.6)",
        card: "0 20px 60px -15px rgba(0,0,0,.5)",
        glass: "0 8px 32px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.08)"
      },
      backdropBlur: {
        xs: "2px"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;