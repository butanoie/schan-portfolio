# Components

## MUI ARIA Gotchas

- `FormControlLabel` overrides the wrapped component's `aria-label` — the accessible name comes from the label prop, not `aria-label` on the `Switch`/`Checkbox`
- `AccordionDetails` does NOT auto-assign `id` from `AccordionSummary`'s `aria-controls` — you must set `id` explicitly on both elements
- `AccordionDetails` with explicit `id` + `AccordionSummary` with `aria-controls` creates **duplicate IDs** in the DOM — MUI wraps `AccordionDetails` in a `<div role="region">` that also receives the `aria-controls` target ID. Use `.MuiAccordionDetails-root` in E2E tests to disambiguate.
- `Popover` does NOT have a landmark role by default — add `role="region"` + `aria-label` via `slotProps.paper` (with `as const` for TypeScript) when the popover must satisfy the axe `region` rule (WCAG landmark containment). Use `role="region"` rather than `role="dialog"` since Popovers are non-modal. The settings popover already has this applied.
- `Dialog` `aria-label` must go on `slotProps.paper`, NOT as a direct prop — MUI v7 places `role="dialog"` on the Paper element, not the root. Direct props land on the root (`role="generic"`), breaking `getByRole('dialog', { name: ... })` queries.
- `ToggleButtonGroup` renders as `role="group"` — individual buttons get `aria-pressed="true"` when selected
- `Drawer` renders as `role="dialog"` — locate drawer contents via the `<nav>` landmark inside it
- `Popover`/`Modal` sets `aria-hidden` on ALL sibling DOM branches while open — any `getByRole` query targeting elements outside the modal will fail. Pre-capture references before opening, or close the modal before querying siblings.
- `ThoughtBubble` (`Footer.tsx`) uses `role="img"` — all children become presentational and invisible to assistive technologies. The Load More button inside it is not discoverable by screen readers. The `aria-label` on the bubble is hardcoded English (not translated).

## Accessibility Patterns

- **Skip link targets need `tabindex="-1"`** — Anchor targets like `#main-content` on non-interactive elements (`<main>`, `<div>`) must have `tabindex="-1"` to receive focus after skip link activation. Pair with `outline: none` on `:focus` to avoid a confusing focus ring on landmarks.

## Resume Work Experience DOM Contract

`WorkExperience.tsx` renders per-role contributions (not job-level). The print CSS at `app/resume/print.css` targets this exact DOM structure with child combinator selectors. If the nesting changes, the print layout breaks. See the DOM structure comment in `print.css` for the expected hierarchy.

## ClientList Bin Packing

`ClientList.tsx` uses a first-fit-decreasing bin-packing algorithm to reorder client chips for row density. `CONTAINER_WIDTH_PX` (280) and `CHIP_GAP_PX` (6) are coupled to the component's `p: 2.5` padding and `gap: 0.75` respectively — update both if either changes.
