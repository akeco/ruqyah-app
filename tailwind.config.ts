import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Emerald palette
        emerald: {
          50:  "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        // Amber / Gold palette
        amber: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Sage palette
        sage: {
          50:  "#f4f6f0",
          100: "#e8ebe2",
          200: "#d5dbc8",
          300: "#c5cdb5",
          400: "#aeb89c",
          500: "#97a383",
        },
        background: {
          DEFAULT: "#F8F0E3",
          hero: "#2F4A36",
          elevated: "#FCF7EF",
        },
        foreground: {
          DEFAULT: "#233227",
          muted: "#677467",
          inverse: "#F7F4EC",
        },
        primary: {
          DEFAULT: "#35543C",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#C8A35A",
          foreground: "#233227",
        },
        accent: {
          DEFAULT: "#E8D6AE",
          foreground: "#2F4A36",
        },
        border: {
          DEFAULT: "#DCC9A6",
          subtle: "#EEE4D3",
          strong: "#B69A69",
        },
        card: {
          DEFAULT: "#FCF8F0",
          foreground: "#233227",
        },
        input: {
          DEFAULT: "#FFFDF8",
          border: "#E6D6BA",
          placeholder: "#A59A84",
        },
        ring: "#C8A35A",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Cinzel", "serif"],
        body: ["var(--font-body)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        arabic: ["'Amiri', serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-down": "slide-down 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
