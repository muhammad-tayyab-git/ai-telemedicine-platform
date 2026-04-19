/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e6f1fb',
          100: '#b5d4f4',
          200: '#85b7eb',
          400: '#378add',
          600: '#185fa5',
          800: '#0c447c',
          900: '#042c53',
        },
        success: {
          50:  '#e1f5ee',
          600: '#0f6e56',
          800: '#085041',
        },
        danger: {
          50:  '#fcebeb',
          600: '#a32d2d',
          800: '#791f1f',
        },
        warning: {
          50:  '#faeeda',
          600: '#854f0b',
          800: '#633806',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
