/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#070A10',
        surface: '#0D1117',
        'surface-2': '#161B22',
        border: '#21262D',
        'border-subtle': '#161B22',
        'text-primary': '#F0F6FC',
        'text-secondary': '#8B949E',
        'text-muted': '#6E7681',
        'accent-indigo': '#3B82F6',
        'accent-violet': '#8B5CF6',
        'accent-cyan': '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
        'gradient-hero': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.12), transparent)',
        'gradient-card': 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#A1A1AA',
            maxWidth: 'none',
            a: { color: '#3B82F6', '&:hover': { color: '#60A5FA' } },
            h1: { color: '#F0F6FC', fontFamily: 'Space Grotesk' },
            h2: { color: '#F0F6FC', fontFamily: 'Space Grotesk' },
            h3: { color: '#F0F6FC', fontFamily: 'Space Grotesk' },
            h4: { color: '#F0F6FC', fontFamily: 'Space Grotesk' },
            strong: { color: '#F0F6FC' },
            code: { color: '#F59E0B', backgroundColor: '#161B22', padding: '0.2em 0.4em', borderRadius: '4px' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            blockquote: { borderLeftColor: '#3B82F6', color: '#8B949E' },
            hr: { borderColor: '#21262D' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
