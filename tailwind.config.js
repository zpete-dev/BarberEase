const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
    },
    screens: {
      ...defaultTheme.screens,
      'xs': '475px',
      /* 'lg': {'min': '950px', 'max': '1279px'}, */
    },
    extend: {
      colors: {
        barberRed: '#C90000',
        hoverRed: '#8C0000',
        licorice: '#191516',
        carrotOrange: '#F9A03F',
        carrotOrangeHover: '#B26006'
      },
      fontFamily: {
        serif: ["PT Serif", "serif"],
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
};