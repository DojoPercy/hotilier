import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#262262',
        'vibrant-blue': '#635DFF',
        'light-gray': '#F4F4F7',
        'medium-gray': '#C9CACE',
        'dark-neutral': '#1E212A',
        'crimson-red': '#D03C38',
        'emerald-green': '#13A688',
        'muted-slate': '#65676E',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
