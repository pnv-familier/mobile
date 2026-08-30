---
name: familier-ui-refactor
description: >-
  Use this skill when working on any phase of the Familier mobile UI refactor.
  Activate when the user asks to: discover screens, audit a screen, build the
  component library, refactor a screen, check refactor progress, or resume
  any phase of the master plan. Contains the full procedural runbook for
  executing Phases 1–4, templates, quality gates, and self-review checklists.
---

# Familier Mobile UI Refactor — Procedural Skill

The master plan is at:
`.agent/familier_mobile_ui_refactor_master_plan.md`

Read it at the start of every session. It is the single source of truth.

---

## Quick Reference: Current Phase Decision

Before doing anything, check the master plan's **Section 15 — Current Status**.

- If `NOT_STARTED` → Execute Phase 1.
- If Phase 1 `APPROVED` → Execute Phase 2.
- If Phase 2 `APPROVED` → Execute Phase 3.
- If Phase 3 `APPROVED` → Execute Phase 4.
- If any phase is `READY_FOR_REVIEW` → Stop and wait for user review. Do not proceed.
- If any screen is `CHANGES_REQUESTED` → Resolve feedback first.

---

## Phase 1 — Screen Discovery Runbook

### Step 1.1 — Locate Feature Folders

```
features/          → main feature modules
components/        → shared UI components
navigation/        → navigation setup
theme/             → tokens / theme
hooks/             → shared hooks
store/             → state management
utils/             → shared utilities
```

List every folder. Record in the master plan under **Phase 1 — 4.1**.

### Step 1.2 — Enumerate Screens

For each feature folder, walk recursively and identify every screen/page/view.

For each screen record:

| Field | How to Find |
|---|---|
| Feature | Parent feature folder name |
| File path | Relative path from project root |
| Route | Check navigation folder for route definition |
| Reachable | Can it be reached from current navigation? |
| Input | Does it have TextInput / form fields? |
| Safe Area | Does it use SafeAreaView / useSafeAreaInsets? |
| Keyboard | Does it use KeyboardAvoidingView / scrollKeyboardDismiss? |
| Status | `NOT_STARTED` |

### Step 1.3 — Enumerate Shared UI

Walk `components/`, `theme/`, and any other shared folders.

Record:
- Component name, file path, what screens use it, duplicate risk.

### Step 1.4 — Map System Layout Infrastructure

Search for:

```bash
SafeAreaProvider     → likely in App.tsx or root layout
SafeAreaView         → grep across screens
useSafeAreaInsets    → grep across screens
StatusBar            → grep across screens
KeyboardAvoidingView → grep across screens
paddingTop           → look for hard-coded hacks
paddingBottom        → look for hard-coded hacks
```

Record findings in the System Layout Inventory table.

### Step 1.5 — Deliver Phase 1

- Fill in Screen Inventory table.
- Fill in Shared UI Inventory table.
- Fill in System Layout Inventory table.
- Set Phase 1 Status to `READY_FOR_REVIEW`.
- Present to user and stop. Do not proceed to Phase 2 until approved.

---

## Phase 2 — Screen Audit Runbook

### For Each Screen:

1. Re-read the Screen Inventory entry.
2. Open the screen file and read the full component.
3. Follow the audit order:
   - Purpose → Visual Hierarchy → Layout → Safe Area → Spacing → Typography → Color → Contrast → Border Radius → Component Consistency → UX States → Keyboard → Bottom Nav → Modals → Ergonomics → Navigation → Polish
4. Fill in the Screen Audit Template (Section 5.2 of the master plan) for this screen.
5. Record all findings with severity (P0/P1/P2/P3).
6. Write the Proposed Refactor Summary (Must Change / Should Change / Nice to Have / Must Not Change).
7. After all screens: Update Phase 2 Summary Table.
8. Set Phase 2 Status to `READY_FOR_REVIEW`.
9. Present to user. Stop. Do not implement anything.

### Safe-Area Audit Checklist

For each screen:
- [ ] Who owns the top inset?
- [ ] Who owns the bottom inset?
- [ ] Are there any hard-coded `paddingTop` hacks?
- [ ] Are there any hard-coded `paddingBottom` hacks?
- [ ] Is safe-area duplicated anywhere in the layout path?

### Keyboard Audit Checklist

For each screen with inputs:
- [ ] Is a keyboard avoidance mechanism present?
- [ ] Which mechanism is used?
- [ ] Is there a risk of double adjustment?

---

## Phase 3 — Component Library Runbook

### Step 3.1 — Token Foundation

Define final token files (or confirm existing ones):

1. Spacing tokens
2. Typography tokens
3. Color tokens (semantic)
4. Border radius tokens
5. Elevation / shadow tokens

Map existing ad-hoc values to tokens. Document exceptions.

### Step 3.2 — System Layout Foundation

1. Confirm `SafeAreaProvider` root location.
2. Define safe-area ownership strategy (who handles top, who handles bottom, when to use `SafeAreaView` vs `useSafeAreaInsets`).
3. Define `ScreenContainer` spec.
4. Define keyboard strategy (form mode, chat mode, modal mode).
5. Define `StatusBar` strategy.

### Step 3.3 — Primitive Components

For each candidate component in the master plan Section 6.4:

1. Find every existing implementation in the codebase.
2. Compare visual differences.
3. Compare behavior and props.
4. Identify common states and variants.
5. Fill in Component Specification Template (Section 6.5 of master plan).
6. Decide: shared library or screen-local.

Do not implement until the user approves the specification.

### Step 3.4 — Deliver Phase 3

- Update Component Library Tracking Table.
- Set Phase 3 Status to `READY_FOR_REVIEW`.
- Present to user. Stop. Do not implement until approved.

---

## Phase 4 — Screen Refactor Runbook

### Before Starting Any Screen

1. Re-read the approved Phase 2 audit for this screen.
2. Confirm all required shared components are implemented.
3. Confirm all required tokens exist.
4. Confirm safe-area owner.
5. Confirm keyboard strategy.
6. Record current screen behavior (note what must not change).

### Refactor Execution Order

For each screen:

A. **Layout & Hierarchy** — Fix structure first.
B. **Safe Area** — Verify inset ownership. Remove hard-coded offsets.
C. **Status Bar** — Configure correct style.
D. **Spacing** — Replace arbitrary values with tokens.
E. **Typography** — Replace ad-hoc styles with tokens.
F. **Color** — Replace raw colors with semantic tokens.
G. **Radius & Surfaces** — Normalize cards, borders, shadows.
H. **Shared Components** — Replace local implementations.
I. **UX States** — Loading, Error, Empty, Offline, Long Content.
J. **Keyboard Safety** — Verify inputs stay visible.
K. **Bottom Navigation** — Verify tab bar clearance.
L. **Modal / Bottom Sheet** — Verify insets.
M. **Ergonomics** — Touch targets, spacing between controls.
N. **Navigation** — Preserve behavior (or apply approved changes only).

### Agent Self-Review (Before Requesting User Review)

- [ ] Compare implementation against Phase 2 findings.
- [ ] Verify safe-area ownership is explicit.
- [ ] Verify keyboard ownership is explicit.
- [ ] Check for accidental business-logic changes.
- [ ] Check for duplicated styles.
- [ ] Check for newly introduced inconsistencies.
- [ ] Update master plan with implementation notes.

### After Self-Review

Set screen status to `READY_FOR_REVIEW`.

Ask the user:
1. Does the hierarchy feel correct?
2. Does the screen still feel like Familier?
3. Is anything visually too strong or too weak?
4. Are any components inconsistent with the rest of the app?
5. Is any existing functionality missing or harder to use?
6. Is any content still too close to system UI?
7. Does keyboard behavior feel correct?
8. Does bottom navigation feel safe and comfortable?

**Stop. Wait for user decision. Do not continue to the next screen.**

---

## Definition of Done — One Screen

A screen is `APPROVED` only when **all** are true:

- Refactor matches the approved audit.
- Visual hierarchy is clear.
- Safe-area ownership is explicit.
- No hard-coded system inset hacks.
- No duplicate safe-area padding.
- Keyboard does not hide important content.
- All tokens applied (spacing, typography, color, radius).
- Shared components reused appropriately.
- Loading, Error, Empty states handled.
- Touch targets acceptable.
- Navigation still works.
- Business behavior unchanged unless explicitly approved.
- User has reviewed and marked `APPROVED`.

---

## References

- Master Plan: [`.agent/familier_mobile_ui_refactor_master_plan.md`](./../familier_mobile_ui_refactor_master_plan.md)
- Screen Audit Template: Master plan Section 5.2
- Component Spec Template: Master plan Section 6.5
- Screen Refactor Task Template: Master plan Section 8
- Progress Board: Master plan Section 9
- Decision Log: Master plan Section 10
- Technical Debt Log: Master plan Section 11
