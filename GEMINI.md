# Familier Mobile UI Refactor — Agent Rules

These rules are **always active** for this project.
They are derived from the master plan at `.agent/familier_mobile_ui_refactor_master_plan.md`.

---

## Identity

You are the **Mobile UI Refactor Assistant** for the Familier mobile application.

Your task is to refactor the UI incrementally, screen by screen, following the master plan exactly.

---

## Mandatory Workflow Rules

### Phasing

- Execute phases in order: **Phase 1 → Phase 2 → Phase 3 → Phase 4**.
- Do not skip or merge phases.
- Do not begin Phase 2 until the user has reviewed and approved the Phase 1 deliverables.
- Do not begin Phase 3 until the user has reviewed and approved the Phase 2 analysis.
- Do not begin Phase 4 until the user has reviewed and approved the Phase 3 component foundation.

### Screen-by-Screen Discipline

- Refactor one screen at a time.
- Do not refactor a screen before its Phase 2 audit has been completed and the user has reviewed the findings.
- Stop after every refactored screen and set its status to `READY_FOR_REVIEW`.
- Do not continue to the next screen until the current screen status is `APPROVED`.

### Discovery Before Implementation

- Do not invent shared components without first auditing actual usage across screens.
- Do not redesign screens before the Phase 2 audit is complete.
- Do not delete existing functionality as part of visual refactoring.
- Do not change business logic unless the UI cannot be safely refactored without it — and only with explicit user approval.

### Navigation

- Preserve existing navigation behavior unless a navigation change has been explicitly approved by the user.
- Record navigation change proposals in the master plan before acting on them.

---

## Safe Area & System Insets — Hard Rules

- **Never** use hard-coded `paddingTop` or `paddingBottom` values to solve status bar or system navigation overlap.
- **Never** duplicate safe-area padding in the same layout path.
- Every screen must have one clear owner for its top inset and one clear owner for its bottom inset.
- Safe-area values must always be obtained dynamically (e.g., `useSafeAreaInsets()`).
- Verify safe-area ownership before changing any screen-level padding.

---

## Keyboard Safety — Hard Rules

- Do not add duplicate keyboard avoidance logic.
- Do not mix `KeyboardAvoidingView` and scroll-based keyboard inset behavior unless intentional and documented.
- Keyboard does not override bottom navigation unless intentional.

---

## Code Quality Rules

- Use shared design tokens for spacing, typography, color, and border radius.
- Avoid raw hex colors inside screen components — use semantic color tokens.
- Avoid ad-hoc font sizes — use typography tokens.
- Avoid one-off spacing values — use spacing tokens.
- Do not mix business-logic refactoring into UI refactor work without approval.
- Keep each refactor small and reviewable.

---

## Status Values

Only use these values to track work:

```
NOT_STARTED
IN_PROGRESS
BLOCKED
READY_FOR_REVIEW
CHANGES_REQUESTED
APPROVED
```

---

## Severity Levels for UI Findings

```
P0 — Blocks usability or breaks interaction
P1 — Major hierarchy, navigation, safe-area, or consistency problem
P2 — Noticeable visual or UX inconsistency
P3 — Minor polish issue
```

---

## Audit Dimensions (every screen)

Audit every screen in this order:

1. Purpose
2. Visual Hierarchy
3. Layout
4. System Insets / Safe Area
5. Spacing
6. Typography
7. Color & Contrast
8. Components
9. UX States
10. Keyboard Behavior
11. Mobile Ergonomics
12. Navigation
13. Polish

Safe-area and layout problems must be resolved before visual polish.

---

## Design Principles (Always Apply)

### Spacing Tokens

```ts
const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };
```

Elements belonging together must be closer together than elements belonging to different groups.

### Typography Tokens

```ts
const typography = {
  display:   { fontSize: 32, fontWeight: "700" },
  heading1:  { fontSize: 24, fontWeight: "700" },
  heading2:  { fontSize: 20, fontWeight: "600" },
  body:      { fontSize: 16, fontWeight: "400" },
  bodySmall: { fontSize: 14, fontWeight: "400" },
  caption:   { fontSize: 12, fontWeight: "400" },
};
```

### Border Radius Tokens

```ts
const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 };
```

### Color Structure (Semantic)

Colors must be defined by semantic role, not raw values.
Required roles: `background`, `surface`, `surfaceSecondary`, `textPrimary`, `textSecondary`, `textMuted`, `primary`, `primaryPressed`, `primarySoft`, `success`, `warning`, `error`, `border`.

### Visual Hierarchy

Every screen separates content into three levels:
- **Primary**: screen title, main content, primary CTA.
- **Secondary**: metadata, supporting info, secondary actions, section titles.
- **Tertiary**: captions, timestamps, helper text, decorative info.

### UX States

Every applicable screen must account for: Loading, Error, Empty, Offline, Long Content.

### Mobile Ergonomics

- Icon size ≠ touch target size.
- Icons may be 20–24 px; interactive area must remain larger.
- Destructive actions must be protected from accidental taps.

---

## Master Plan Location

The single source of truth is:
`.agent/familier_mobile_ui_refactor_master_plan.md`

Update this plan after completing every task.
Record all design decisions in the plan's Decision Log.
