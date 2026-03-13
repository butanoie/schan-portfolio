# Components

## MUI ARIA Gotchas

- `FormControlLabel` overrides the wrapped component's `aria-label` — the accessible name comes from the label prop, not `aria-label` on the `Switch`/`Checkbox`
- `AccordionDetails` does NOT auto-assign `id` from `AccordionSummary`'s `aria-controls` — you must set `id` explicitly on both elements
- `Popover` does NOT have `role="dialog"` — locate via trigger button and child controls, not dialog role
- `Dialog` `aria-label` must go on `slotProps.paper`, NOT as a direct prop — MUI v7 places `role="dialog"` on the Paper element, not the root. Direct props land on the root (`role="generic"`), breaking `getByRole('dialog', { name: ... })` queries.
- `ToggleButtonGroup` renders as `role="group"` — individual buttons get `aria-pressed="true"` when selected
- `Drawer` renders as `role="dialog"` — locate drawer contents via the `<nav>` landmark inside it

## Accessibility Patterns

- **Skip link targets need `tabindex="-1"`** — Anchor targets like `#main-content` on non-interactive elements (`<main>`, `<div>`) must have `tabindex="-1"` to receive focus after skip link activation. Pair with `outline: none` on `:focus` to avoid a confusing focus ring on landmarks.
