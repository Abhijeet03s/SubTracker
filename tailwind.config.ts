import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        plusJakartaSans: ['var(--font-plus-jakarta-sans)'],
        zillaSlab: ['var(--font-zilla-slab)'],
      }
    },
  },
  plugins: [],
};
export default config;
