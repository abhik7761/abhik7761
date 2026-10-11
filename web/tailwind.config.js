/** Design tokens are CSS variables (see src/styles/index.css), set from src/config/brand.ts at runtime. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--c-primary) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        cta: 'rgb(var(--c-cta) / <alpha-value>)',
        ink: '#0f172a',
      },
      fontFamily: { display: ['Sora', 'system-ui', 'sans-serif'], sans: ['Inter', 'system-ui', 'sans-serif'] },
      borderRadius: { xl2: '1.25rem' },
    },
  },
  plugins: [],
};
