/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#050505', // Deep black
          card: '#0f0f12', // Charcoal cards
          border: '#1a1a24', // Subtle borders
          lighter: '#16161e' // Lighter dark tones
        },
        accent: {
          orange: '#ff5722', // Neon orange
          violet: '#8a2be2', // Neon violet
          gold: '#d4af37', // Luxury gold for accents
          coral: '#ff7f50'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      },
      animation: {
        'shutter-open': 'shutterOpen 1.2s cubic-bezier(0.85, 0, 0.15, 1) forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        shutterOpen: {
          '0%': { transform: 'scaleY(1)' },
          '100%': { transform: 'scaleY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}
