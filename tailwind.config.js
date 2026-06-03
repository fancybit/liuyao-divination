/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f0',
          100: '#f9eddb',
          200: '#f2d8b3',
          300: '#e8bd82',
          400: '#dc9f52',
          500: '#d48831',
          600: '#c47027',
          700: '#a35622',
          800: '#834621',
          900: '#6b3b1e',
          950: '#391d0e',
        },
      },
    },
  },
  plugins: [],
}