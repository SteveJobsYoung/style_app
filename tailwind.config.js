/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111d4a',
        surface: '#FFFFFF',
        line: '#E7DECF',
        cream: '#1E1E24',
        muted: '#8A8275',
        wine: '#92140C',
        winedeep: '#6E0F09',
        peach: '#FFCF99',
        canvas: '#FFF8F0',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
