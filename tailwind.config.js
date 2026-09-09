/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dr. Asif's 60-30-10 Liquid Color Palette (direct from ielts_theme.dart)
        ielts: {
          obsidian: '#0B0F19',
          midnightCard: '#131B2E',
          midnightSurface: '#1E293B',
          daylightCanvas: '#F8FAFC',
          daylightCard: '#FFFFFF',
          daylightSurface: '#F1F5F9',
          
          // 10% Semantic Signals
          emerald: '#10B981',       // Band 7.5 - 9.0
          royalPurple: '#8B5CF6',   // Band 6.5 - 7.0 (Singapore Iris)
          crimson: '#E11D48',       // Focus / Live Mic
          youtubeCrimson: '#FF0033',
          electricBlue: '#38BDF8',
          amber: '#F59E0B',         // Band 5.5 - 6.0
          cambridgeNavy: '#0A192F',
          cambridgeGold: '#D4AF37',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'liquid-glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.35)',
        'liquid-glow-purple': '0 0 25px -4px rgba(139, 92, 246, 0.35)',
        'liquid-glow-crimson': '0 0 25px -4px rgba(225, 29, 72, 0.35)',
        'liquid-glow-blue': '0 0 25px -4px rgba(56, 189, 248, 0.35)',
        'specular': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'liquid-card': '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
      },
      backgroundImage: {
        'liquid-mesh': 'radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(16, 185, 129, 0.08) 0px, transparent 50%)',
        'liquid-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
      }
    },
  },
  plugins: [],
}
