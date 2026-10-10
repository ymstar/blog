/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
        },
        ink: {
          DEFAULT: '#1E293B',
          light: '#475569',
          muted: '#94A3B8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8FAFC',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      maxWidth: {
        prose: '768px',
        content: '1200px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
