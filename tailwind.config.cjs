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
          DEFAULT: "#0EA5E9",
          50: "#B4E5FA",
          100: "#A1DEF9",
          200: "#7AD0F7",
          300: "#54C3F5",
          400: "#2DB5F2",
          500: "#0EA5E9",
          600: "#0B80B4",
          700: "#085A7F",
          800: "#04354A",
          900: "#010F15",
          950: "#000000",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
