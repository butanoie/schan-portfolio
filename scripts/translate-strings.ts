/**
 * Translation Helper for Adding New Strings to i18n
 *
 * This script helps translate English strings to supported languages (French)
 * and generates the formatted TypeScript code for v2/src/lib/i18n.ts
 *
 * Usage:
 * - Collect English strings with their context
 * - Use this helper to translate strings using DeepL
 * - Output formatted TypeScript entries ready to copy into i18n.ts
 *
 * @module scripts/translate-strings
 */

interface TranslationRequest {
  /** English text to translate */
  english: string;
  /** Context for the string (e.g., "button label", "error message") */
  context?: string;
  /** Suggested translation key (e.g., "buttons.load") */
  suggestedKey?: string;
}

interface TranslationResult {
  /** The translation key */
  key: string;
  /** English translation */
  en: string;
  /** French translation */
  fr: string;
  /** Context where this string is used */
  context?: string;
  /** TypeScript code snippet ready to paste */
  codeSnippet: string;
}

/**
 * Suggests a translation key based on the English text and context
 *
 * @param english - The English text
 * @param context - Optional context (e.g., "button", "error")
 * @returns Suggested translation key
 *
 * @example
 * suggestKey("Load more", "button") // Returns "buttons.loadMore"
 * suggestKey("Something went wrong", "error") // Returns "errors.somethingWentWrong"
 */
export function suggestKey(english: string, context?: string): string {
  const words = english
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);

  const key = words
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('');

  const category = context?.toLowerCase() || 'common';
  return `${category}.${key}`;
}

/**
 * Generates TypeScript code snippets for adding translations
 *
 * @param results - Translation results
 * @returns Formatted TypeScript code ready to paste into i18n.ts
 *
 * @example
 * const code = generateCodeSnippets([
 *   { key: 'buttons.load', en: 'Load', fr: 'Charger' }
 * ]);
 */
export function generateCodeSnippets(results: TranslationResult[]): string {
  let output = '';

  output += '// Add these keys to the TranslationKey type:\n';
  output += results.map(r => `| '${r.key}'`).join('\n');
  output += '\n\n';

  output += '// Add these entries to the EN translations object:\n';
  output +=
    results
      .map(r => `'${r.key}': '${r.en.replace(/'/g, "\\'")}'`)
      .join(',\n') + ',\n\n';

  output += '// Add these entries to the FR translations object:\n';
  output +=
    results
      .map(r => `'${r.key}': '${r.fr.replace(/'/g, "\\'")}'`)
      .join(',\n') + ',';

  return output;
}

/**
 * Helper type for quick translation workflow
 * Use this in the translation process
 */
export type TranslationWorkflow = {
  requests: TranslationRequest[];
  results: TranslationResult[];
  addRequest: (req: TranslationRequest) => void;
  addResult: (res: TranslationResult) => void;
  generateOutput: () => string;
};

/**
 * Creates a new translation workflow instance
 * @returns Workflow object with helper methods
 */
export function createWorkflow(): TranslationWorkflow {
  const requests: TranslationRequest[] = [];
  const results: TranslationResult[] = [];

  return {
    requests,
    results,
    addRequest: (req: TranslationRequest) => {
      requests.push(req);
    },
    addResult: (res: TranslationResult) => {
      results.push(res);
    },
    generateOutput: () => generateCodeSnippets(results),
  };
}

// Example usage documentation:
/*
 * WORKFLOW:
 *
 * 1. Collect English strings with context:
 *    const workflow = createWorkflow();
 *    workflow.addRequest({
 *      english: "Load more projects",
 *      context: "button"
 *    });
 *
 * 2. Translate using DeepL (see LOCALIZATION.md)
 *
 * 3. Add results:
 *    workflow.addResult({
 *      key: "buttons.loadMore",
 *      en: "Load more projects",
 *      fr: "Charger plus de projets",
 *      context: "button",
 *      codeSnippet: "..."
 *    });
 *
 * 4. Generate code:
 *    console.log(workflow.generateOutput());
 *
 * 5. Copy the output to v2/src/lib/i18n.ts
 */
