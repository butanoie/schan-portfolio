Key architecture decisions for the portfolio project:

- **Railway over Vercel** — Vercel evaluated but skipped due to cost
- **PostHog cookieless mode** — sessionStorage persistence, no cookie banner needed, Do Not Track respected
- **Sentry performance sampling** — 10% traces, 100% error sampling
- **Better Stack uptime** — 3-minute check intervals, email alerts, public status page
- **Dependabot grouping** — Weekly Monday checks; minor/patch grouped; PR limits: 5 npm, 3 Actions
- **SSG for homepage** — Removed `cookies()` dependency, `dynamic = 'error'` guard to prevent accidental server-side rendering
- **Font loading** — Migrated from CSS `@import` to `next/font/google` with `font-display: optional` for CLS = 0
- **Lazy-loaded components** — ProjectLightbox, HamburgerMenu, SettingsList via `next/dynamic`
- **Client/Server boundary** — Audited 48 components, converted 6 to server components (34/48 client ratio)
