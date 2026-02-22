# UI/UX Improvement Recommendations

## Priority Action Items

### HIGH IMPACT (Implement First)

1. **Touch Target Compliance** - Ensure all buttons/links are 44x44px minimum
2. **Focus States** - Add visible keyboard navigation indicators
3. **Loading States** - Implement skeleton screens for better perceived performance
4. **Mobile Bottom Sheet** - Improve native-feeling bottom sheet
5. **Color Contrast** - Verify all text meets WCAG AA in dark theme

### MEDIUM IMPACT

6. **Micro-interactions** - Add hover states and smooth transitions
7. **Progressive Image Loading** - Lazy load with blur-up effect
8. **Filter UX** - Show active filter count, quick clear
9. **Error States** - Friendly empty and error state designs

---

## Specific Improvements

### 1. Card Hover Pattern
```css
/* Add to globals.css */
.card-interactive {
  @apply transition-all duration-300 ease-out;
  transform-origin: center;
}

.card-interactive:hover {
  @apply -translate-y-1;
  box-shadow: 0 20px 60px -10px rgba(251, 191, 36, 0.15);
}

.card-interactive:active {
  @apply translate-y-0;
  transition-duration: 100ms;
}
```

### 2. Motion Design Tokens
```css
:root {
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;

  --ease-out: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 3. Touch Target Standards
All interactive elements must be minimum 44x44px:
```tsx
className="min-w-[44px] min-h-[44px]"
```

### 4. Focus States for Keyboard Navigation
```tsx
className="
  focus:outline-none
  focus-visible:ring-4 focus-visible:ring-amber-500/50
  focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
"
```

### 5. Skeleton Loading States
```tsx
<div className="h-6 bg-gray-800 rounded animate-pulse w-3/4" />
```

### 6. Empty State Component
```tsx
<EmptyState
  icon={SearchIcon}
  title="No restaurants found"
  description="Try adjusting your filters"
  action={{ label: "Clear filters", onClick: clearFilters }}
/>
```

---

## Dark Theme Color Palette (WCAG AAA)

```css
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #2a2a2a;

  --text-primary: #ffffff;     /* 21:1 contrast */
  --text-secondary: #d1d5db;   /* 12:1 contrast */
  --text-tertiary: #9ca3af;    /* 7:1 contrast */

  --accent-primary: #fbbf24;   /* Amber 400 */
  --border-default: #374151;
  --border-focus: #fbbf24;
}
```

---

## Testing Checklist

### Mobile
- [ ] Touch targets 44px minimum
- [ ] Bottom sheet swipeable
- [ ] No horizontal scroll

### Keyboard
- [ ] All elements focusable
- [ ] Focus indicators visible
- [ ] Escape closes modals

### Performance
- [ ] Images lazy loaded
- [ ] No layout shift
