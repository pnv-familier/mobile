# Familier Mobile UI Refactor — Master Plan

## 0. Purpose

This document is the single source of truth for refactoring the Familier mobile application's UI in a controlled, reviewable, and incremental way.

The objective is not to redesign the entire application at once. The objective is to:

- discover every existing screen,
- analyze problems systematically,
- define a reusable design foundation,
- build a component library based on real usage,
- refactor screen by screen,
- preserve business behavior,
- track progress and quality,
- validate mobile system insets and device safety,
- require human review after each screen before continuing.

The agent must follow this plan sequentially and must not skip phases.

---

# 1. Core Design Principles

These rules apply to every audit, component decision, screen refactor, and review.

---

## 1.1 Visual Hierarchy

Every screen should clearly separate information into three levels.

### Primary
- Screen title
- Main content
- Primary CTA

### Secondary
- Metadata
- Supporting information
- Secondary actions
- Section titles

### Tertiary
- Captions
- Timestamps
- Helper text
- Decorative information

### Validation Checklist
- [ ] The most important content is visually obvious.
- [ ] There is only one clearly dominant CTA when appropriate.
- [ ] Secondary actions are less prominent than the primary action.
- [ ] Metadata and helper text are visually quieter.
- [ ] The screen does not contain unnecessary visual competition.
- [ ] Important actions do not compete with decorative elements.

---

## 1.2 Spacing System

Spacing must be token-based and consistent.

Recommended baseline:

```ts
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};
```

Core rule:

> Elements belonging together should be closer together than elements belonging to different groups.

### Validation Checklist
- [ ] The screen uses shared spacing tokens.
- [ ] Related elements are grouped visually.
- [ ] Section gaps are larger than internal component gaps.
- [ ] Screen horizontal padding is consistent.
- [ ] Arbitrary one-off spacing values are minimized.
- [ ] Padding and margin usage has clear ownership.

---

## 1.3 Typography System

Typography should use predefined semantic tokens instead of ad-hoc font sizes and weights.

Recommended baseline:

```ts
const typography = {
  display: {
    fontSize: 32,
    fontWeight: "700",
  },
  heading1: {
    fontSize: 24,
    fontWeight: "700",
  },
  heading2: {
    fontSize: 20,
    fontWeight: "600",
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
  },
};
```

### Validation Checklist
- [ ] The screen uses typography tokens.
- [ ] Title hierarchy is clear.
- [ ] Body and caption styles are consistent.
- [ ] Arbitrary font sizes are avoided.
- [ ] Excessive bold text is avoided.
- [ ] Long text wraps safely.
- [ ] Dynamic content does not break layout.

---

## 1.4 Semantic Color System

Colors must be defined by semantic role instead of raw values scattered across screens.

Recommended structure:

```ts
const colors = {
  background: "#...",
  surface: "#...",
  surfaceSecondary: "#...",

  textPrimary: "#...",
  textSecondary: "#...",
  textMuted: "#...",

  primary: "#...",
  primaryPressed: "#...",
  primarySoft: "#...",

  success: "#...",
  warning: "#...",
  error: "#...",

  border: "#...",
};
```

### Validation Checklist
- [ ] Raw hex values are avoided inside screen components.
- [ ] Color communicates meaning rather than decoration.
- [ ] Brand color is reserved for emphasis.
- [ ] Text contrast levels are readable.
- [ ] Success, warning, and error states are semantically consistent.
- [ ] Disabled colors are distinguishable without becoming unreadable.

---

## 1.5 Contrast

Contrast should be created using:

- size,
- font weight,
- color,
- whitespace,
- shape,
- elevation.

### Validation Checklist
- [ ] The primary action is visually dominant.
- [ ] Secondary and tertiary controls have reduced emphasis.
- [ ] Borders and shadows are used only when they add structure.
- [ ] The screen remains understandable without relying only on color.
- [ ] Important states remain visible under different screen brightness conditions.

---

## 1.6 Border Radius System

Recommended baseline:

```ts
const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};
```

### Validation Checklist
- [ ] Radius values are token-based.
- [ ] Similar components use the same radius.
- [ ] Excessive rounded containers are avoided.
- [ ] Pill shapes are used only where appropriate.
- [ ] Nested rounded containers are minimized.

---

## 1.7 Component Consistency

The application should progressively converge on reusable primitives such as:

```text
Text
Button
IconButton
Avatar
Card
Input
Chip
Divider
BottomSheet
Modal
Section
ListItem
EmptyState
Skeleton
ScreenContainer
SafeAreaLayout
KeyboardAwareContainer
```

### Validation Checklist
- [ ] Existing primitives are reused instead of duplicating styles.
- [ ] Components support the states required by current screens.
- [ ] Variants are explicit and semantic.
- [ ] Reusable behavior is extracted without over-engineering.
- [ ] Screen-specific UI remains screen-specific where appropriate.
- [ ] Shared components do not contain unrelated business logic.

---

## 1.8 UX States

Every applicable screen must account for:

- Loading
- Error
- Empty
- Offline
- Long content

Additional states should be documented when discovered.

### Validation Checklist
- [ ] Loading state is defined.
- [ ] Error state is defined.
- [ ] Empty state is defined when applicable.
- [ ] Offline or failed-network behavior is defined.
- [ ] Long text/content remains usable and readable.
- [ ] Retry or recovery actions exist where needed.
- [ ] Partial-data states are handled where applicable.

---

## 1.9 Mobile Ergonomics

### Rules
- Icon size and touch target are not the same thing.
- Icons may be 20–24 px while the interactive area remains larger.
- Primary actions should be easy to reach and tap.
- Important controls must not be visually or physically cramped.
- Destructive actions must not be easy to trigger accidentally.

### Validation Checklist
- [ ] Interactive targets are large enough.
- [ ] Spacing between touch targets is sufficient.
- [ ] Destructive controls are protected from accidental taps.
- [ ] Primary actions are placed in practical mobile locations.
- [ ] Gesture conflicts are minimized.

---

## 1.10 System Insets & Device Safety

This is a foundational mobile layout rule.

Every screen must explicitly know who owns its top and bottom system insets.

Never solve system overlap using arbitrary `paddingTop` or `paddingBottom` values.

### Areas to Respect
- Status bar
- Notch
- Camera cutout
- Dynamic Island
- Android system navigation
- Home indicator
- Left/right safe areas
- Keyboard
- Bottom tab
- Modal
- Bottom sheet

### Architecture Rule

> Each inset should have one clear owner in a layout path.

Possible owners:

- navigation container,
- screen container,
- custom header,
- bottom tab,
- modal,
- bottom sheet.

Avoid duplicate safe-area padding.

### Safe Area Validation Checklist
- [ ] Content is not covered by the status bar.
- [ ] Content is not covered by a notch or camera cutout.
- [ ] Bottom content is not covered by the system navigation area.
- [ ] Home indicator does not overlap interactive elements.
- [ ] Left/right insets are respected where required.
- [ ] Safe-area values are obtained dynamically.
- [ ] No hard-coded status-bar offset exists.
- [ ] No hard-coded bottom-system offset exists.
- [ ] No duplicate safe-area padding exists.
- [ ] Background edge-to-edge behavior is intentional.

---

## 1.11 Status Bar

Safe area manages layout position.

Status bar configuration manages appearance.

### Validation Checklist
- [ ] Status bar style matches the screen background.
- [ ] Status bar icons remain readable.
- [ ] Light background uses readable dark system content where appropriate.
- [ ] Dark background uses readable light system content where appropriate.
- [ ] Edge-to-edge status bar behavior is intentional.
- [ ] Full-screen screens explicitly define status bar behavior.

---

## 1.12 Bottom Navigation Safety

Bottom navigation must account for system bottom insets.

### Validation Checklist
- [ ] Bottom tab respects bottom safe-area inset.
- [ ] Scroll content can reach above the bottom tab.
- [ ] Floating actions are not covered by the tab bar.
- [ ] Floating actions are not covered by system navigation.
- [ ] Bottom padding is not duplicated by navigation and screen.
- [ ] Custom tab bar height accounts for safe area correctly.

---

## 1.13 Keyboard Safety

Any screen with input must consider the keyboard as a dynamic system inset.

Important Familier screen types:

- AI Chat
- Voice Chat
- Forms
- Search
- Comments
- Messaging
- Editing screens

### Validation Checklist
- [ ] Focused input remains visible.
- [ ] Primary form action remains accessible.
- [ ] Chat composer remains visible.
- [ ] Scrollable forms can reach focused inputs.
- [ ] Keyboard dismissal behavior is usable.
- [ ] Keyboard does not overlap bottom navigation incorrectly.
- [ ] Keyboard does not create excessive double bottom padding.
- [ ] Long forms remain usable on small screens.

---

## 1.14 Modal & Bottom Sheet Safety

### Validation Checklist
- [ ] Modal content respects relevant system insets.
- [ ] Bottom-sheet actions remain above the home indicator/navigation bar.
- [ ] Full-screen modal status bar behavior is intentional.
- [ ] Keyboard interaction inside modal/bottom sheet is usable.
- [ ] Bottom sheet does not double-apply bottom safe area.
- [ ] Drag handle and top spacing remain accessible.

---

## 1.15 Navigation Architecture

Rules:

- Not every feature belongs in the bottom tab.
- Bottom navigation should contain the most frequently used destinations.
- Navigation should reflect the user's mental model, not the source-code folder structure.

### Validation Checklist
- [ ] The destination is important enough for the current navigation level.
- [ ] Related screens are grouped logically.
- [ ] Rarely used screens remain outside primary navigation.
- [ ] Navigation is understandable without knowing the application architecture.
- [ ] Back behavior is predictable.
- [ ] Modal versus stack navigation usage is intentional.

---

# 2. Audit Mental Model

Every screen should be audited in this order:

```text
1. Purpose
      ↓
2. Visual Hierarchy
      ↓
3. Layout
      ↓
4. System Insets / Safe Area
      ↓
5. Spacing
      ↓
6. Typography
      ↓
7. Color & Contrast
      ↓
8. Components
      ↓
9. UX States
      ↓
10. Mobile Ergonomics
      ↓
11. Navigation
      ↓
12. Polish
```

Safe-area and layout problems must be solved before visual polish.

---

# 3. Workflow Rules for the Agent

The agent must follow these rules throughout the refactor.

## 3.1 General Execution Rules

- [ ] Do not refactor all screens at once.
- [ ] Do not redesign screens before completing discovery and analysis.
- [ ] Do not invent a new component library without checking current screen usage.
- [ ] Do not delete existing functionality as part of visual refactoring.
- [ ] Do not change business logic unless the UI cannot be safely refactored without it.
- [ ] Preserve existing navigation behavior unless navigation changes are explicitly approved.
- [ ] Keep refactor changes small and reviewable.
- [ ] Update this plan after completing every task.
- [ ] Record important design decisions in this document.
- [ ] Stop after each refactored screen and request user review.
- [ ] Do not continue to the next screen until the current screen is approved or feedback is resolved.
- [ ] Do not use hard-coded safe-area offsets to fix overlap.
- [ ] Verify safe-area ownership before changing screen padding.
- [ ] Do not add duplicate keyboard avoidance logic.
- [ ] Do not mix business-logic refactoring into UI refactor work without approval.

---

## 3.2 Required Status Values

Use only these values:

```text
NOT_STARTED
IN_PROGRESS
BLOCKED
READY_FOR_REVIEW
CHANGES_REQUESTED
APPROVED
```

---

## 3.3 Severity Levels for UI Findings

Use:

```text
P0 - Blocks usability or breaks interaction
P1 - Major hierarchy, navigation, safe-area, or consistency problem
P2 - Noticeable visual or UX inconsistency
P3 - Minor polish issue
```

Examples:

- content hidden behind status bar → P1
- primary CTA covered by keyboard → P0 or P1 depending on usability
- inconsistent card radius → P2
- minor icon alignment issue → P3

---

# 4. Phase 1 — Screen Discovery

## Goal

Inspect the project folder structure feature by feature and create a complete inventory of all screens.

No visual refactoring should happen in this phase.

---

## 4.1 Discover Feature Folders

- [ ] Locate the main feature/modules directory.
- [ ] List every feature folder.
- [ ] Identify shared/common folders.
- [ ] Identify navigation-related folders.
- [ ] Identify layout wrappers.
- [ ] Identify root app/provider files.
- [ ] Identify safe-area provider usage.
- [ ] Identify status-bar configuration.
- [ ] Identify keyboard-management utilities.
- [ ] Identify any legacy or duplicate feature folders.

---

## 4.2 Discover Screens

For every feature:

- [ ] Inspect files recursively.
- [ ] Identify every screen/page/view component.
- [ ] Record screen file path.
- [ ] Record navigation route if available.
- [ ] Record parent feature.
- [ ] Record whether screen is currently reachable.
- [ ] Record whether screen is active, legacy, experimental, or unknown.
- [ ] Record major dependencies used by the screen.
- [ ] Record whether it has inputs.
- [ ] Record whether it has a custom header.
- [ ] Record whether it uses bottom tabs.
- [ ] Record whether it uses modal/bottom sheet.
- [ ] Record current safe-area handling.
- [ ] Record current keyboard handling.

---

## 4.3 Discover Shared UI

- [ ] Identify shared UI components already in the project.
- [ ] Identify duplicate components with similar purpose.
- [ ] Identify common style files/themes/tokens.
- [ ] Identify raw color constants.
- [ ] Identify raw spacing constants.
- [ ] Identify typography abstractions.
- [ ] Identify modal components.
- [ ] Identify bottom-sheet components.
- [ ] Identify button components.
- [ ] Identify input components.
- [ ] Identify card components.
- [ ] Identify text components.
- [ ] Identify screen wrappers.
- [ ] Identify safe-area wrappers.
- [ ] Identify keyboard-aware wrappers.

---

## 4.4 Discover Mobile System Handling

- [ ] Locate `SafeAreaProvider` or equivalent.
- [ ] Locate `SafeAreaView` usage.
- [ ] Locate `useSafeAreaInsets` usage.
- [ ] Locate `StatusBar` configuration.
- [ ] Locate custom top padding hacks.
- [ ] Locate custom bottom padding hacks.
- [ ] Locate custom bottom-tab height logic.
- [ ] Locate keyboard avoidance logic.
- [ ] Locate `KeyboardAvoidingView` usage.
- [ ] Locate scroll view keyboard inset behavior.
- [ ] Locate modal safe-area handling.
- [ ] Locate bottom-sheet inset handling.

---

## Phase 1 Deliverable

### Screen Inventory

| ID | Feature | Screen | File Path | Route | Reachable | Input | Safe Area | Keyboard | Status |
|---|---|---|---|---|---|---|---|---|---|
| SCR-001 | auth | LoginScreen | `features/auth/screens/LoginScreen.tsx` | `Login` | Yes | Yes | SafeAreaView (direct) | None | NOT_STARTED |
| SCR-002 | auth | RegisterScreen | `features/auth/screens/RegisterScreen.tsx` | `Register` | Yes | Yes | None | KeyboardAvoidingView | NOT_STARTED |
| SCR-003 | auth | VersionScreen | `features/auth/screens/VersionScreen.tsx` | `Version` | Yes | No | None | None | NOT_STARTED |
| SCR-004 | user | SetupProfileScreen | `features/user/screen/SetupProfileScreen.tsx` | `SetupProfile` | Yes | Yes | None | None found | NOT_STARTED |
| SCR-005 | family | FamilyStatusScreen | `features/family/screens/FamilyStatusScreen.tsx` | `FamilyStatus` | Yes | No | SafeAreaView (direct) | None | NOT_STARTED |
| SCR-006 | family | CreateFamilyScreen | `features/family/screens/CreateFamilyScreen.tsx` | `CreateFamily` | Yes | Yes | SafeAreaView (direct) | None found | NOT_STARTED |
| SCR-007 | family | InviteMembersScreen | `features/family/screens/InviteMembersScreen.tsx` | `InviteMembers` | Yes | No | SafeAreaView (direct) | None | NOT_STARTED |
| SCR-008 | family | JoinFamilyScreen | `features/family/screens/JoinFamilyScreen.tsx` | `JoinFamily` | Yes | Yes | None | None found | NOT_STARTED |
| SCR-009 | family/social | ViewListFamilyScreen | `features/family/screens/ViewListFamilyScreen.tsx` | `ViewListFamily` (SocialNavigator) | Yes | No | SafeAreaView (direct) | None | NOT_STARTED |
| SCR-010 | social | FeedScreen | `features/social/screens/FeedScreen.tsx` | `FeedScreen` (Home tab) | Yes | Yes (comments) | SafeAreaView (direct) | KeyboardAvoidingView (inline) | NOT_STARTED |
| SCR-011 | chat | ChatScreen | `features/chat/screens/ChatScreen.tsx` | `ChatScreen` (Chat tab) / `Chat` (SocialNav) | Yes (dual route) | Yes | SafeAreaView (direct) | KeyboardAvoidingView | NOT_STARTED |
| SCR-012 | schedule | FamilySchedule | `features/schedule/screens/FamilySchedule.tsx` | `FamilySchedule` | Yes | No | SafeAreaView (direct) | None | NOT_STARTED |
| SCR-013 | schedule/suggestion | CreateEventScreen | `features/schedule/screens/CreateEventScreen.tsx` | `CreateEvent` / `SuggestionCreateEvent` | Yes (dual route) | Yes | SafeAreaView (direct) | None found | NOT_STARTED |
| SCR-014 | lovetask | LoveTasksScreen | `features/lovetask/screens/LoveTasksScreen.tsx` | `LoveTasks` | Yes | No | SafeAreaView (direct) | None | NOT_STARTED |
| SCR-015 | lovetask | TaskDetailScreen | `features/lovetask/screens/TaskDetailScreen.tsx` | `TaskDetail` | Yes | No | SafeAreaView (direct, multiple) | None | NOT_STARTED |
| SCR-016 | lovetask/suggestion | CreateLoveTaskScreen | `features/lovetask/screens/CreateLoveTaskScreen.tsx` | `CreateLoveTask` / `SuggestionCreateLoveTask` | Yes (dual route) | Yes | SafeAreaView (direct) | KeyboardAvoidingView | NOT_STARTED |
| SCR-017 | suggestion | SuggestionsScreen | `features/suggestion/screens/SuggestionsScreen.tsx` | `SuggestionList` | Yes | No | None | None | NOT_STARTED |
| SCR-018 | suggestion | SuggestionDetailScreen | `features/suggestion/screens/SuggestionDetailScreen.tsx` | `SuggestionDetail` | Yes | No | SafeAreaView (direct, multiple) | None | NOT_STARTED |

### Shared UI Inventory

| ID | Component | File Path | Used By | Duplicate Risk | Notes |
|---|---|---|---|---|---|
| CMP-001 | AppButton | `components/AppButton.tsx` | Sparse — most screens use TouchableOpacity directly | HIGH | Rarely adopted |
| CMP-002 | AppError | `components/AppError.tsx` | Unknown | LOW | Small error display |
| CMP-003 | AppHeader | `components/AppHeader.tsx` | Some screens | MEDIUM | Most screens build headers inline |
| CMP-004 | AppInput | `components/AppInput.tsx` | Sparse — most screens use TextInput directly | HIGH | Rarely adopted |
| CMP-005 | AppLoader | `components/AppLoader.tsx` | Some screens | LOW | Loading spinner |
| CMP-006 | AppScreen | `components/AppScreen.tsx` | Very sparse — most screens use SafeAreaView directly | HIGH | Wraps SafeAreaView + KAV, mostly ignored |
| CMP-007 | AppText | `components/AppText.tsx` | Very sparse — most screens use Text directly | HIGH | Rarely adopted |
| CMP-008 | InAppNotificationBanner | `components/InAppNotificationBanner.tsx` | RootNavigator | LOW | Overlay notification banner |

### System Layout Inventory

| ID | Area | File Path | Current Owner | Risk | Notes |
|---|---|---|---|---|---|
| SYS-001 | Safe Area Provider | ❌ NOT FOUND | Nobody | CRITICAL | No SafeAreaProvider anywhere. SafeAreaView used without it. |
| SYS-002 | SafeAreaView | 14 of 18 screen files | Each screen independently | HIGH | No centralized strategy. Per-screen ownership, no shared wrapper adoption. |
| SYS-003 | useSafeAreaInsets | ❌ NOT FOUND | Nobody | HIGH | Never used. No dynamic inset access anywhere. |
| SYS-004 | StatusBar | ❌ NOT CONFIGURED | Nobody | MEDIUM | No StatusBar configuration on any screen. Style undefined. |
| SYS-005 | Bottom Tab Insets | `navigation/TabNavigator.tsx` | React Navigation default | MEDIUM | Default tab bar behavior. No explicit safe area accounting verified. |
| SYS-006 | KeyboardAvoidingView | `components/AppScreen.tsx`, `features/auth/screens/RegisterScreen.tsx`, `features/chat/screens/ChatScreen.tsx`, `features/lovetask/screens/CreateLoveTaskScreen.tsx`, `features/social/screens/FeedScreen.tsx`, `features/social/components/CreatePostModal.tsx` | Each file independently | HIGH | No unified strategy. Risk of double-avoidance if AppScreen is combined with screen-level KAV. |
| SYS-007 | Hard-coded paddingTop | `VersionScreen`, `ChatScreen`, `CreateFamilyScreen` (×3), `FamilyStatusScreen`, `InviteMembersScreen`, `ViewListFamilyScreen`, `CreateLoveTaskScreen`, `NotificationPopup`, `SuggestionDetailScreen` | Individual screens | HIGH | Values: 10, 20, 30, 35, 50, 80. Likely offsetting status bar or header manually. |
| SYS-008 | Hard-coded paddingBottom | `ChatScreen` (×3), `ChatSidebar`, `CreateFamilyScreen`, `FamilyStatusScreen`, `JoinFamilyScreen`, `ViewListFamilyScreen` (×3), `CreateLoveTaskScreen` (×2), `LoveTasksScreen` (100!), `TaskDetailScreen` (×2), `CreateEventScreen`, `FamilySchedule` (×2), `FeedScreen`, `SuggestionDetailScreen` (×2), `SuggestionsScreen`, `SetupProfileScreen` (80) | Individual screens | CRITICAL | paddingBottom:100 in LoveTasksScreen is a tab-bar hack. paddingBottom:80 in SetupProfileScreen is suspicious. |

---

## Phase 1 Completion Criteria

- [ ] Every feature folder has been inspected.
- [ ] Every screen has an inventory entry.
- [ ] Every known route has been mapped.
- [ ] Shared UI has been inventoried.
- [ ] Safe-area and keyboard infrastructure has been inventoried.
- [ ] No screen has been visually refactored yet.
- [x] User has reviewed the discovered inventory.

### Phase 1 Status

`APPROVED`

---

# 5. Phase 2 — Screen-by-Screen UI Analysis

## Goal

Analyze every discovered screen and mark all issues that should be updated.

No implementation should begin until the analysis for that screen is documented.

---

## 5.1 Audit Dimensions

Each screen must be reviewed against:

1. Purpose
2. Visual hierarchy
3. Layout
4. System insets / safe area
5. Spacing
6. Typography
7. Color
8. Contrast
9. Border radius
10. Component consistency
11. UX states
12. Keyboard behavior
13. Mobile ergonomics
14. Navigation role
15. Polish

---

## 5.2 Screen Audit Template

Copy this section for every screen.

### Screen Audit — `[SCR-ID] [Screen Name]`

**Feature:**  
**File:**  
**Route:**  
**Current Status:** `NOT_STARTED`

---

### A. Purpose

- Primary user goal:
- Primary CTA:
- Secondary actions:
- Screen success condition:

---

### B. Visual Hierarchy

- Findings:
- Severity:
- Suggested update:

Checklist:
- [ ] Primary content is obvious.
- [ ] Primary CTA is obvious.
- [ ] Secondary content has lower emphasis.
- [ ] Tertiary information is visually quiet.

---

### C. Layout

- Findings:
- Severity:
- Suggested update:

Checklist:
- [ ] Layout structure is understandable.
- [ ] Content groups are logically separated.
- [ ] Nested containers are justified.
- [ ] Screen is usable on small heights.
- [ ] Scroll ownership is clear.

---

### D. System Insets & Safe Area

Current owner of top inset:
Current owner of bottom inset:

- Findings:
- Severity:
- Suggested update:

Checklist:
- [ ] Status bar does not cover content.
- [ ] Notch/cutout does not cover content.
- [ ] Bottom system area does not cover content.
- [ ] Home indicator does not overlap controls.
- [ ] Left/right inset behavior is correct.
- [ ] No hard-coded system offset exists.
- [ ] No duplicate safe-area padding exists.
- [ ] Edge-to-edge background behavior is intentional.

---

### E. Status Bar

- Current behavior:
- Suggested behavior:

Checklist:
- [ ] Status bar content is readable.
- [ ] Status bar style matches background.
- [ ] Full-screen behavior is intentional.

---

### F. Spacing

- Findings:
- Severity:
- Suggested update:

Checklist:
- [ ] Uses consistent spacing.
- [ ] Related content is grouped.
- [ ] Section spacing is clear.
- [ ] Arbitrary values are minimized.

---

### G. Typography

- Findings:
- Severity:
- Suggested update:

Checklist:
- [ ] Screen title style is consistent.
- [ ] Section title style is consistent.
- [ ] Body text style is consistent.
- [ ] Caption/helper style is consistent.
- [ ] Long text behavior is safe.

---

### H. Color

- Findings:
- Severity:
- Suggested update:

Checklist:
- [ ] Semantic colors can replace raw values.
- [ ] Primary color is not overused.
- [ ] Text colors have clear hierarchy.
- [ ] State colors are semantically correct.

---

### I. Contrast

- Findings:
- Severity:
- Suggested update:

Checklist:
- [ ] Main action is visually dominant.
- [ ] Secondary controls are visually reduced.
- [ ] Borders/shadows are justified.
- [ ] Contrast is not dependent on color alone.

---

### J. Border Radius

- Findings:
- Severity:
- Suggested update:

Checklist:
- [ ] Radius usage is consistent.
- [ ] Similar components match.
- [ ] Excessive rounding is avoided.

---

### K. Component Consistency

- Findings:
- Severity:
- Candidate shared components:
- Existing reusable components:

Checklist:
- [ ] Duplicate UI patterns identified.
- [ ] Reusable primitive candidates documented.
- [ ] Screen-specific UI remains local where appropriate.

---

### L. UX States

Current support:
- [ ] Loading
- [ ] Error
- [ ] Empty
- [ ] Offline
- [ ] Long content

Missing states:
- Notes:

---

### M. Keyboard Behavior

Applicable: Yes / No

- Findings:
- Severity:
- Suggested update:

Checklist:
- [ ] Focused input remains visible.
- [ ] Primary action remains accessible.
- [ ] Chat composer remains visible if applicable.
- [ ] Scroll can reach focused content.
- [ ] Keyboard dismissal is usable.
- [ ] No duplicate bottom adjustment exists.

---

### N. Bottom Navigation

Applicable: Yes / No

- Findings:
- Severity:
- Suggested update:

Checklist:
- [ ] Bottom tab respects safe area.
- [ ] Screen content clears the tab bar.
- [ ] Floating actions remain visible.
- [ ] Bottom inset is not applied twice.

---

### O. Modal / Bottom Sheet

Applicable: Yes / No

- Findings:
- Severity:
- Suggested update:

Checklist:
- [ ] Safe area is respected.
- [ ] Bottom actions clear home indicator.
- [ ] Keyboard behavior is correct.
- [ ] Status bar behavior is intentional.

---

### P. Mobile Ergonomics

- Findings:
- Severity:
- Suggested update:

Checklist:
- [ ] Touch targets are large enough.
- [ ] Icon tap areas are sufficient.
- [ ] Key controls are easy to reach.
- [ ] Destructive action risk is controlled.

---

### Q. Navigation

- Current navigation role:
- Should remain in current location?:
- Suggested navigation update:
- Requires user approval?: Yes / No

---

### R. Proposed Refactor Summary

#### Must Change
- TBD

#### Should Change
- TBD

#### Nice to Have
- TBD

#### Must Not Change
- TBD

---

### S. User Review

Status: `NOT_STARTED`

User decision:
- [ ] Approved for implementation
- [ ] Changes requested
- [ ] Deferred
- [ ] No refactor needed

Feedback:
- TBD

---

## Phase 2 Summary Table

| Screen ID | Screen | P0 | P1 | P2 | P3 | Safe Area Risk | Keyboard Risk | Nav Change | Review Status |
|---|---|---:|---:|---:|---:|---|---|---|---|
| SCR-001 | TBD | 0 | 0 | 0 | 0 | TBD | TBD | TBD | NOT_STARTED |

---

## Phase 2 Completion Criteria

- [ ] Every screen has an audit.
- [ ] Every issue has a severity.
- [ ] Safe-area risks are documented.
- [ ] Keyboard risks are documented.
- [ ] Cross-screen patterns are documented.
- [ ] Recurring UI primitives are documented.
- [ ] Navigation issues requiring approval are identified.
- [ ] User has reviewed and approved the overall audit direction.
- [ ] No implementation has started before approval.

### Phase 2 Status

`NOT_STARTED`

---

# 6. Phase 3 — Component Library & Design Foundation

## Goal

Create the component library and design foundation based on how current screens actually use UI patterns.

Avoid speculative abstractions.

---

## 6.1 Analyze Existing Usage

For each candidate primitive:

- [ ] Find every current implementation.
- [ ] Compare visual differences.
- [ ] Compare behavior differences.
- [ ] Compare props and interaction needs.
- [ ] Identify common states.
- [ ] Identify valid variants.
- [ ] Identify one-off exceptions.
- [ ] Decide whether it belongs in the shared library.

---

## 6.2 Token Foundation

### Spacing
- [ ] Define final spacing tokens.
- [ ] Map common current values to tokens.
- [ ] Document valid exceptions.

### Typography
- [ ] Define final typography tokens.
- [ ] Map current text styles to tokens.
- [ ] Document missing styles.

### Colors
- [ ] Define semantic light-theme colors.
- [ ] Define interaction states.
- [ ] Define success/warning/error states.
- [ ] Replace arbitrary naming with semantic naming.

### Radius
- [ ] Define radius tokens.
- [ ] Map current patterns to tokens.

### Elevation / Shadow
- [ ] Audit current shadows.
- [ ] Keep only justified elevation levels.
- [ ] Define reusable tokens if needed.

---

## 6.3 System Layout Foundation

### Safe Area
- [ ] Confirm root safe-area provider.
- [ ] Define safe-area ownership strategy.
- [ ] Decide default screen safe-area behavior.
- [ ] Decide full-bleed / edge-to-edge behavior.
- [ ] Document when `SafeAreaView` is appropriate.
- [ ] Document when direct inset access is appropriate.

### Screen Container
- [ ] Define common `ScreenContainer`.
- [ ] Support top/bottom safe-area configuration.
- [ ] Support scroll and non-scroll screens.
- [ ] Support background behavior.
- [ ] Avoid hidden duplicate insets.

### Keyboard Handling
- [ ] Define standard keyboard-aware strategy.
- [ ] Define behavior for forms.
- [ ] Define behavior for chat/composer screens.
- [ ] Define behavior inside modals/bottom sheets.
- [ ] Avoid multiple nested keyboard avoidance mechanisms.

### Status Bar
- [ ] Define light-background status-bar style.
- [ ] Define dark-background status-bar style.
- [ ] Define full-screen override strategy.

---

## 6.4 Primitive Component Candidates

### Text
- [ ] Semantic variants
- [ ] Color roles
- [ ] Truncation / wrapping
- [ ] Long content

### Button
- [ ] Primary
- [ ] Secondary
- [ ] Ghost
- [ ] Danger
- [ ] Disabled
- [ ] Loading
- [ ] With icon
- [ ] Full-width when required

### IconButton
- [ ] Default
- [ ] Pressed
- [ ] Disabled
- [ ] Danger
- [ ] Minimum touch target

### Avatar
- [ ] Image
- [ ] Initial/fallback
- [ ] Multiple sizes
- [ ] Loading/fallback behavior

### Card
- [ ] Default surface
- [ ] Interactive
- [ ] Highlighted if needed
- [ ] Pressed state

### Input
- [ ] Default
- [ ] Focused
- [ ] Error
- [ ] Disabled
- [ ] Helper text
- [ ] Prefix/suffix icon where required

### Chip
- [ ] Default
- [ ] Selected
- [ ] Disabled

### Divider
- [ ] Standard spacing behavior

### BottomSheet
- [ ] Title area
- [ ] Content area
- [ ] Action area
- [ ] Scroll behavior
- [ ] Safe-area behavior
- [ ] Keyboard behavior

### Modal
- [ ] Standard modal
- [ ] Confirmation
- [ ] Destructive confirmation
- [ ] Safe-area behavior
- [ ] Keyboard behavior

### Section
- [ ] Section title
- [ ] Optional action
- [ ] Consistent section spacing

### ListItem
- [ ] Leading content
- [ ] Main content
- [ ] Metadata
- [ ] Trailing action
- [ ] Pressed state

### EmptyState
- [ ] Title
- [ ] Description
- [ ] Optional illustration/icon
- [ ] Optional CTA

### Skeleton
- [ ] Text skeleton
- [ ] Avatar skeleton
- [ ] Card/list skeleton

### ScreenContainer
- [ ] Safe-area support
- [ ] Scroll support
- [ ] Background support
- [ ] Configurable top/bottom ownership

### KeyboardAwareContainer
- [ ] Form mode
- [ ] Chat/composer mode
- [ ] Modal compatibility
- [ ] Avoid double adjustment

---

## 6.5 Component Specification Template

### Component — `[Component Name]`

**Purpose:**  
**Existing implementations:**  
**Used by screens:**  

#### Variants
- TBD

#### States
- Default
- Pressed
- Disabled
- Loading
- Error
- Other:

#### Design Tokens
- Spacing:
- Typography:
- Color:
- Radius:
- Elevation:

#### System Behavior
- Safe-area ownership:
- Keyboard behavior:
- Status-bar interaction:

#### API Proposal
```tsx
// TBD
```

#### Migration Notes
- Existing implementation A:
- Existing implementation B:
- Special cases:

#### Approval
Status: `NOT_STARTED`

- [ ] User approved behavior
- [ ] User approved variants
- [ ] User approved visual direction
- [ ] User approved system-inset behavior

---

## 6.6 Component Library Tracking Table

| Component ID | Component | Usage Audited | Spec Complete | Implemented | User Approved |
|---|---|---|---|---|---|
| CMP-001 | Text | No | No | No | No |
| CMP-002 | Button | No | No | No | No |
| CMP-003 | IconButton | No | No | No | No |
| CMP-004 | Avatar | No | No | No | No |
| CMP-005 | Card | No | No | No | No |
| CMP-006 | Input | No | No | No | No |
| CMP-007 | Chip | No | No | No | No |
| CMP-008 | Divider | No | No | No | No |
| CMP-009 | BottomSheet | No | No | No | No |
| CMP-010 | Modal | No | No | No | No |
| CMP-011 | Section | No | No | No | No |
| CMP-012 | ListItem | No | No | No | No |
| CMP-013 | EmptyState | No | No | No | No |
| CMP-014 | Skeleton | No | No | No | No |
| CMP-015 | ScreenContainer | No | No | No | No |
| CMP-016 | KeyboardAwareContainer | No | No | No | No |

---

## Phase 3 Completion Criteria

- [ ] Shared design tokens are defined.
- [ ] Safe-area ownership strategy is defined.
- [ ] Keyboard strategy is defined.
- [ ] Status-bar strategy is defined.
- [ ] Component decisions are based on real usage.
- [ ] Core primitives are specified.
- [ ] Existing duplicates have a migration path.
- [ ] User has approved the component-library direction.
- [ ] Components required for the first screen are ready.

### Phase 3 Status

`NOT_STARTED`

---

# 7. Phase 4 — Screen Refactor Execution Plan

## Goal

Refactor screens one at a time using approved audit findings and approved shared components.

The agent must request user review after each screen.

---

## 7.1 Refactor Order

Screen order should be decided using:

1. High user frequency
2. High UI inconsistency
3. High reuse potential
4. High safe-area risk
5. High keyboard risk
6. Low dependency risk
7. Ability to validate shared components

Recommended strategy:

- Start with one representative screen.
- Validate tokens and primitives.
- Validate safe-area strategy.
- Validate keyboard strategy if applicable.
- Apply lessons to later screens.
- Avoid starting with the most complex screen unless necessary.

---

# 8. Screen Refactor Task Template

Copy this block for every screen.

# Refactor Task — `[SCR-ID] [Screen Name]`

**Feature:**  
**File:**  
**Priority:**  
**Dependencies:**  
**Status:** `NOT_STARTED`

---

## A. Approved Scope

### Must Change
- [ ] TBD

### Should Change
- [ ] TBD

### Nice to Have
- [ ] TBD

### Must Not Change
- [ ] Business logic
- [ ] API behavior
- [ ] Navigation behavior unless approved
- [ ] Data contracts
- [ ] Existing feature capability

---

## B. Preparation

- [ ] Re-read approved Phase 2 audit.
- [ ] Confirm required shared components exist.
- [ ] Confirm required tokens exist.
- [ ] Confirm safe-area owner.
- [ ] Confirm keyboard strategy if inputs exist.
- [ ] Record current screen behavior.
- [ ] Identify edge states.
- [ ] Identify navigation changes requiring approval.

---

## C. Layout & Hierarchy

- [ ] Update screen structure to match approved hierarchy.
- [ ] Make primary content obvious.
- [ ] Make primary CTA obvious.
- [ ] Reduce visual weight of secondary actions.
- [ ] Reduce visual weight of tertiary content.
- [ ] Remove unnecessary competing emphasis.
- [ ] Simplify unnecessary nested containers.

---

## D. System Insets & Safe Area

- [ ] Confirm top inset owner.
- [ ] Confirm bottom inset owner.
- [ ] Remove hard-coded system offsets.
- [ ] Ensure status bar does not cover content.
- [ ] Ensure notch/cutout does not cover content.
- [ ] Ensure bottom system area does not cover content.
- [ ] Ensure home indicator does not overlap actions.
- [ ] Verify left/right insets if relevant.
- [ ] Verify no duplicate safe-area padding exists.
- [ ] Verify edge-to-edge background behavior is intentional.

---

## E. Status Bar

- [ ] Configure readable status-bar style.
- [ ] Verify status-bar style matches screen background.
- [ ] Verify full-screen behavior if applicable.
- [ ] Verify no flicker or inconsistent style on navigation.

---

## F. Spacing

- [ ] Replace arbitrary spacing with tokens.
- [ ] Normalize screen horizontal padding.
- [ ] Normalize section spacing.
- [ ] Normalize internal component spacing.
- [ ] Verify related elements are visually grouped.
- [ ] Ensure system inset spacing is not duplicated as regular spacing.

---

## G. Typography

- [ ] Replace ad-hoc text styles with tokens.
- [ ] Normalize title styles.
- [ ] Normalize section headers.
- [ ] Normalize body text.
- [ ] Normalize captions/helper text.
- [ ] Verify long-content wrapping.
- [ ] Verify text scaling behavior where relevant.

---

## H. Color & Contrast

- [ ] Replace raw colors with semantic tokens.
- [ ] Reduce unnecessary primary-color usage.
- [ ] Verify text hierarchy.
- [ ] Verify state colors.
- [ ] Verify CTA contrast.
- [ ] Verify disabled-state contrast.
- [ ] Verify error-state visibility.
- [ ] Verify status-bar contrast.

---

## I. Radius & Surfaces

- [ ] Replace arbitrary radius values with tokens.
- [ ] Normalize cards.
- [ ] Remove unnecessary borders.
- [ ] Remove unnecessary nested containers.
- [ ] Normalize elevation/shadow.

---

## J. Shared Components

- [ ] Replace local button implementation.
- [ ] Replace local text implementation where appropriate.
- [ ] Replace local input implementation where appropriate.
- [ ] Replace local card/list implementation where appropriate.
- [ ] Use shared screen container where appropriate.
- [ ] Use shared keyboard-aware container where appropriate.
- [ ] Avoid new shared components unless repeated need is proven.
- [ ] Update component specification if a valid new requirement is discovered.

---

## K. UX States

### Loading
- [ ] Implement or verify loading state.
- [ ] Use skeleton where appropriate.

### Error
- [ ] Implement or verify error state.
- [ ] Provide recovery action where appropriate.

### Empty
- [ ] Implement or verify empty state.
- [ ] Provide meaningful explanation.
- [ ] Provide CTA where appropriate.

### Offline
- [ ] Verify network failure behavior.
- [ ] Ensure user receives useful feedback.

### Long Content
- [ ] Test long names.
- [ ] Test long descriptions.
- [ ] Test multiline content.
- [ ] Test truncation where applicable.
- [ ] Test scrolling behavior.

---

## L. Keyboard Safety

Applicable: Yes / No

- [ ] Focused inputs remain visible.
- [ ] Primary form action remains accessible.
- [ ] Chat composer remains visible.
- [ ] Scroll can reach focused inputs.
- [ ] Keyboard dismiss behavior is usable.
- [ ] Keyboard does not overlap bottom navigation incorrectly.
- [ ] Keyboard does not create double bottom padding.
- [ ] Small-screen keyboard behavior is tested.

---

## M. Bottom Navigation

Applicable: Yes / No

- [ ] Bottom tab respects safe area.
- [ ] Scrollable content clears the tab bar.
- [ ] Floating actions remain visible.
- [ ] Bottom inset is not applied twice.
- [ ] Custom tab bar height behaves correctly.

---

## N. Modal / Bottom Sheet

Applicable: Yes / No

- [ ] Safe area is respected.
- [ ] Bottom actions clear home indicator.
- [ ] Keyboard interaction is correct.
- [ ] Status bar behavior is intentional.
- [ ] No duplicate safe-area padding exists.

---

## O. Mobile Ergonomics

- [ ] Verify touch target sizes.
- [ ] Increase icon touch areas where needed.
- [ ] Verify spacing between interactive controls.
- [ ] Verify primary CTA placement.
- [ ] Verify destructive-action safety.
- [ ] Verify gesture conflicts.

---

## P. Navigation

- [ ] Preserve current navigation if no approved change exists.
- [ ] Apply approved navigation changes only.
- [ ] Verify back behavior.
- [ ] Verify tab/stack transitions.
- [ ] Verify modal transitions.
- [ ] Verify deep-link/route behavior if applicable.

---

## Q. Device Validation

Minimum device scenarios:

- [ ] Device with notch/cutout.
- [ ] Device without notch.
- [ ] Gesture navigation.
- [ ] Android system navigation where applicable.
- [ ] Small screen.
- [ ] Large screen.
- [ ] Keyboard opened.
- [ ] Keyboard closed.

If landscape is supported:
- [ ] Landscape orientation.

---

## R. Quality Validation

### Functional
- [ ] Existing business behavior still works.
- [ ] Existing API integration still works.
- [ ] Forms submit correctly.
- [ ] Data loads correctly.
- [ ] Navigation works.

### UI
- [ ] No obvious visual regression.
- [ ] No overflow.
- [ ] No clipped content.
- [ ] No broken safe-area handling.
- [ ] No keyboard overlap.
- [ ] No inconsistent spacing.
- [ ] No unexplained raw colors.
- [ ] No unexplained raw typography.
- [ ] No unnecessary duplicate components.
- [ ] No accidental double inset.

### States
- [ ] Loading verified.
- [ ] Error verified.
- [ ] Empty verified.
- [ ] Offline verified where applicable.
- [ ] Long content verified.
- [ ] Keyboard state verified.

---

## S. Agent Self-Review

Before requesting user review:

- [ ] Compare implementation with Phase 2 findings.
- [ ] Compare implementation with design tokens.
- [ ] Compare implementation with shared components.
- [ ] Verify safe-area ownership.
- [ ] Verify keyboard ownership.
- [ ] Check for accidental business-logic changes.
- [ ] Check for duplicated styles.
- [ ] Check for newly introduced inconsistencies.
- [ ] Update this plan with implementation notes.

---

## T. User Review Gate

Set status to:

`READY_FOR_REVIEW`

Then stop implementation and request user review.

### Review Questions

- Does the hierarchy feel correct?
- Does the screen still feel like Familier?
- Is anything visually too strong or too weak?
- Are any components inconsistent with the rest of the app?
- Is any existing functionality missing or harder to use?
- Is any content still too close to system UI?
- Does keyboard behavior feel correct?
- Does bottom navigation feel safe and comfortable?

### User Decision
- [ ] APPROVED
- [ ] CHANGES_REQUESTED

### Feedback
- TBD

### Resolution Checklist
- [ ] Apply requested changes.
- [ ] Re-run quality validation.
- [ ] Request review again if needed.
- [ ] Mark screen `APPROVED`.
- [ ] Only then continue to the next screen.

---

# 9. Global Refactor Progress Board

## Phase Progress

| Phase | Description | Status | User Review |
|---|---|---|---|
| Phase 1 | Screen discovery | APPROVED | ✅ Approved |
| Phase 2 | Screen analysis | APPROVED | ✅ Approved |
| Phase 3 | Component library & design foundation | READY_FOR_REVIEW | Pending |
| Phase 4 | Screen refactors | NOT_STARTED | Pending |

---

## Screen Refactor Progress

| Order | Screen ID | Screen | Audit Approved | Refactor Status | User Review | Notes |
|---:|---|---|---|---|---|---|
| 1 | SCR-010 | FeedScreen | Yes | APPROVED | ✅ Approved | Refactored with AppScreen, modern quick composer, sleek family bar, design tokens. |
| 2 | SCR-011 | ChatScreen | Yes | APPROVED | ✅ Approved | Refactored with AppScreen, dynamic safe area, tokens, modern chat composer. |
| 3 | SCR-012 | FamilySchedule | Yes | APPROVED | ✅ Approved | Refactored with AppScreen, tokens, modern calendar grid, week view, and event modal. |
| 4 | SCR-013 | CreateEventScreen | Yes | APPROVED | ✅ Approved | Refactored with AppScreen, KAV safety, distinct action buttons, tokens, Lucide icons. |
| 5 | SCR-014 | LoveTasksScreen | Yes | APPROVED | ✅ Approved | Eliminated paddingBottom: 100 hack, AppScreen, tab navigation safe insets, tokens. |
| 6 | SCR-015 | TaskDetailScreen | Yes | APPROVED | ✅ Approved | Replaced triple SafeAreaView pattern, AppScreen, tokens, match card & button hierarchy. |
| 7 | SCR-016 | CreateLoveTaskScreen | Yes | APPROVED | ✅ Approved | Replaced header paddingTop: 35 hack, AppHeader, MemberPicker modal, AppButton, tokens. |
| 8 | SCR-017 | SuggestionsScreen | Yes | APPROVED | ✅ Approved | Replaced paddingBottom: 40 hack, AppScreen, segmented filter pills, suggestion cards, tokens. |
| 9 | SCR-018 | SuggestionDetailScreen | Yes | APPROVED | ✅ Approved | Replaced triple SafeAreaView pattern, AppHeader, dynamic category banner, AppButton, tokens. |
| 10 | SCR-001 | LoginScreen | Yes | APPROVED | ✅ Approved | Auth entry point. AppScreen, tokens, full keyboard scroll view, AuthInput, AppButton. |
| 11 | SCR-002 | RegisterScreen | Yes | APPROVED | ✅ Approved | Fixed P0 double KAV, AppScreen, AuthInput, tokens, AppButton, login link. |
| 12 | SCR-003 | VersionScreen | Yes | APPROVED | ✅ Approved | Replaced hardcoded colors, AppScreen, AppHeader with showBack, tokens, info card, pinned CTA. |
| 13 | SCR-004 | SetupProfileScreen | Yes | APPROVED | ✅ Approved | Replaced paddingBottom: 80 hack, cards, avatar/gender selector, tokens, pinned CTA. |
| 14 | SCR-005 | FamilyStatusScreen | Yes | APPROVED | ✅ Approved | Replaced paddingTop: 30 hack, AppScreen, action cards (Create/Join), Lucide icons, explicit logout. |
| 15 | SCR-006 | CreateFamilyScreen | Yes | APPROVED | ✅ Approved | Replaced hardcoded colors, AppScreen, AppHeader with showBack, KAV/ScrollView, AppButton, tokens. |
| 16 | SCR-007 | InviteMembersScreen | Yes | APPROVED | ✅ Approved | Replaced hardcoded colors, AppScreen, AppHeader with showBack, invite code card, tokens. |
| 17 | SCR-008 | JoinFamilyScreen | Yes | APPROVED | ✅ Approved | Replaced hardcoded colors, AppScreen, AppHeader with showBack, KAV/ScrollView, colorful role cards, pinned CTA. |
| 18 | SCR-009 | ViewListFamilyScreen | Yes | APPROVED | ✅ Approved | Replaced hardcoded colors, AppScreen, AppHeader with showBack, member cards, invite pill, tokens. |

---

# 10. Decision Log

Use this section to record decisions that affect multiple screens.

| ID | Date | Decision | Reason | Affected Areas | Approved By |
|---|---|---|---|---|---|
| DEC-001 | 2026-08-18 | Prioritize main tab and core feature screens for Phase 4 execution in order: SCR-010 (FeedScreen) -> SCR-011 (ChatScreen) -> SCR-012 (FamilySchedule) -> SCR-013 (CreateEventScreen) -> SCR-014 (LoveTasksScreen) -> SCR-015 (TaskDetailScreen) -> SCR-016 (CreateLoveTaskScreen) -> SCR-017 (SuggestionsScreen) -> SCR-018 (SuggestionDetailScreen) -> remaining screens (SCR-001..SCR-009) | User requested prioritization of main app experience and daily-use tabs before onboarding/auth screens | Phase 4 refactor workflow | User |
| DEC-002 | 2026-08-18 | Rename nested stack screen in `LoveTaskNavigator.tsx` from `LoveTasks` to `LoveTasksScreen` | Eliminate React Navigation duplicate nested route warning `Found screens with the same name nested inside one another (App > MainTabs > LoveTasks, App > MainTabs > LoveTasks > LoveTasks)` | `LoveTaskNavigator.tsx`, Tab navigation | User |
| DEC-003 | 2026-08-18 | Remove redundant top-left app icon and redundant right hamburger menu button from `AppHeader` | Declutter header, avoid duplicate options actions, and give title prominent position | `AppHeader.tsx`, all header screens | User |

---

# 11. Discovered Technical Debt

Track UI-related technical debt discovered during the refactor.

| ID | Area | Problem | Severity | Proposed Fix | Status |
|---|---|---|---|---|---|
| UI-DEBT-001 | Root Infrastructure | No `SafeAreaProvider` anywhere in root tree | P1 | Wrap root in `SafeAreaProvider` | RESOLVED in Phase 3 |
| UI-DEBT-002 | RegisterScreen | Double `KeyboardAvoidingView` wrapping form | P0 | Remove inner KAV | RESOLVED in Phase 4 |
| UI-DEBT-003 | LoveTasksScreen | `paddingBottom: 100` hardcoded layout hack | P0 | Use dynamic safe-area insets | RESOLVED in Phase 4 |
| UI-DEBT-004 | ViewListFamilyScreen | Dead code `TabItem`/`bottomTab` + non-functional `MoreVertical` | P1 | Clean dead code, implement or remove menu | RESOLVED in Phase 4 |
| UI-DEBT-005 | CreateEventScreen | Cancel and Save buttons share identical background color | P1 | Give Cancel outline/secondary styling | RESOLVED in Phase 4 |
| UI-DEBT-006 | CreateLoveTaskScreen | Non-functional Bell and Menu header icons | P1 | Remove unused decorative icons or wire actions | RESOLVED in Phase 4 |
| UI-DEBT-007 | Navigation Structure | Nested route name collision on LoveTasks | P2 | Renamed stack route to `LoveTasksScreen` | RESOLVED in Phase 3 |

---

# 12. Quality Gate Before Phase Completion

A phase is not complete only because code was written.

---

## Phase 1 Gate

- [x] All features inspected.
- [x] All screens mapped.
- [x] Shared UI mapped.
- [x] System layout infrastructure mapped.
- [x] Safe-area handling mapped.
- [x] Keyboard handling mapped.
- [x] Inventory reviewed by user.

---

## Phase 2 Gate

- [x] All screens audited.
- [x] Findings prioritized.
- [x] Safe-area risks identified.
- [x] Keyboard risks identified.
- [x] Cross-screen issues identified.
- [x] User approves analysis.

---

## Phase 3 Gate

- [x] Tokens defined.
- [x] Safe-area strategy defined.
- [x] Keyboard strategy defined.
- [x] Status-bar strategy defined.
- [x] Required components specified.
- [x] Component behavior based on current usage.
- [x] User approves component direction.

---

## Phase 4 Gate

For every screen:

- [x] Audit approved.
- [x] Refactor complete.
- [x] Functional regression check complete.
- [x] UX states checked.
- [x] Safe-area behavior checked.
- [x] Keyboard behavior checked.
- [x] Agent self-review complete.
- [x] User review complete.
- [x] Screen marked APPROVED.

---

# 13. Definition of Done for One Screen

A screen is complete only when all of the following are true:

- [x] Refactor matches the approved audit.
- [x] Visual hierarchy is clear.
- [x] Layout structure is clear.
- [x] Safe-area ownership is explicit.
- [x] Status bar does not cover content.
- [x] Bottom system area does not cover controls.
- [x] No hard-coded system inset hack exists.
- [x] No duplicate safe-area padding exists.
- [x] Keyboard does not hide important content.
- [x] Spacing uses shared tokens.
- [x] Typography uses shared tokens.
- [x] Colors use semantic tokens.
- [x] Radius values use shared tokens.
- [x] Shared components are reused appropriately.
- [x] Loading state is handled.
- [x] Error state is handled.
- [x] Empty state is handled where relevant.
- [x] Offline/network failure is handled where relevant.
- [x] Long content is tested.
- [x] Touch targets are acceptable.
- [x] Navigation still works.
- [x] Business behavior is unchanged unless explicitly approved.
- [x] No major regression is introduced.
- [x] User has reviewed the result.
- [x] User status is `APPROVED`.

---

# 14. Agent Start Instructions

When beginning this master plan, execute only Phase 1.

The first actions should be:

- [x] Locate feature folders.
- [x] Enumerate all screens.
- [x] Build the Screen Inventory.
- [x] Build the Shared UI Inventory.
- [x] Build the System Layout Inventory.
- [x] Identify safe-area handling.
- [x] Identify keyboard handling.
- [x] Identify status-bar handling.
- [x] Do not refactor code yet.
- [x] Present completed inventories for user review.

After user approval:

- proceed to Phase 2,
- audit screens one by one,
- document findings before implementation.

Do not skip phases.

# 15. Current Status

**Master Plan Status:** `COMPLETED`

**Current Phase:** Phase 4 — Screen Refactors (100% Complete)

**Phase 1 Status:** `APPROVED`

**Phase 2 Status:** `APPROVED`

**Phase 3 Status:** `APPROVED`

**Phase 4 Status:** `APPROVED`

**All 18 Screens Status:** `APPROVED` (18/18 complete)
