import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ember: {
          DEFAULT: '#C8463A',
          50: '#FBECEA',
          100: '#F5CFCA',
          400: '#D26156',
          500: '#C8463A',
          600: '#A53428',
          700: '#7E251C',
          900: '#3A0F0A',
        },
        saffron: {
          DEFAULT: '#F2A53A',
          50: '#FEF4E2',
          100: '#FBE2B4',
          400: '#F4B560',
          500: '#F2A53A',
          600: '#D38716',
          700: '#9F6611',
        },
        cream: {
          DEFAULT: '#FAF4E8',
          50: '#FFFCF6',
          100: '#FAF4E8',
          200: '#F0E6D2',
          300: '#E2D2B0',
        },
        ink: {
          DEFAULT: '#1A1614',
          800: '#2A2422',
          700: '#3D3633',
          500: '#6B5F5A',
          400: '#9B8F8A',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '7xl': ['5rem', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        '8xl': ['6.5rem', { lineHeight: '0.92', letterSpacing: '-0.035em' }],
        '9xl': ['8.5rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        '10xl': ['11rem', { lineHeight: '0.88', letterSpacing: '-0.045em' }],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        rise: 'rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
