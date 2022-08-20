module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Noto Sans SC', 'Graphik', 'sans-serif'],
      serif: ['Noto Serif SC', 'Merriweather', 'serif'],
      roboto: ['Roboto', 'sans-serif']
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/line-clamp')]
}
