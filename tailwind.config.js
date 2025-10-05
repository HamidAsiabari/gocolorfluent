/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Logo Brand Colors
        'logo': {
          'element': '#ffffff',        // White - for logo elements
          'bg': '#e8b1a3',            // Logo background color
          'text-start': '#9822e2',    // Gradient start color
          'text-end': '#b086cb',      // Gradient end color
        },
        // Gradient combinations
        'gradient': {
          'logo-text': 'linear-gradient(135deg, #9822e2 0%, #b086cb 100%)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-logo-text': 'linear-gradient(135deg, #9822e2 0%, #b086cb 100%)',
      },
    },
  },
  plugins: [],
}
