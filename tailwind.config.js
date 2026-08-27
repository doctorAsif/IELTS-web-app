/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        duo: {
          green: '#1E3A8A', // Mapped to AKHL Deep Blue
          'green-dark': '#1e40af',
          'green-light': '#3b82f6',
          'green-border': '#172554', // Darker blue for borders if needed
          blue: '#0D9488', // Mapped to Teal Accent
          'blue-dark': '#0f766e',
          'blue-light': '#14b8a6',
          purple: '#6366f1',
          'purple-dark': '#4f46e5',
          red: '#ef4444',
          'red-dark': '#dc2626',
          orange: '#f59e0b', // Mapped to Gold
          'orange-dark': '#d97706',
          gold: '#f59e0b',
          'gold-dark': '#d97706',
          gray: '#f1f5f9', // Slate 100
          'gray-light': '#f8fafc',
          'gray-dark': '#cbd5e1',
          'gray-text': '#64748b', // Slate 500
          charcoal: '#1e293b', // Slate 800
          dark: '#0f172a',
          'dark-card': '#1e293b',
          'dark-border': '#334155',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      boxShadow: {
        'duo-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // Sleek drop shadow
        'duo': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'duo-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        }
      },
      animation: {
        wiggle: 'fadeInUp 0.4s ease-out forwards', // Overriding wiggle with a sleek fade
        bounceSmall: 'fadeInUp 0.5s ease-out forwards',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
