module.exports = {
  content: ['layouts/**/*.html', 'content/*.md'],
  safelist: ['gist', 'gist-data', 'gist-file'],
  theme: {
    container: {
      // .container applies these to center and add padding
      center: true, // mx-auto
      padding: '1.5rem' // px-6
    },
    extend: {
      colors: {
        primary: 'var(--color-primary)'
      }
    }
  },
  // variants: {},
  // plugins: []
}
