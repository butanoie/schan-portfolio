# Styles Directory

This directory contains CSS styling for the portfolio application, with a focus on global animations and transitions.

## Files

### `animations.css`

Global animation definitions including keyframes and utility classes.

**Keyframe Animations:**
- `fadeIn` - Fade from transparent to opaque (300ms)
- `fadeOut` - Fade from opaque to transparent (300ms)
- `slideUp` - Slide upward with fade (400ms)
- `slideDown` - Slide downward with fade (300ms)
- `slideLeft` - Slide left with fade (300ms)
- `slideRight` - Slide right with fade (300ms)
- `scaleIn` - Scale up with fade (200ms)
- `scaleOut` - Scale down with fade (150ms)
- `shimmer` - Shimmer/wave effect for loading states (2000ms)
- `pulse` - Pulsing opacity effect (2000ms)
- `spin` - Continuous rotation (1000ms)
- `bounce` - Bounce effect on hover (300ms)

**Utility Classes:**
- `.animate-fade-in` - Apply fadeIn animation
- `.animate-fade-out` - Apply fadeOut animation
- `.animate-slide-up` - Apply slideUp animation
- `.animate-slide-down` - Apply slideDown animation
- `.animate-scale-in` - Apply scaleIn animation
- `.animate-pulse` - Apply pulse animation (infinite)
- `.animate-spin` - Apply spin animation (infinite)
- `.animate-shimmer` - Apply shimmer animation

## Usage

### CSS Utility Classes

Use utility classes directly on HTML elements:

```html
<div class="animate-fade-in">
  Content that fades in
</div>

<div class="animate-slide-up">
  Content that slides up
</div>
```

### React/MUI Components

Use keyframes in `sx` prop with inline styles:

```typescript
import { Box } from '@mui/material';

export function AnimatedCard() {
  return (
    <Box
      sx={{
        animation: 'slideUp 400ms ease-out',
        '@keyframes slideUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      Content
    </Box>
  );
}
```

Or use the predefined keyframes:

```typescript
<Box
  sx={{
    animation: 'slideUp 400ms ease-out',
  }}
>
  Content
</Box>
```

### Custom Transitions with Hooks

Use the `useScrollAnimation` hook for scroll-triggered animations:

```typescript
import { Box } from '@mui/material';
import { useScrollAnimation } from '@/hooks';

export function FadeInOnScroll() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 400ms ease-out',
      }}
    >
      Content that fades in when scrolled into view
    </Box>
  );
}
```

## Animation Timing

The portfolio uses consistent animation timing across all components:

| Duration | Use Case |
|----------|----------|
| 0ms | No animation (instant changes) |
| 150ms | Fast interactive elements (buttons, links) |
| 200ms | Standard transitions (cards, images) |
| 300ms | Dialogs, modals, theme transitions |
| 400ms | Scroll animations, larger transitions |
| 500ms | Page transitions, major layout changes |

These constants are defined in `v2/src/constants/app.ts` as:

```typescript
export const ANIMATION_DURATIONS = {
  INSTANT: 0,
  FAST: 150,
  STANDARD: 200,
  NORMAL: 300,
  SLOW: 400,
  VERY_SLOW: 500,
} as const;
```

## Accessibility

### Respecting User Preferences

All animations automatically respect the `prefers-reduced-motion` media query. When a user enables reduced motion in their OS settings, animations are disabled:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### In React Code

Use the `useReducedMotion()` hook to check user preferences:

```typescript
import { useReducedMotion } from '@/hooks';

export function AnimatedButton() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <button
      style={{
        transition: prefersReducedMotion
          ? 'none'
          : 'all 200ms ease-in-out',
      }}
    >
      Click me
    </button>
  );
}
```

## Browser Support

All animations use standard CSS and modern browser APIs:

- Keyframe animations: All modern browsers
- `prefers-reduced-motion`: All modern browsers (gracefully ignored in older browsers)
- `IntersectionObserver`: All modern browsers (used by `useScrollAnimation`)

## Performance Considerations

1. **Use CSS animations over JavaScript** - CSS animations are more performant
2. **Use `transform` and `opacity`** - These properties are GPU-accelerated
3. **Avoid animating `width` or `height`** - These trigger layout recalculation
4. **Keep animations short** - Standard durations (150-400ms) are optimal
5. **Respect reduced motion** - Always respect user accessibility preferences

## References

- [WCAG 2.2: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [MDN: CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [MDN: CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)
