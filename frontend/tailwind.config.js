/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{css,scss}',
  ],
  theme: {
    extend: {
      colors: {
        'wise-green': {
          50: '#e6f7ef',
          100: '#b3e6d1',
          500: '#00b85d',
          600: '#00a251',
          700: '#008c45',
        },
        'wise-blue': {
          50: '#e6f0ff',
          100: '#b3d1ff',
          500: '#2e4369',
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      boxShadow: {
        'wise': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  plugins: [],
}
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
