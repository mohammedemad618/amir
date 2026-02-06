import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '1.25rem',
        lg: '1.5rem',
      },
      screens: {
        '2xl': '1600px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#46695D',
          50: '#F3F6F4',
          100: '#E1E9E4',
          200: '#C7D6CD',
          300: '#A3BAAE',
          400: '#7A9B8F',
          500: '#5B7F73',
          600: '#46695D',
          700: '#365248',
          800: '#273B33',
          900: '#182620',
        },
        accent: {
          sun: '#C5A46D',
          coral: '#B88379',
          sky: '#6B86A4',
          mint: '#7FA596',
          purple: '#8C83A8',
          orange: '#D1A06A',
        },
        ink: {
          50: '#FBFAF8',
          100: '#F1EEE7',
          200: '#E1DAD0',
          300: '#C6BDB0',
          400: '#A29688',
          500: '#7C7266',
          600: '#5E564C',
          700: '#463F37',
          800: '#2D2721',
          900: '#1C1814',
          950: '#120F0C',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F7F2E9',
          soft: '#EFE7D9',
        },
        success: '#3D7C68',
        error: '#B0605A',
        warning: '#C28A4B',
        info: '#5D7B8E',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 22px 60px -44px rgba(20, 15, 12, 0.32)',
        card: '0 30px 72px -48px rgba(20, 15, 12, 0.34)',
        lift: '0 20px 48px -34px rgba(20, 15, 12, 0.42)',
        ring: '0 0 0 1px rgba(28, 24, 20, 0.08)',
        glow: '0 0 28px -14px rgba(197, 164, 109, 0.32)',
        'glow-lg': '0 0 52px -24px rgba(197, 164, 109, 0.38)',
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(120% 120% at 80% -10%, rgba(197, 164, 109, 0.18) 0%, rgba(197, 164, 109, 0) 60%), radial-gradient(120% 120% at 0% 0%, rgba(70, 105, 93, 0.16) 0%, rgba(70, 105, 93, 0) 55%)',
        'subtle-grid':
          'linear-gradient(90deg, rgba(28, 24, 20, 0.03) 1px, transparent 1px), linear-gradient(rgba(28, 24, 20, 0.03) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'vibrant-gradient': 'linear-gradient(135deg, #6B86A4 0%, #8C83A8 100%)',
        'ocean-gradient': 'linear-gradient(135deg, #365248 0%, #46695D 50%, #5B7F73 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #D1A06A 0%, #C5A46D 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.5s ease-out both',
        float: 'float 10s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.6s ease-out both',
        'slide-in-left': 'slide-in-left 0.6s ease-out both',
        'scale-in': 'scale-in 0.5s ease-out both',
        pulse: 'pulse 3s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
