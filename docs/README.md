# Documentation Index

This directory contains all project documentation organized by purpose.

## Quick Navigation

### **Reference & Guides**
- **[JSDOC_EXAMPLES.md](guides/JSDOC_EXAMPLES.md)** - Documentation patterns and templates
- **[LOCALIZATION_ARCHITECTURE.md](guides/LOCALIZATION_ARCHITECTURE.md)** - i18n architecture, patterns, and translation workflows
- **[MAINTENANCE_WORKFLOW.md](guides/MAINTENANCE_WORKFLOW.md)** - Maintenance and dependency update workflow
- **[TESTING_ARCHITECTURE.md](guides/TESTING_ARCHITECTURE.md)** - Integration & E2E test architecture (POM, Playwright, axe)

### **Accessibility**
- **[ACCESSIBILITY_AUDIT_REPORT.md](accessibility/ACCESSIBILITY_AUDIT_REPORT.md)** - Audit findings and results
- **[ACCESSIBILITY_STATEMENT.md](accessibility/ACCESSIBILITY_STATEMENT.md)** - Public accessibility statement
- **[ACCESSIBILITY_TESTING.md](accessibility/ACCESSIBILITY_TESTING.md)** - Testing procedures
- **[ACCESSIBILITY_TESTING_CHECKLIST.md](accessibility/ACCESSIBILITY_TESTING_CHECKLIST.md)** - Testing checklist
- **[WCAG_COMPLIANCE_GUIDE.md](accessibility/WCAG_COMPLIANCE_GUIDE.md)** - WCAG compliance reference

### **Setup & Infrastructure**
- **[MCP_SETUP.md](setup/MCP_SETUP.md)** - MCP server configuration and tokens
- **[POSTHOG_SETUP.md](setup/POSTHOG_SETUP.md)** - PostHog analytics setup
- **[SENTRY_SETUP.md](setup/SENTRY_SETUP.md)** - Sentry error tracking setup
- **[RAILWAY_DEPLOYMENT.md](setup/RAILWAY_DEPLOYMENT.md)** - Railway deployment configuration
- **[TESTING_SETUP.md](setup/TESTING_SETUP.md)** - Testing infrastructure configuration

### **Test Scenarios** (Gherkin)
- **[test-scenarios/](test-scenarios/)** - Evergreen test scenarios in Given/When/Then format
  - Integration: [Localization Pipeline](test-scenarios/INT_LOCALIZATION_PIPELINE.md) · [Server Data Fetching](test-scenarios/INT_SERVER_DATA_FETCHING.md) · [useProjectLoader](test-scenarios/INT_USE_PROJECT_LOADER.md) · [AsyncProjectsList](test-scenarios/INT_ASYNC_PROJECTS_LIST.md)
  - E2E: [Accessibility](test-scenarios/E2E_ACCESSIBILITY.md) · [Navigation](test-scenarios/E2E_NAVIGATION.md) · [Settings](test-scenarios/E2E_SETTINGS.md) · [Home Page](test-scenarios/E2E_HOME_PAGE.md) · [Lightbox](test-scenarios/E2E_LIGHTBOX.md) · [Content Pages](test-scenarios/E2E_CONTENT_PAGES.md) · [Responsive](test-scenarios/E2E_RESPONSIVE.md)

### **Archive** (Completed Plans)
- **[TESTING_ROADMAP.md](archive/TESTING_ROADMAP.md)** - Integration & E2E test implementation roadmap (14 phases, completed)
- **[MODERNIZATION_PLAN.md](archive/MODERNIZATION_PLAN.md)** - Overall 7-phase project roadmap
- **[PHASE7_DETAILED_PLAN.md](archive/PHASE7_DETAILED_PLAN.md)** - Monitoring & Observability
- **[PHASE4_DETAILED_PLAN.md](archive/PHASE4_DETAILED_PLAN.md)** - Enhanced Features
- **[PHASE5_DETAILED_PLAN.md](archive/performance/PHASE5_DETAILED_PLAN.md)** - Performance Optimization
- **[PHASE3_DETAILED_PLAN.md](archive/PHASE3_DETAILED_PLAN.md)** - Core Pages
- **[PHASE2_DETAILED_PLAN.md](archive/PHASE2_DETAILED_PLAN.md)** - Data Migration
- [Full archive listing →](archive/)

### **Screenshots**
- [screenshots/](screenshots/) - Design mockups and implementation screenshots

---

## Directory Structure

```
docs/
├── README.md                    # This file
├── accessibility/               # Accessibility documentation
├── active/                      # In-progress plans & roadmaps
├── test-scenarios/              # Gherkin-syntax test scenarios
├── guides/                      # Reference materials & standards
├── setup/                       # Infrastructure & setup
├── archive/                     # Completed phases & superseded plans
│   └── performance/             # Performance-specific archive
└── screenshots/                 # Design mockups
```

---

## Adding New Documentation

1. **Determine the category:**
   - In-progress plan? → `active/`
   - Test scenario? → `test-scenarios/`
   - Reference guide? → `guides/`
   - Accessibility? → `accessibility/`
   - Infrastructure? → `setup/`
   - Completed/historical? → `archive/`

2. **Follow naming conventions:** Use SCREAMING_SNAKE_CASE, be descriptive

3. **Update this index** with a link to your new document
