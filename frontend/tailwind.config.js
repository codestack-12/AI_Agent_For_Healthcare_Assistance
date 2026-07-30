/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        mint: "#F5F9F8",
        ink: "#14302E",
        teal: {
          DEFAULT: "#1D6F73",
          light: "#2E8C90",
          dark: "#134F52",
        },
        leaf: {
          DEFAULT: "#4C9A6A",
          light: "#6BB585",
        },
        coral: {
          DEFAULT: "#E8927C",
          dark: "#D97050",
        },
        dusk: {
          900: "#0E1F1E",
          800: "#15302E",
          700: "#1C3E3B",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "1.5rem",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(20, 48, 46, 0.08)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};
