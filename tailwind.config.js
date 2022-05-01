const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    './projects/**/*.{html,ts}',
  ],
  // content: ['./**/*.{html}', ],
  theme: {
    colors: {
      transparent: 'transparent',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      teal: colors.teal,
      green: colors.green,
      yellow: colors.yellow,
      red: colors.red,
      blue: colors.blue,
      slate: colors.slate,
    },
    extend: {
      colors: {
        primary: '#3b4252',
        accent: '#9a8b74',

        transparent: 'transparent',
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        emerald: colors.emerald,
        indigo: colors.indigo,
        teal: colors.teal,
        green: colors.green,
        yellow: colors.yellow,
        red: colors.red,
        blue: colors.blue,
        slate: colors.slate,
      },
    },
  },
  plugins: [
    // require('flowbite/plugin')
  ],
}
