/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgcolor : '#181a1b',
        bglight : '#2b2a2aad',
        fgcolor : '#c9c9c9',
        themecolor : '#078350',
        grayedcolor : '#cec5c59c',
        tagcolor: '#02f798',
        errorcolor: '#ee0303'
      }
    },
  },
  plugins: [],
}

