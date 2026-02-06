# Documentation Index

This directory contains all project documentation organized by purpose and phase.

## 📋 Quick Navigation

### **Active Development**
- **[Modernization Plan](active/MODERNIZATION_PLAN.md)** - Overall project roadmap and strategy
- **[Phase 4 Enhanced Features](active/PHASE4_DETAILED_PLAN.md)** - Current work in progress
  - Task 4.1: Theme Switching ✅
  - Task 4.2: Internationalization (i18n) ✅
  - Task 4.3: Animations & Transitions 🔄
  - Task 4.4: WCAG 2.2 Level AA Compliance
  - Task 4.5: SEO Optimization

### **Reference & Guides**
- **[PROJECT_CONTEXT.md](guides/PROJECT_CONTEXT.md)** - Project overview and architecture
- **[CODE_REVIEW_GUIDELINES.md](guides/CODE_REVIEW_GUIDELINES.md)** - Code review standards
- **[JSDOC_EXAMPLES.md](guides/JSDOC_EXAMPLES.md)** - Documentation patterns and templates
- **[THEME_SWITCHING.md](guides/THEME_SWITCHING.md)** - Theme system documentation
- **[CODE_QUALITY_DASHBOARD.md](guides/CODE_QUALITY_DASHBOARD.md)** - Quality metrics and standards

### **Development Tools**
- **[git-commit-haiku-usage.md](tooling/git-commit-haiku-usage.md)** - Using the commit skill
- **[changelog-create-haiku-usage.md](tooling/changelog-create-haiku-usage.md)** - Creating changelog entries
- **[haiku-agents-overview.md](tooling/haiku-agents-overview.md)** - AI assistant tools overview

### **Setup & Infrastructure** (Historical Reference)
- **[TESTING_SETUP.md](setup/TESTING_SETUP.md)** - Testing infrastructure configuration
- **[STATIC_ANALYSIS_SETUP.md](setup/STATIC_ANALYSIS_SETUP.md)** - Linting and analysis setup
- **[LINTING_COMPLIANCE_ANALYSIS.md](setup/LINTING_COMPLIANCE_ANALYSIS.md)** - Compliance analysis results

### **Completed Phases** (Archive)
- **[PHASE3_DETAILED_PLAN.md](archive/PHASE3_DETAILED_PLAN.md)** - Core Pages (✅ Complete)
- **[PHASE2_DETAILED_PLAN.md](archive/PHASE2_DETAILED_PLAN.md)** - Data Migration (✅ Complete)
- **[ASYNC_LOADING_IMPLEMENTATION_PLAN.md](archive/ASYNC_LOADING_IMPLEMENTATION_PLAN.md)** - Async Loading (✅ Implemented)
- **[PROJECTS_PAGE_MVP_PLAN.md](archive/PROJECTS_PAGE_MVP_PLAN.md)** - Projects Page MVP (✅ Implemented)
- **[CODE_REVIEW_REMEDIATION_PLAN.md](archive/CODE_REVIEW_REMEDIATION_PLAN.md)** - Code Remediation (✅ Complete)

### **Screenshots**
- [screenshots/](screenshots/) - Design mockups and implementation screenshots

---

## 📂 Directory Structure

```
docs/
├── README.md                    # This file
├── active/                      # Current work & strategy
│   ├── MODERNIZATION_PLAN.md
│   └── PHASE4_DETAILED_PLAN.md
├── guides/                      # Reference materials & standards
│   ├── PROJECT_CONTEXT.md
│   ├── CODE_REVIEW_GUIDELINES.md
│   ├── JSDOC_EXAMPLES.md
│   ├── THEME_SWITCHING.md
│   └── CODE_QUALITY_DASHBOARD.md
├── tooling/                     # CLI tools & utilities
│   ├── git-commit-haiku-usage.md
│   ├── changelog-create-haiku-usage.md
│   └── haiku-agents-overview.md
├── setup/                       # Infrastructure & setup (historical)
│   ├── TESTING_SETUP.md
│   ├── STATIC_ANALYSIS_SETUP.md
│   └── LINTING_COMPLIANCE_ANALYSIS.md
├── archive/                     # Completed phases & superseded plans
│   ├── PHASE3_DETAILED_PLAN.md
│   ├── PHASE2_DETAILED_PLAN.md
│   ├── ASYNC_LOADING_IMPLEMENTATION_PLAN.md
│   ├── PROJECTS_PAGE_MVP_PLAN.md
│   └── CODE_REVIEW_REMEDIATION_PLAN.md
└── screenshots/                 # Design mockups
    ├── colophon/
    ├── project-layout/
    ├── projects-nav/
    └── resume/
```

---

## 🎯 Using This Documentation

### For Active Development
- Start with **[Phase 4](active/PHASE4_DETAILED_PLAN.md)** for current tasks
- Reference **[CODE_REVIEW_GUIDELINES.md](guides/CODE_REVIEW_GUIDELINES.md)** during code reviews
- Use **[JSDOC_EXAMPLES.md](guides/JSDOC_EXAMPLES.md)** for documentation patterns

### For New Features
- Check **[PROJECT_CONTEXT.md](guides/PROJECT_CONTEXT.md)** for architecture
- Review **[THEME_SWITCHING.md](guides/THEME_SWITCHING.md)** if implementing theme support
- Consult **[CODE_QUALITY_DASHBOARD.md](guides/CODE_QUALITY_DASHBOARD.md)** for quality standards

### For Building & Deployment
- Reference **[setup/](setup/)** for configuration details
- See main [README.md](../README.md) for quick start commands

### For Historical Reference
- Browse **[archive/](archive/)** to understand previous implementation approaches
- Read completed phase documents to understand architectural decisions

---

## 📝 Adding New Documentation

When creating new documentation:

1. **Determine the category:**
   - Is it active work? → `active/`
   - Is it a reference guide? → `guides/`
   - Is it a tool guide? → `tooling/`
   - Is it historical? → `archive/`
   - Is it infrastructure? → `setup/`

2. **Follow naming conventions:**
   - Use SCREAMING_SNAKE_CASE for documents
   - Be descriptive and concise

3. **Update this index** with a link to your new document

---

**Last Updated:** 2026-02-05
