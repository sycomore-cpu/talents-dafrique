import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#fdf3ee',
          '100': '#fbe4d5',
          '200': '#f6c5aa',
          '300': '#f09f76',
          '400': '#e97040',
          '500': '#e3501e',
          '600': '#C1440E',
          '700': '#9e380d',
          '800': '#7e2e11',
          '900': '#662811',
          '950': '#371207',
          DEFAULT: '#C1440E',
        },
        secondary: {
          '50': '#f0faf4',
          '100': '#dbf2e4',
          '200': '#b9e5cb',
          '300': '#88d1a8',
          '400': '#54b580',
          '500': '#319960',
          '600': '#217a4c',
          '700': '#1B4332',
          '800': '#173827',
          '900': '#142e22',
          '950': '#0a1a13',
          DEFAULT: '#1B4332',
        },
        kory: {
          '50': '#fdf9ec',
          '100': '#faf0ca',
          '200': '#f4df91',
          '300': '#eeca57',
          '400': '#e9b52e',
          '500': '#D4A017',
          '600': '#b87c10',
          '700': '#935c11',
          '800': '#794914',
          '900': '#663d14',
          '950': '#3b1f07',
          DEFAULT: '#D4A017',
        },
        cream: {
          DEFAULT: '#FDF6EC',
        },
        brown: {
          DEFAULT: '#1A0E06',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
