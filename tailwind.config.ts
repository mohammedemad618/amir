import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
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
          DEFAULT: '#0891B2',
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        accent: {
          sun: '#FBBF24',
          coral: '#FB7185',
          sky: '#38BDF8',
          mint: '#2DD4BF',
          purple: '#A78BFA',
          orange: '#FB923C',
        },
        ink: {
          50: '#F8FAFC',
          100: '#EEF2F6',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#070A13',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          soft: '#F1F5F9',
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#0EA5E9',
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
        soft: '0 10px 30px -20px rgba(15, 23, 42, 0.35)',
        card: '0 24px 50px -32px rgba(15, 23, 42, 0.45)',
        lift: '0 16px 30px -20px rgba(15, 23, 42, 0.4)',
        ring: '0 0 0 1px rgba(15, 23, 42, 0.06)',
        glow: '0 0 40px -10px rgba(6, 182, 212, 0.4)',
        'glow-lg': '0 0 60px -15px rgba(6, 182, 212, 0.5)',
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(120% 120% at 85% -10%, rgba(6, 182, 212, 0.28) 0%, rgba(6, 182, 212, 0) 60%), radial-gradient(120% 120% at 0% 0%, rgba(56, 189, 248, 0.22) 0%, rgba(56, 189, 248, 0) 55%)',
        'subtle-grid':
          'linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'vibrant-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'ocean-gradient': 'linear-gradient(135deg, #0891B2 0%, #06B6D4 50%, #22D3EE 100%)',
        'sunset-gradient': 'linear-gradient(135deg, #FB923C 0%, #FBBF24 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
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
        'fade-up': 'fade-up 0.7s ease-out both',
        'fade-in': 'fade-in 0.5s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.6s ease-out both',
        'slide-in-left': 'slide-in-left 0.6s ease-out both',
        'scale-in': 'scale-in 0.5s ease-out both',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
