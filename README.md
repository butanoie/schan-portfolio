# Sing Chan's Portfolio

Modern portfolio website built with Next.js, TypeScript, and Material UI.

[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v2/monitor/2h5o5.svg)](https://uptime.betterstack.com/?utm_source=status_badge)

## About This Project
This portfolio modernization is more than just a website rebuild — it's a showcase of how I approach software development. By migrating my portfolio from a 2013-era stack to a modern React-based application, I'm demonstrating the full lifecycle of a real-world enterprise project using the tools, processes, and discipline I'd bring to any professional engagement.

Claude Code, Anthropic's AI-powered command line tool, serves as a development partner throughout the project — assisting with planning, architecture decisions, code generation, testing, and documentation. Rather than treating AI as a black box that produces code, I use it collaboratively: reviewing its output, iterating on solutions, and maintaining full ownership of technical decisions. This mirrors how I believe AI-assisted development works best in professional settings.

The project follows enterprise-grade practices throughout:
- Issue tracking and milestones to plan and prioritize work across seven defined phases
- Feature branching and pull request workflows with structured code reviews
- CI/CD pipelines via GitHub Actions for automated linting, type checking, unit testing, and deployment to Railway
- Manual deployment approvals gating environment promotions
- Comprehensive documentation standards including mandatory JSDoc for all code, architecture decision records, and detailed changelogs
- Quality gates enforcing ≥80% test coverage, zero linting errors, WCAG 2.2 Level AA accessibility compliance, and TypeScript strict mode

The goal is to show that a personal project, when treated with the same rigour as a team-based product, becomes a credible demonstration of process maturity — not just technical skill.

## Status

**All Phases Complete** — Deployed on Railway with full monitoring and analytics.

**Completion:** Phase 1 ✅ | Phase 2 ✅ | Phase 3 ✅ | Phase 4 ✅ | Phase 5 ✅ | Phase 6 ✅ | Phase 7 ✅

## Stack

**v2 (Modern)**
- Next.js 16+ | TypeScript 5+ | Material UI v7
- i18next (English + French) | Theme Switching (Light/Dark/High Contrast)
- Vitest + React Testing Library (87%+ coverage, 1,123 tests)
- WCAG 2.2 Level AA Compliant | SEO Optimized (Lighthouse SEO 100)
- Performance Optimized (Lighthouse Desktop 97–100, Mobile 90–92)

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

All commands run from the `v2/` directory:

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm test              # Run tests
npm run test:coverage # Coverage report
npm run lint          # ESLint check
npm run typecheck     # TypeScript check
```

## Project Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1. Foundation & Setup | ✅ Complete | Next.js, TypeScript, MUI, ESLint, Prettier, Git hooks |
| 2. Data Migration | ✅ Complete | Testing setup, TypeScript interfaces, data layer, 18 projects |
| 3. Core Pages | ✅ Complete | Homepage, Resume, Colophon, Shared Components, Lightbox |
| 4. Enhanced Features | ✅ Complete | Theme switching, i18n, animations, WCAG 2.2 AA, SEO |
| 5. Performance | ✅ Complete | Font optimization, lazy loading, SSG, server components, Lighthouse 97–100 |
| 6. Deployment | ✅ Complete | Railway hosting, CI/CD via GitHub Actions, approval gates |
| 7. Monitoring & Analytics | ✅ Complete | PostHog, Web Vitals, Sentry, Better Stack, Dependabot |

## Documentation

- **[Modernization Plan](docs/active/MODERNIZATION_PLAN.md)** — Complete roadmap
- **[Project Context](docs/active/PROJECT_CONTEXT.md)** — Current status and architecture
- **[v2 README](v2/README.md)** — Detailed v2 documentation
- **Guides**
  - [Theme Switching](docs/guides/THEME_SWITCHING.md)
  - [Localization](docs/guides/LOCALIZATION_ARCHITECTURE.md)
  - [JSDoc Examples](docs/guides/JSDOC_EXAMPLES.md)
- **Accessibility**
  - [Accessibility Statement](docs/accessibility/ACCESSIBILITY_STATEMENT.md)
  - [WCAG Compliance Guide](docs/accessibility/WCAG_COMPLIANCE_GUIDE.md)
  - [Testing Checklist](docs/accessibility/ACCESSIBILITY_TESTING_CHECKLIST.md)
  - [Testing Developer Guide](docs/accessibility/ACCESSIBILITY_TESTING.md)
- **Setup**
  - [Testing Setup](docs/setup/TESTING_SETUP.md)
  - [MCP Setup](docs/setup/MCP_SETUP.md)
  - [Railway Deployment](docs/setup/RAILWAY_DEPLOYMENT.md)
  - [PostHog Analytics](docs/setup/POSTHOG_SETUP.md)
- **Active Plans**
  - [Phase 7: Monitoring & Analytics](docs/archive/PHASE7_DETAILED_PLAN.md)
- **Archive** — [Completed phase plans](docs/archive/)

## Key Requirements

- **Accessibility:** WCAG 2.2 Level AA compliance (mandatory)
- **Testing:** 80%+ coverage for data layer, 100% for critical paths
- **Documentation:** All code must have JSDoc comments

## License

© 2013-2026 Sing Chan. All rights reserved.
