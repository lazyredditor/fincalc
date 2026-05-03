import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // betterapp.org palette
        onyx: {
          DEFAULT: '#1a1614',
          950: '#0e0c0b',
          900: '#1a1614',
          800: '#2a2421',
          700: '#3a322e',
        },
        mauve: {
          DEFAULT: '#7d6b73',
          50: '#f6f1f3',
          100: '#ebe1e6',
          200: '#d6c4cc',
          300: '#b89fab',
          400: '#9a7d8d',
          500: '#7d6b73',
          600: '#65555c',
          700: '#534549',
          800: '#3f343a',
        },
        sand: {
          DEFAULT: '#e6d6bf',
          50: '#fbf7f0',
          100: '#f6ecdb',
          200: '#ecd9b8',
          300: '#e6d6bf',
          400: '#d4b78f',
          500: '#bf9a6a',
          600: '#a07c4f',
          700: '#7d6140',
        },
        ink: '#1a1614',
        paper: '#faf6ef',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      borderRadius: {
        none: '0',
      },
    },
  },
  plugins: [],
};

export default config;
