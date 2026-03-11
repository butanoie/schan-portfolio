---
name: translation-sync
description: Detect missing or stale i18n translations and auto-translate French via DeepL MCP
disable-model-invocation: true
---

# Translation Sync

Find missing or outdated French translations and generate them using DeepL.

## Steps

### 1. Scan for missing keys

Compare each English locale file against its French counterpart:

| English | French |
|---------|--------|
| `v2/src/locales/en/common.json` | `v2/src/locales/fr/common.json` |
| `v2/src/locales/en/colophon.json` | `v2/src/locales/fr/colophon.json` |
| `v2/src/locales/en/components.json` | `v2/src/locales/fr/components.json` |
| `v2/src/locales/en/home.json` | `v2/src/locales/fr/home.json` |
| `v2/src/locales/en/projects.json` | `v2/src/locales/fr/projects.json` |
| `v2/src/locales/en/resume.json` | `v2/src/locales/fr/resume.json` |
| `v2/src/locales/en/samples.json` | `v2/src/locales/fr/samples.json` |

Report keys present in English but missing in French (recursively, including nested objects).

### 2. Translate missing keys

For each missing key, use the DeepL MCP to translate:

```
mcp__deepl__translate-text(text: "<english value>", source_lang: "EN", target_lang: "FR")
```

Present translations to the user for review before writing.

### 3. Write translations

Add approved translations to the corresponding French locale JSON file. Preserve existing key order and formatting.

### 4. Check for orphaned French keys

Report any keys in French files that do not exist in the English files — these may be stale and candidates for removal.

## Output

Summarize as a table:

| File | Missing | Added | Orphaned |
|------|---------|-------|----------|
| common.json | count | count | count |
| ... | ... | ... | ... |
