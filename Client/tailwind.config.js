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
        blurcolor: '#444745',
        grayedcolor : '#cec5c59c',
        tagcolor: '#02f798',
        errorcolor: '#ee0303',
        groupcolor: '#e76306'
      },
      colors_: {
        wcolor : '#ffffff',
        bgcolor : '#181a1b',
        bglight : '#1c1c1c',
        fgcolor : '#c9c9c9',
        themecolor : '#06d433',
        blurcolor: '#444745',
        grayedcolor : '#cec5c59c',
        tagcolor: '#02f798',
        errorcolor: '#ee0303',
        groupcolor: '#e76306'
      },
      fontFamily: {
        roboto : 'Roboto',
        poppins: 'Poppins'
      },
      screens: {
        '2xl-max': {'max': '1535px'},
        // => @media (max-width: 1535px) { ... }
  
        'xl-max': {'max': '1279px'},
        // => @media (max-width: 1279px) { ... }

        'llg-max': {'max': '1180px'},
        // => @media (max-width: 1180px) { ... }
  
        'lg-max': {'max': '1023px'},
        // => @media (max-width: 1023px) { ... }
  
        'md-max': {'max': '767px'},
        // => @media (max-width: 767px) { ... }
  
        'sm-max': {'max': '639px'},
        // => @media (max-width: 639px) { ... }
      }
    },
  },
  plugins: [],
}

