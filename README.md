# Sing Chan's Portfolio

Modern portfolio website built with Next.js, TypeScript, and Material UI.

## Status

🚀 **Modernization Making Great Progress** - Migrating from 2013 legacy stack to modern React

**Current Phase:** Phase 4 - Enhanced Features 🔄 (Task 4.1 Theme System in progress)
**Completion:** Phase 1 ✅ | Phase 2 ✅ | Phase 3 ✅ | Phase 4.1 🔄

## Stack

**v2 (Modern)**
- Next.js 16+ | TypeScript 5+ | Material UI v7
- Vitest + React Testing Library (80% coverage)
- WCAG 2.2 Level AA Accessible

**v1 (Legacy)**
- Gumby Framework | jQuery | PHP
- See `v1/` for legacy code

## Quick Start

```bash
cd v2
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Commands

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm test              # Run tests
npm run test:coverage # Coverage report
npm run lint          # ESLint check
npm run type-check    # TypeScript check
```

## Documentation

- **[Modernization Plan](docs/MODERNIZATION_PLAN.md)** - Complete roadmap
- **[Phase 4 Detailed Plan](docs/PHASE4_DETAILED_PLAN.md)** - Current phase guide (Enhanced Features)
- **[Phase 3 Detailed Plan](docs/PHASE3_DETAILED_PLAN.md)** - Core pages (complete)
- **[Phase 2 Detailed Plan](docs/PHASE2_DETAILED_PLAN.md)** - Data migration (complete)
- **[Testing Setup](docs/TESTING_SETUP.md)** - Testing infrastructure
- **[Theme Switching Guide](docs/THEME_SWITCHING.md)** - Theme system documentation
- **[v2 README](v2/README.md)** - Detailed v2 documentation

## Project Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1. Foundation & Setup | ✅ Complete | Next.js, TypeScript, MUI, ESLint, Prettier, Git hooks |
| 2. Data Migration | ✅ Complete | Testing setup, TypeScript interfaces, data layer, 18 projects |
| 3. Core Pages | ✅ Complete | Homepage, Resume, Colophon, Shared Components, Lightbox |
| 4. Enhanced Features | 🔄 In Progress | Theme switching ✅, animations, SEO, i18n, accessibility |
| 5. Performance | ⬜ Planned | SSG, optimization, CDN |
| 6. Deployment | ⬜ Planned | Vercel/Netlify, CI/CD, production launch |
| 7. Post-Launch | ⬜ Planned | Monitoring, updates, enhancements |

## Key Requirements

- **Accessibility:** WCAG 2.2 Level AA compliance (mandatory)
- **Testing:** 80%+ coverage for data layer, 100% for critical paths
- **Documentation:** All code must have JSDoc comments
- **Security:** No secrets in source control (use .env.local)

## License

© 2013-2026 Sing Chan. All rights reserved.
