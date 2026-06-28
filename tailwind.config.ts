import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nocturne: {
          black: '#050505',
          darkest: '#0a0a0a',
          darker: '#111111',
          dark: '#1a1a1a',
          mid: '#2a2a2a',
          light: '#3a3a3a',
          accent: '#ff1f7e',
          'accent-light': '#ff4b9f',
          'accent-dark': '#d61b65',
          gold: '#d4af37',
          'gold-light': '#e8c547',
          cyan: '#00d9ff',
          'cyan-light': '#33e9ff',
        },
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(255, 31, 126, 0.5)' },
          '50%': { textShadow: '0 0 20px rgba(255, 31, 126, 0.8)' },
        },
        'glow-box': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 31, 126, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 31, 126, 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        glow: 'glow 3s ease-in-out infinite',
        'glow-box': 'glow-box 3s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
}

export default config
