/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          50:  '#fff0f6',
          100: '#ffe3ed',
          200: '#ffc9db',
          300: '#ff9dbc',
          400: '#ff6699',
          500: '#ff3377',
          600: '#f0125e',
          700: '#cc0a4f',
          800: '#a80d44',
          900: '#8c0f3d',
        },
        rose: {
          light: '#fff0f6',
          mid:   '#ffb3d1',
          deep:  '#e8437a',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':   'linear-gradient(135deg, #fff0f6 0%, #ffe3ed 50%, #ffd6e7 100%)',
        'card-gradient':   'linear-gradient(145deg, #ffffff 0%, #fff5f8 100%)',
        'pink-gradient':   'linear-gradient(135deg, #ff6699 0%, #ff3377 50%, #cc0a4f 100%)',
        'soft-gradient':   'linear-gradient(180deg, #fff0f6 0%, #ffffff 100%)',
      },
      boxShadow: {
        'pink-sm':  '0 2px 12px rgba(255,51,119,0.15)',
        'pink-md':  '0 4px 24px rgba(255,51,119,0.25)',
        'pink-lg':  '0 8px 40px rgba(255,51,119,0.30)',
        'card':     '0 2px 20px rgba(0,0,0,0.06)',
        'card-hover':'0 8px 40px rgba(255,51,119,0.18)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'bounce-sm':  'bounceSm 0.6s ease-in-out',
        'float':      'float 3s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:  { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        bounceSm: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        float:    { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
