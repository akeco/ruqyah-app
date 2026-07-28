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
        // Duboka maslinasto-zelena paleta (izvučena iz listova masline i sjenki)
        olive: {
          50:  "#f3f5f1",
          100: "#e3e7dd",
          200: "#c7cfbd",
          300: "#a3b197",
          400: "#7d9070",
          500: "#5d7150", // Glavna srednja zelena
          600: "#48583e",
          700: "#3a4632",
          800: "#2d3627", // Tamna sjenka lista
          900: "#1e241b",
          950: "#0f120d",
        },
        // Zlatno-smeđa paleta (izvučena iz korica knjige i tople svjetlosti sa prozora)
        gold: {
          50:  "#fdfbf7",
          100: "#f9f4e6",
          200: "#f0e4c6",
          300: "#e3ce9f",
          400: "#d3b476",
          500: "#c19853", // Prigušeno zlato za CTA / detalje
          600: "#aa8042",
          700: "#8d6435",
          800: "#734f2d",
          900: "#5e3f25",
        },
        // Meka krem paleta (dominantna pozadina na slici)
        cream: {
          50:  "#faf8f5",
          100: "#f6f1e9", // Glavna topla bijela sa slike
          200: "#ece3d4",
          300: "#ded0bc",
          400: "#ccb79f",
          500: "#ba9e83",
        },
        background: {
          DEFAULT: "#F6F1E9", // Svijetla krem pozadina (izvučena sa lijeve strane slike)
          hero: "#F6F1E9",    // Hero sekcija koristi istu boju jer je slika svijetla
          elevated: "#FAF8F5",
        },
        foreground: {
          DEFAULT: "#2D3627", // Duboka tamno-zelena za maksimalnu čitljivost na krem pozadini
          muted: "#7D9070",   // Blaža maslinasta za opise
          inverse: "#FAF8F5", // Kontrastna krem za tamne elemente
        },
        primary: {
          DEFAULT: "#48583e", // Maslinasto-zelena za glavne UI elemente
          foreground: "#FAF8F5",
        },
        secondary: {
          DEFAULT: "#C19853", // Prigušeno zlato za primarne CTA gumbe
          foreground: "#2D3627",
        },
        accent: {
          DEFAULT: "#E2CE9F", // Svijetlo zlato za badge-eve ili detalje
          foreground: "#3A4632",
        },
        border: {
          DEFAULT: "#ECE3D4", // Suptilne konture u boji papira knjige
          subtle: "#F6F1E9",
          strong: "#C19853",
        },
        card: {
          DEFAULT: "#FAF8F5",
          foreground: "#2D3627",
        },
        input: {
          DEFAULT: "#FAF8F5",
          border: "#ECE3D4",
          placeholder: "#A3B197",
        },
        ring: "#C19853",
      },
      fontFamily: {
        // Preporučeni 'Marcellus' za naslove i 'Manrope' za čist tekst
        heading: ["var(--font-heading)", "Marcellus", "serif"],
        body: ["var(--font-body)", "Manrope", "system-ui", "sans-serif"],
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