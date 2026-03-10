import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#fdf8f0',
          100: '#f9f0e0',
          200: '#f3e1c1',
          300: '#ebd0a0',
          400: '#ddb87a',
          500: '#d0a05a',
        },
        accent: {
          blue: '#7eb8da',
          green: '#8ecfa0',
          coral: '#f0a08a',
          purple: '#b8a0d8',
          yellow: '#f0d88a',
        },
        text: {
          primary: '#2d2417',
          secondary: '#6b5e50',
          muted: '#9e9488',
        },
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '30px',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(45, 36, 23, 0.06)',
        card: '0 8px 30px rgba(45, 36, 23, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
