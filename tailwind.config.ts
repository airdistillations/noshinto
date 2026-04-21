import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // 62.5% base means 1rem = 10px
        '12': ['1.2rem', { lineHeight: '1.5rem' }],
        '16': ['1.6rem', { lineHeight: '2rem' }],
      },
      colors: {
        bg: 'var(--color-bg)',
        ink: 'var(--color-text)',
        muted: 'var(--color-gray)',
        accent: 'var(--color-preview-red)',
      },
      gridTemplateColumns: {
        'layout-6': 'repeat(6, minmax(0, 1fr))',
        'layout-12': 'repeat(12, minmax(0, 1fr))',
      },
      transitionTimingFunction: {
        'out-quint': 'cubic-bezier(.22,1,.36,1)',
        'out-expo': 'cubic-bezier(.16,1,.3,1)',
      },
      spacing: {
        'gutter': '10px',
      },
    },
  },
  plugins: [],
};

export default config;
