/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'MontserratVariable'", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        "hero-pattern": "url('/src/images/grid-pattern.svg')",
      },
      colors: {
        primary: {
          DEFAULT: "#F97316",
          50: "#FEDFC9",
          100: "#FDD3B5",
          200: "#FCBB8D",
          300: "#FBA366",
          400: "#FA8B3E",
          500: "#F97316",
          600: "#D25905",
          700: "#9B4204",
          800: "#642B03",
          900: "#2D1301",
          950: "#120800",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
