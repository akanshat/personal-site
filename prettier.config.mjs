/** @type {import('prettier').Config} */
const config = {
  singleQuote: true,
  semi: true,
  printWidth: 110,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './app/globals.css',
};

export default config;
