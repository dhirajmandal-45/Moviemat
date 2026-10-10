export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: {
      brand: { DEFAULT: '#5b3df5', dark: '#4429d6', soft: '#efecff' },
      ink: { DEFAULT: '#14122b', soft: '#201d3f' },
      gold: '#ffb703', success: '#16a34a', warning: '#d97706', danger: '#dc2626', info: '#2563eb',
    },
    fontFamily: { sans: ['Sora', 'system-ui', 'sans-serif'] },
    boxShadow: { card: '0 1px 2px rgba(20,18,43,.06), 0 1px 1px rgba(20,18,43,.04)' },
  } },
  plugins: [],
};
