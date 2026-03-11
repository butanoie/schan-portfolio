# Portfolio v2 - Modern Next.js Application

Modern portfolio website for Sing Chan, built with Next.js 16+, TypeScript, and Material UI. This is a modernization of the 2013 legacy portfolio (see `../v1`).

## Getting Started

### Prerequisites

- Node.js 18+ LTS
- npm 11+

### Installation

```bash
npm install
cp .env.example .env.local   # Configure environment variables
npm run dev                   # Open http://localhost:3000
```

## Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Testing

- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with interactive UI

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
v2/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with theme and metadata
│   ├── page.tsx            # Homepage (projects listing)
│   ├── sitemap.ts          # Dynamic sitemap generation
│   ├── robots.ts           # Robots.txt generator
│   ├── resume/             # Resume page
│   ├── colophon/           # Colophon/About page
│   └── projects/[id]/      # Dynamic project detail pages
├── src/
│   ├── __tests__/          # Test files (mirrors source structure)
│   ├── components/         # React components
│   ├── constants/          # Centralized constants (colors, SEO)
│   ├── contexts/           # React contexts
│   ├── data/               # Content data (projects, resume, colophon)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Libraries (theme, i18n, sanitize, SEO)
│   ├── locales/            # Translation files
│   ├── styles/             # Global styles and animations
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets (images, fonts)
└── .husky/                 # Git hooks (lint + format on commit)
```

## Security

All environment variables must be in `.env.local` (gitignored). See `.env.example` for required variables. Never commit secrets or API keys.

## License

© 2013-2026 Sing Chan. All rights reserved.
