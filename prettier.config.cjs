module.exports = {
  semi: false,
  arrowParens: 'always',
  printWidth: 120,
  bracketSpacing: true,
  trailingComma: 'all',
  singleQuote: true,
  htmlWhitespaceSensitivity: 'ignore',
  tailwindConfig: './app/tailwind.config.js',
  plugins: [require('prettier-plugin-tailwindcss')],
}
