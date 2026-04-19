# Responsive Design Guide

## Overview
The workflow designer is optimized for desktop but adapts gracefully to tablets and mobile devices.

## Breakpoints

### Desktop (> 1024px)
**Layout:** 3-column side-by-side
- Left sidebar: 220px (fixed)
- Canvas: flexible (flex: 1)
- Right panel: 360px (fixed)

```
┌─────────┬──────────────────┬──────────┐
│ Sidebar │      Canvas      │  Panel   │
│  220px  │       flex       │  360px   │
└─────────┴──────────────────┴──────────┘
```

### Tablet (768px - 1024px)
**Layout:** 3-column side-by-side (narrower)
- Left sidebar: 180px (fixed)
- Canvas: flexible (flex: 1)
- Right panel: 280px (fixed)

**Changes:**
- Reduced sidebar width for more canvas space
- Reduced form panel width
- Smaller border radius (12px instead of 18px)

```
┌──────┬──────────────────┬────────┐
│ Side │      Canvas      │ Panel  │
│ 180px│       flex       │ 280px  │
└──────┴──────────────────┴────────┘
```

### Mobile (< 768px)
**Layout:** Stacked vertical
- Mobile toolbar with toggle button
- Left sidebar (toggleable, hidden by default)
- Canvas: 60vh height
- Right panel: bottom, max 50vh height

**Changes:**
- Vertical stacking (flex-direction: column)
- Sidebar hidden by default with toggle button
- Canvas and panel scroll independently
- No border radius (full screen)
- Simplified navigation

```
┌──────────────────────────────┐
│   Mobile Toolbar (☰ Nodes)  │
├──────────────────────────────┤
│   Sidebar (if toggled on)   │
├──────────────────────────────┤
│                              │
│          Canvas              │
│          (60vh)              │
│                              │
├──────────────────────────────┤
│                              │
│       Form Panel             │
│     (scroll, max 50vh)       │
│                              │
└──────────────────────────────┘
```

### Mobile Portrait (< 480px)
**Layout:** Same as mobile but adjusted heights
- Canvas: 50vh height
- Right panel: max 60vh height

## Key Features

### 1. Collapsible Sidebar (Mobile)
```tsx
const [showSidebar, setShowSidebar] = useState(false);

// Toggle button in mobile toolbar
<button onClick={() => setShowSidebar(!showSidebar)}>
  ☰ {showSidebar ? 'Hide' : 'Show'} Nodes
</button>

// Sidebar with conditional visibility
<div className={`${styles.leftSidebar} ${showSidebar ? styles.visible : ''}`}>
  <NodeSidebar />
</div>
```

### 2. CSS Module Classes
Using CSS modules for better maintainability:
```tsx
import styles from './WorkflowEditor.module.css';

<div className={styles.workflowContainer}>
  <div className={styles.leftSidebar}>...</div>
  <div className={styles.canvasArea}>...</div>
  <div className={styles.rightPanel}>...</div>
</div>
```

### 3. Media Queries
```css
/* Tablet */
@media (max-width: 1024px) {
  .leftSidebar { width: 180px; }
  .rightPanel { width: 280px; }
}

/* Mobile */
@media (max-width: 768px) {
  .workflowContainer { flex-direction: column; }
  .leftSidebar { display: none; width: 100%; }
  .leftSidebar.visible { display: block; }
  .rightPanel { width: 100%; border-left: none; border-top: 1px solid #e5e7eb; }
}
```

## Component Adjustments

### NodeFormPanel (Mobile)
- Full width instead of fixed 360px
- Scrollable content area with max-height
- Buttons remain at bottom (sticky footer)

### Canvas Controls (Mobile)
- ReactFlow MiniMap might be hidden on very small screens
- Controls positioned for touch interaction
- Panels use smaller font sizes

### WorkflowNode (Mobile)
- Node minimum width maintained (180px)
- Touch-friendly tap targets
- Pinch-to-zoom support from ReactFlow

## Testing Responsive Layouts

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test these preset sizes:
   - Desktop: 1920x1080
   - Laptop: 1440x900
   - Tablet: 768x1024 (iPad)
   - Mobile: 375x667 (iPhone SE)
   - Mobile: 390x844 (iPhone 12)

### Responsive Testing Checklist
- [ ] Sidebar toggles on mobile
- [ ] Canvas is usable on all screen sizes
- [ ] Form panel scrolls properly
- [ ] Buttons are touch-friendly (min 44px)
- [ ] Text remains readable
- [ ] No horizontal overflow
- [ ] Drag-and-drop works on touch devices

## Migration Steps

To apply responsive design to existing WorkflowEditor:

1. **Copy CSS module**
   ```bash
   # Use WorkflowEditor.module.css
   ```

2. **Import styles in component**
   ```tsx
   import styles from './WorkflowEditor.module.css';
   ```

3. **Replace inline styles with className**
   ```tsx
   // Before
   <div style={{ display: 'flex', width: 220 }}>

   // After
   <div className={styles.leftSidebar}>
   ```

4. **Add mobile toolbar**
   ```tsx
   const [showSidebar, setShowSidebar] = useState(false);

   <div className={styles.mobileToolbar}>
     <button onClick={() => setShowSidebar(!showSidebar)}>
       ☰ {showSidebar ? 'Hide' : 'Show'} Nodes
     </button>
   </div>
   ```

5. **Update sidebar with visibility class**
   ```tsx
   <div className={`${styles.leftSidebar} ${showSidebar ? styles.visible : ''}`}>
   ```

## Performance Considerations

- CSS modules are tree-shaken and optimized by bundler
- Media queries don't impact performance
- Mobile layout reduces initial render complexity
- Collapsed sidebar saves memory on mobile

## Future Enhancements

- Modal overlay for node editing on mobile
- Swipe gestures for panel navigation
- Landscape mode optimizations
- Progressive Web App (PWA) support
