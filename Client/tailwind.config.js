/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgcolor : '#181a1b',
        bglight : '#2f3031',
        fgcolor : '#c9c9c9',
        themecolor : '#13bb76',
        grayedcolor : '#989cad'
      }
    },
  },
  plugins: [],
}

