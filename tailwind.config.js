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
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22C55E',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        accent: {
          400: '#fbbf24',
          500: '#F59E0B',
          600: '#d97706',
        },
        charcoal: '#1A1A1A',
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-green': '0 0 30px rgba(34,197,94,0.3)',
        'glow-green-sm': '0 0 15px rgba(34,197,94,0.2)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.3)',
      },
    },
  },
  plugins: [],
}
