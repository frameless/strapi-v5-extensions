export default {
  '**/*.{ts, tsx}?(x)': () => 'pnpm lint-build',
  '**/*.{ts, tsx, js, scss, css, html, json}?(x)': () => 'pnpm lint',
  '**/*.{ts,tsx,js,jsx,json,css,scss,html,md}': 'prettier --check',
};
