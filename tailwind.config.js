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
      },
      typography: ({ theme }) => ({
        custom: {
          css: {
            '--tw-prose-body': 'var(--text-color)',
            '--tw-prose-headings': 'var(--text-bright)',
            '--tw-prose-lead': 'var(--text-muted)',
            '--tw-prose-links': 'var(--color-primary)',
            '--tw-prose-bold': 'var(--text-bright)',
            '--tw-prose-counters': 'var(--text-muted)',
            '--tw-prose-bullets': 'var(--text-muted)',
            '--tw-prose-hr': 'var(--text-faint)',
            '--tw-prose-quotes': 'var(--text-bright)',
            '--tw-prose-quote-borders': 'var(--text-faint)',
            '--tw-prose-captions': 'var(--text-color)',
            '--tw-prose-code': 'var(--text-bright)',
            '--tw-prose-pre-code': 'var(--text-faint)',
            '--tw-prose-pre-bg': 'var(--bg-bright)'
          }
        }
      })
    }
  },
  // variants: {},
  plugins: [require('@tailwindcss/typography')]
}
