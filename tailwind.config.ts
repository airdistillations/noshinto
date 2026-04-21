import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#111111',
        paper: '#fafaf7',
        muted: '#6b6b6b',
        line: '#e8e6df',
      },
      letterSpacing: {
        'wide-xl': '0.18em',
      },
    },
  },
  plugins: [],
};

export default config;
