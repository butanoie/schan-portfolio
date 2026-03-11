# Documentation Index

This directory contains all project documentation organized by purpose.

## Quick Navigation

### **Reference & Guides**
- **[JSDOC_EXAMPLES.md](guides/JSDOC_EXAMPLES.md)** - Documentation patterns and templates
- **[LOCALIZATION_ARCHITECTURE.md](guides/LOCALIZATION_ARCHITECTURE.md)** - i18n architecture, patterns, and translation workflows
- **[MAINTENANCE_WORKFLOW.md](guides/MAINTENANCE_WORKFLOW.md)** - Maintenance and dependency update workflow

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

### **Archive** (Completed Plans)
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
├── guides/                      # Reference materials & standards
├── setup/                       # Infrastructure & setup
├── archive/                     # Completed phases & superseded plans
│   └── performance/             # Performance-specific archive
└── screenshots/                 # Design mockups
```

---

## Adding New Documentation

1. **Determine the category:**
   - Reference guide? → `guides/`
   - Accessibility? → `accessibility/`
   - Infrastructure? → `setup/`
   - Completed/historical? → `archive/`

2. **Follow naming conventions:** Use SCREAMING_SNAKE_CASE, be descriptive

3. **Update this index** with a link to your new document
