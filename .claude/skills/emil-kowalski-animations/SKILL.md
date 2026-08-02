---
name: emil-kowalski-animations
description: "Emil Kowalski's animation and interaction philosophy for web interfaces. Purposeful motion, strict timing, Framer Motion best practices."
---

# Emil Kowalski Animation Guidelines

This skill enforces the UI animation principles developed by Emil Kowalski (animations.dev). Apply these rules whenever designing interactive components, loading states, or page transitions.

## 1. Core Philosophy: "Invisible Motion"
- **Purpose over Decoration**: Never animate just for the sake of it. If an animation doesn't help the user understand the interface state (like where a menu came from, or that a task is loading), remove it.
- **Fast and Snappy**: UI animations should be felt, not waited for. 
- **Restraint**: High-frequency interactions (like buttons clicked dozens of times a day) should have instantaneous or near-instantaneous feedback.

## 2. Timing and Duration
- **Micro-interactions** (Hovers, Toggles, Checkboxes): `150ms` to `200ms`.
- **Medium Transitions** (Dropdowns, Tooltips, Modals): `200ms` to `300ms`.
- **Large Page Transitions** (Layout shifts, full views): `300ms` to `400ms`.
- **CRITICAL**: Never exceed `500ms` for standard UI transitions unless it's a dramatic splash screen.

## 3. Easing (The Physics of UI)
- **Entering the screen (Ease-Out)**: Elements entering should decelerate. They come in fast and slow down as they reach their final position.
  - CSS: `cubic-bezier(0.16, 1, 0.3, 1)` or standard `ease-out`.
- **Exiting the screen (Ease-In)**: Elements leaving should accelerate. They start slow and speed up as they leave.
  - CSS: `cubic-bezier(0.4, 0, 1, 1)` or standard `ease-in`.
- **State Changes (Ease-in-out)**: For color changes or position swaps.

## 4. Framer Motion Best Practices
- **Springs over Tweens**: Whenever possible in `framer-motion`, use `type: "spring"` instead of `type: "tween"`. Springs feel more natural and handle interruptions gracefully.
  - Example good spring: `{ type: "spring", stiffness: 400, damping: 30 }`
- **Layout Animations**: Use `layoutId` for seamless transitions of identical elements across different states or components (e.g., active tabs).
- **Animate Presence**: Use `<AnimatePresence>` to safely animate components out of the React tree.

## 5. What NOT to Animate
- **Layout-shifting hovers**: Never use `scale: 1.05` on hover if it pushes adjacent elements. Use `transform` correctly without affecting document flow, or use box-shadows/borders instead.
- **Text content swapping**: Fading text in and out is often better than trying to slide it, which causes jitter.

## Pre-Delivery Animation Checklist
- [ ] Are all hover states under 200ms?
- [ ] Is `prefers-reduced-motion` respected for heavy animations?
- [ ] Do modals have a slight scale-up (`0.95` -> `1`) and fade-in instead of dramatic sliding?
- [ ] Are we using springs for physical feeling elements (drawers, drags)?
