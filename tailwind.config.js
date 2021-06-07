module.exports = {
  // mode: 'jit',
  purge: {
    content: ['layouts/**/*.html'],
  },
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)'
      }
    },
    container: {
      // .container applies these to center and add padding
      center: true, // mx-auto
      padding: '1.5rem' // px-6
    }
  },
  variants: {},
  plugins: []
}
