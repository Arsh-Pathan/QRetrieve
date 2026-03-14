import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#faf7f2',
          100: '#f5f0e8',
          200: '#ede5d8',
          300: '#e0d4c4',
        },
        pastel: {
          lavender: '#d4c5f9',
          'lavender-light': '#ede7fb',
          sage: '#c8e6c9',
          'sage-light': '#e8f5e9',
          yellow: '#fff9c4',
          'yellow-light': '#fffde7',
          peach: '#ffcdd2',
          'peach-light': '#fce4ec',
          blue: '#bbdefb',
          'blue-light': '#e3f2fd',
        },
        accent: {
          blue: '#5c9ce6',
          green: '#66bb6a',
          coral: '#ef8e73',
          purple: '#9c7ce6',
          yellow: '#f5c842',
          red: '#ef5350',
        },
        text: {
          primary: '#1a1a2e',
          secondary: '#5a5a72',
          muted: '#9e9eb0',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        'soft': '0 2px 16px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glow-coral': '0 4px 20px rgba(239, 142, 115, 0.25)',
        'glow-purple': '0 4px 20px rgba(156, 124, 230, 0.25)',
        'glow-green': '0 4px 20px rgba(102, 187, 106, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
