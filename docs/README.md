# Documentation Index

This directory contains all project documentation organized by purpose and phase.

## Quick Navigation

### **Active Development**
- **[Modernization Plan](active/MODERNIZATION_PLAN.md)** - Overall project roadmap and strategy
- **[Project Context](active/PROJECT_CONTEXT.md)** - Project overview and architecture

### **Reference & Guides**
- **[JSDOC_EXAMPLES.md](guides/JSDOC_EXAMPLES.md)** - Documentation patterns and templates
- **[THEME_SWITCHING.md](guides/THEME_SWITCHING.md)** - Theme system documentation
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
### **Completed Phases** (Archive)
- **[LINTING_COMPLIANCE_ANALYSIS.md](archive/LINTING_COMPLIANCE_ANALYSIS.md)** - Linting remediation report (Complete)
- **[PHASE7_DETAILED_PLAN.md](archive/PHASE7_DETAILED_PLAN.md)** - Monitoring & Observability (Complete)
- **[PHASE4_DETAILED_PLAN.md](archive/PHASE4_DETAILED_PLAN.md)** - Enhanced Features (Complete)
- **[TASK_4.4_WCAG_COMPLIANCE_PLAN.md](archive/TASK_4.4_WCAG_COMPLIANCE_PLAN.md)** - WCAG Compliance (Complete)
- **[TASK_4_5_SEO_PLAN.md](archive/TASK_4_5_SEO_PLAN.md)** - SEO Optimization (Complete)
- **[PHASE3_DETAILED_PLAN.md](archive/PHASE3_DETAILED_PLAN.md)** - Core Pages (Complete)
- **[PHASE2_DETAILED_PLAN.md](archive/PHASE2_DETAILED_PLAN.md)** - Data Migration (Complete)
- **[PHASE5_DETAILED_PLAN.md](archive/performance/PHASE5_DETAILED_PLAN.md)** - Performance Optimization (Complete)
- **[ASYNC_LOADING_IMPLEMENTATION_PLAN.md](archive/ASYNC_LOADING_IMPLEMENTATION_PLAN.md)** - Async Loading (Implemented)
- **[PROJECTS_PAGE_MVP_PLAN.md](archive/PROJECTS_PAGE_MVP_PLAN.md)** - Projects Page MVP (Implemented)
- **[CODE_REVIEW_REMEDIATION_PLAN.md](archive/CODE_REVIEW_REMEDIATION_PLAN.md)** - Code Remediation (Complete)
- **[I18N_STANDARDIZATION_PLAN.md](archive/I18N_STANDARDIZATION_PLAN.md)** - i18n Standardization (Complete)
- **[ARTIFACTS.md](archive/ARTIFACTS.md)** - Artifacts documentation
- **[ARTIFACTS_PAGE_PLAN.md](archive/ARTIFACTS_PAGE_PLAN.md)** - Artifacts page plan
- **[gh-issue-19-mobile-navigation-refactor.md](archive/gh-issue-19-mobile-navigation-refactor.md)** - Mobile navigation refactor

#### Performance Archive
- **[PERFORMANCE_BASELINE.md](archive/performance/PERFORMANCE_BASELINE.md)** - Performance baseline measurements
- **[PERFORMANCE_REPORT.md](archive/performance/PERFORMANCE_REPORT.md)** - Performance analysis report
- **[COMPONENT_AUDIT.md](archive/performance/COMPONENT_AUDIT.md)** - Component performance audit
- **[I18N_BOUNDARY_STRATEGY.md](archive/performance/I18N_BOUNDARY_STRATEGY.md)** - i18n boundary strategy

### **Screenshots**
- [screenshots/](screenshots/) - Design mockups and implementation screenshots

---

## Directory Structure

```
docs/
├── README.md                    # This file
├── active/                      # Current work & strategy
│   ├── MODERNIZATION_PLAN.md
│   └── PROJECT_CONTEXT.md
├── accessibility/               # Accessibility documentation
│   ├── ACCESSIBILITY_AUDIT_REPORT.md
│   ├── ACCESSIBILITY_STATEMENT.md
│   ├── ACCESSIBILITY_TESTING.md
│   ├── ACCESSIBILITY_TESTING_CHECKLIST.md
│   └── WCAG_COMPLIANCE_GUIDE.md
├── guides/                      # Reference materials & standards
│   ├── JSDOC_EXAMPLES.md
│   ├── LOCALIZATION_ARCHITECTURE.md
│   ├── MAINTENANCE_WORKFLOW.md
│   └── THEME_SWITCHING.md
├── setup/                       # Infrastructure & setup
│   ├── MCP_SETUP.md
│   ├── POSTHOG_SETUP.md
│   ├── RAILWAY_DEPLOYMENT.md
│   ├── SENTRY_SETUP.md
│   └── TESTING_SETUP.md
├── archive/                     # Completed phases & superseded plans
│   ├── ARTIFACTS.md
│   ├── ARTIFACTS_PAGE_PLAN.md
│   ├── ASYNC_LOADING_IMPLEMENTATION_PLAN.md
│   ├── CODE_REVIEW_REMEDIATION_PLAN.md
│   ├── I18N_STANDARDIZATION_PLAN.md
│   ├── LINTING_COMPLIANCE_ANALYSIS.md
│   ├── PHASE2_DETAILED_PLAN.md
│   ├── PHASE3_DETAILED_PLAN.md
│   ├── PHASE4_DETAILED_PLAN.md
│   ├── PHASE7_DETAILED_PLAN.md
│   ├── PROJECTS_PAGE_MVP_PLAN.md
│   ├── TASK_4.4_WCAG_COMPLIANCE_PLAN.md
│   ├── TASK_4_5_SEO_PLAN.md
│   ├── gh-issue-19-mobile-navigation-refactor.md
│   └── performance/
│       ├── COMPONENT_AUDIT.md
│       ├── I18N_BOUNDARY_STRATEGY.md
│       ├── PERFORMANCE_BASELINE.md
│       ├── PERFORMANCE_REPORT.md
│       └── PHASE5_DETAILED_PLAN.md
└── screenshots/                 # Design mockups
    ├── colophon/
    ├── project-layout/
    ├── projects-nav/
    └── resume/
```

---

## Using This Documentation

### For Active Development
- Start with **[Modernization Plan](active/MODERNIZATION_PLAN.md)** for the project roadmap
- Use **[JSDOC_EXAMPLES.md](guides/JSDOC_EXAMPLES.md)** for documentation patterns

### For Localization
- See **[LOCALIZATION_ARCHITECTURE.md](guides/LOCALIZATION_ARCHITECTURE.md)** for architecture, patterns, and translation workflows

### For Accessibility
- Review **[WCAG_COMPLIANCE_GUIDE.md](accessibility/WCAG_COMPLIANCE_GUIDE.md)** for compliance standards
- Use **[ACCESSIBILITY_TESTING_CHECKLIST.md](accessibility/ACCESSIBILITY_TESTING_CHECKLIST.md)** when testing

### For Building & Deployment
- Reference **[setup/](setup/)** for configuration details
- See **[RAILWAY_DEPLOYMENT.md](setup/RAILWAY_DEPLOYMENT.md)** for deployment
- See main [README.md](../README.md) for quick start commands

### For Historical Reference
- Browse **[archive/](archive/)** to understand previous implementation approaches
- Read completed phase documents to understand architectural decisions

---

## Adding New Documentation

When creating new documentation:

1. **Determine the category:**
   - Is it active work? → `active/`
   - Is it a reference guide? → `guides/`
   - Is it accessibility-related? → `accessibility/`
- Is it infrastructure? → `setup/`
   - Is it historical? → `archive/`

2. **Follow naming conventions:**
   - Use SCREAMING_SNAKE_CASE for documents
   - Be descriptive and concise

3. **Update this index** with a link to your new document

---

**Last Updated:** 2026-03-11
