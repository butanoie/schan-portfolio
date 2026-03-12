# Components

## MUI ARIA Gotchas

- `FormControlLabel` overrides the wrapped component's `aria-label` — the accessible name comes from the label prop, not `aria-label` on the `Switch`/`Checkbox`
- `AccordionDetails` does NOT auto-assign `id` from `AccordionSummary`'s `aria-controls` — you must set `id` explicitly on both elements
- `Popover` does NOT have `role="dialog"` — locate via trigger button and child controls, not dialog role
- `ToggleButtonGroup` renders as `role="group"` — individual buttons get `aria-pressed="true"` when selected
- `Drawer` renders as `role="dialog"` — locate drawer contents via the `<nav>` landmark inside it
