import type { Config } from "tailwindcss";
import { DEFAULT_CIPHERS } from "tls";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': {
          DEFAULT: '#659E25'
        },
        'green-secondary':{
          DEFAULT: '#8AC942'
        },
        'orange':{
          DEFAULT: '#FF9933'
        },
        'darkBlue':{
          DEFAULT: '#19233B'
        },
        'gray':{
          DEFAULT: '#515151'
        },
        'red':{
          DEFAULT: '#FA6464'
        }
      },
      fontFamily: {
        sans: ['var(--font-nunito)'],
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'md': '0.25rem',
        'lg': '0.75rem',
        'xl': '1rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};
export default config;