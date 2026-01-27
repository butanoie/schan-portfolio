# Portfolio v2 - Modern Next.js Application

Modern portfolio website for Sing Chan, built with Next.js 14+, TypeScript, and Material UI. This is a modernization of the 2013 legacy portfolio (see `../v1`).

## Phase 1 Complete - Foundation & Setup ✅

All Phase 1 tasks from the [Modernization Plan](../docs/MODERNIZATION_PLAN.md) have been completed:

- ✅ Next.js 14+ with TypeScript and App Router
- ✅ Material UI v5+ with custom theme
- ✅ Project structure organized ([src/components](src/components/), [src/lib](src/lib/), [src/types](src/types/), [src/utils](src/utils/), [src/styles](src/styles/))
- ✅ ESLint with accessibility plugins (jsx-a11y)
- ✅ Prettier for code formatting
- ✅ TypeScript strict mode enabled
- ✅ Git hooks with Husky and lint-staged
- ✅ Accessibility testing tools (axe-core)
- ✅ Basic layout components (Header, Footer, MainLayout)
- ✅ Custom MUI theme with portfolio color palette
- ✅ Security: .gitignore configured for secrets management

## Technology Stack

### Core
- **Framework:** Next.js 16.1.4 (React 19.2.3)
- **Language:** TypeScript 5+
- **UI Library:** Material UI v7.3.7
- **Styling:** Emotion + Tailwind CSS v4

### Development Tools
- **Testing:** Vitest 4 + React Testing Library
- **Linting:** ESLint 9 with Next.js and accessibility rules
- **Formatting:** Prettier 3.8
- **Git Hooks:** Husky 9 + lint-staged
- **Accessibility:** axe-core + @axe-core/react

## Getting Started

### Prerequisites

- Node.js 18+ LTS (v25.4.0 recommended)
- npm 11+ (v11.7.0 recommended)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables (if needed):
   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
v2/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with theme
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── src/
│   ├── __tests__/        # Test files
│   │   ├── components/   # Component tests
│   │   ├── lib/          # Library tests
│   │   ├── utils/        # Utility tests
│   │   └── README.md     # Testing guide
│   ├── components/        # React components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── Footer.tsx    # Site footer
│   │   ├── MainLayout.tsx # Main layout wrapper
│   │   └── ThemeProvider.tsx # MUI theme provider
│   ├── lib/              # Libraries and utilities
│   │   └── theme.ts      # MUI theme configuration
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── styles/           # Style utilities
├── public/               # Static assets
└── .husky/               # Git hooks
```

## Design System

### Color Palette
- **Primary:** Sky Blue (#87CEEB) - Main accent color
- **Secondary:** Duck Egg (#C8E6C9) - Pastel green accent
- **Background:** Sakura (#FFF0F5) - Cherry blossom pink
- **Text:** Graphite (#2C2C2C) - Dark neutral

### Typography
- **Body:** Open Sans
- **Headings:** Oswald
- **Buta's Bubbles:** Gochi Hand

## Testing

This project uses **Vitest** and **React Testing Library** for comprehensive test coverage.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests with interactive UI
npm run test:ui
```

### Test Coverage Goals

Per the [modernization plan](../docs/MODERNIZATION_PLAN.md):
- **80%+ coverage** for data layer utilities
- **100% coverage** for critical business logic
- All tests must pass before committing

### Writing Tests

See [src/__tests__/README.md](src/__tests__/README.md) for testing conventions and best practices.

Example test structure:
```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from '@/src/utils/formatDate';

describe('formatDate', () => {
  it('should format dates correctly', () => {
    expect(formatDate('2024-01-15T12:00:00Z')).toBe('January 15, 2024');
  });
});
```

## Accessibility

This project is committed to WCAG 2.2 Level AA compliance:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Skip to main content link
- Focus indicators
- Screen reader compatible

## Security

**Important:** Never commit secrets or sensitive information to source control.

- All environment variables must be in `.env.local` (gitignored)
- See `.env.example` for required variables
- Secrets like API keys should never be committed
- See [Security Requirements](../docs/MODERNIZATION_PLAN.md#security-requirements) for details

## Next Steps

See the [Modernization Plan](../docs/MODERNIZATION_PLAN.md) for the full roadmap:
- Phase 2: Data Migration
- Phase 3: Core Pages Development
- Phase 4: Enhanced Features
- Phase 5: Performance & Optimization
- Phase 6: Deployment & Migration
- Phase 7: Post-Launch

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

## License

© 2026 Sing Chan. All rights reserved.
