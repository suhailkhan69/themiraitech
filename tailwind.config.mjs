/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0B',
        surface: '#111113',
        'surface-2': '#18181B',
        border: '#27272A',
        'border-subtle': '#1C1C1F',
        'text-primary': '#F5F5F7',
        'text-secondary': '#A1A1AA',
        'text-muted': '#71717A',
        'accent-indigo': '#6366F1',
        'accent-violet': '#8B5CF6',
        'accent-cyan': '#22D3EE',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366F1, #8B5CF6)',
        'gradient-hero': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.15), transparent)',
        'gradient-card': 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.05))',
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
            a: { color: '#6366F1', '&:hover': { color: '#8B5CF6' } },
            h1: { color: '#F5F5F7', fontFamily: 'Space Grotesk' },
            h2: { color: '#F5F5F7', fontFamily: 'Space Grotesk' },
            h3: { color: '#F5F5F7', fontFamily: 'Space Grotesk' },
            h4: { color: '#F5F5F7', fontFamily: 'Space Grotesk' },
            strong: { color: '#F5F5F7' },
            code: { color: '#22D3EE', backgroundColor: '#18181B', padding: '0.2em 0.4em', borderRadius: '4px' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            blockquote: { borderLeftColor: '#6366F1', color: '#A1A1AA' },
            hr: { borderColor: '#27272A' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
