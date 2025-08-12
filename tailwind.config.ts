import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',
          foreground: '#ffffff'
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      },
      boxShadow: {
        soft: '0 10px 25px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
export default config
