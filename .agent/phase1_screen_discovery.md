# Phase 1 — Screen Discovery Report
**Status:** `READY_FOR_REVIEW`

---

## Feature Folders

| Folder | Type | Notes |
|---|---|---|
| `features/auth` | Feature | Auth flow (login, register, version) |
| `features/chat` | Feature | Family chat |
| `features/family` | Feature | Family setup / onboarding flow |
| `features/lovetask` | Feature | Love tasks management |
| `features/notification` | Feature | No screens — only components, hooks, services, store |
| `features/schedule` | Feature | Family schedule + event creation |
| `features/social` | Feature | Home feed (main tab) |
| `features/suggestion` | Feature | AI suggestions |
| `features/user` | Feature | Profile setup (onboarding) |
| `components/` | Shared UI | 8 shared components |
| `navigation/` | Navigation | Root, App, Tab navigators |
| `theme/` | Tokens | colors.ts (partial), spacing.ts (EMPTY) |
| `hooks/` | Shared hooks | |
| `store/` | State | |
| `utils/` | Utilities | |

---

## Screen Inventory (18 Screens)

| ID | Feature | Screen | File Path | Route | Reachable | Input | Safe Area | Keyboard | Status |
|---|---|---|---|---|---|---|---|---|---|
| SCR-001 | auth | LoginScreen | `features/auth/screens/LoginScreen.tsx` | `Login` | ✅ Yes (unauthenticated root) | Yes | `SafeAreaView` (direct) | None found | NOT_STARTED |
| SCR-002 | auth | RegisterScreen | `features/auth/screens/RegisterScreen.tsx` | `Register` | ✅ Yes | Yes | None found | `KeyboardAvoidingView` | NOT_STARTED |
| SCR-003 | auth | VersionScreen | `features/auth/screens/VersionScreen.tsx` | `Version` | ✅ Yes | No | None found | None | NOT_STARTED |
| SCR-004 | user | SetupProfileScreen | `features/user/screen/SetupProfileScreen.tsx` | `SetupProfile` | ✅ Yes (post-login, pre-setup) | Yes | None found | None found | NOT_STARTED |
| SCR-005 | family | FamilyStatusScreen | `features/family/screens/FamilyStatusScreen.tsx` | `FamilyStatus` | ✅ Yes (no family state) | No | `SafeAreaView` (direct) | None | NOT_STARTED |
| SCR-006 | family | CreateFamilyScreen | `features/family/screens/CreateFamilyScreen.tsx` | `CreateFamily` | ✅ Yes | Yes | `SafeAreaView` (direct) | None found | NOT_STARTED |
| SCR-007 | family | InviteMembersScreen | `features/family/screens/InviteMembersScreen.tsx` | `InviteMembers` | ✅ Yes | No | `SafeAreaView` (direct) | None | NOT_STARTED |
| SCR-008 | family | JoinFamilyScreen | `features/family/screens/JoinFamilyScreen.tsx` | `JoinFamily` | ✅ Yes | Yes | None found | None found | NOT_STARTED |
| SCR-009 | family/social | ViewListFamilyScreen | `features/family/screens/ViewListFamilyScreen.tsx` | `ViewListFamily` (SocialNavigator) | ✅ Yes | No | `SafeAreaView` (direct) | None | NOT_STARTED |
| SCR-010 | social | FeedScreen | `features/social/screens/FeedScreen.tsx` | `FeedScreen` (Home tab) | ✅ Yes (main tab) | Yes (comments) | `SafeAreaView` (direct) | `KeyboardAvoidingView` (inline) | NOT_STARTED |
| SCR-011 | chat | ChatScreen | `features/chat/screens/ChatScreen.tsx` | `ChatScreen` (Chat tab) / `Chat` (SocialNavigator) | ✅ Yes (dual route) | Yes | `SafeAreaView` (direct) | `KeyboardAvoidingView` | NOT_STARTED |
| SCR-012 | schedule | FamilySchedule | `features/schedule/screens/FamilySchedule.tsx` | `FamilySchedule` | ✅ Yes (Schedule tab) | No | `SafeAreaView` (direct) | None | NOT_STARTED |
| SCR-013 | schedule/suggestion | CreateEventScreen | `features/schedule/screens/CreateEventScreen.tsx` | `CreateEvent` / `SuggestionCreateEvent` | ✅ Yes (dual route) | Yes | `SafeAreaView` (direct) | None found | NOT_STARTED |
| SCR-014 | lovetask | LoveTasksScreen | `features/lovetask/screens/LoveTasksScreen.tsx` | `LoveTasks` | ✅ Yes (LoveTasks tab) | No | `SafeAreaView` (direct) | None | NOT_STARTED |
| SCR-015 | lovetask | TaskDetailScreen | `features/lovetask/screens/TaskDetailScreen.tsx` | `TaskDetail` | ✅ Yes | No | `SafeAreaView` (direct, multiple) | None | NOT_STARTED |
| SCR-016 | lovetask/suggestion | CreateLoveTaskScreen | `features/lovetask/screens/CreateLoveTaskScreen.tsx` | `CreateLoveTask` / `SuggestionCreateLoveTask` | ✅ Yes (dual route) | Yes | `SafeAreaView` (direct) | `KeyboardAvoidingView` | NOT_STARTED |
| SCR-017 | suggestion | SuggestionsScreen | `features/suggestion/screens/SuggestionsScreen.tsx` | `SuggestionList` | ✅ Yes (Suggestions tab) | No | None found | None | NOT_STARTED |
| SCR-018 | suggestion | SuggestionDetailScreen | `features/suggestion/screens/SuggestionDetailScreen.tsx` | `SuggestionDetail` | ✅ Yes | No | `SafeAreaView` (direct, multiple) | None | NOT_STARTED |

> **Note:** `notification` feature has no screens — only a notification banner component rendered in RootNavigator overlay.

---

## Navigation Architecture

```
RootNavigator (NavigationContainer)
├── Auth (unauthenticated)
│   ├── Login         → SCR-001 LoginScreen
│   ├── Register      → SCR-002 RegisterScreen
│   └── Version       → SCR-003 VersionScreen
└── App (authenticated)
    ├── SetupProfile  → SCR-004 SetupProfileScreen  (if !isSetup)
    ├── Family        → FamilyNavigator             (if isSetup && !hasFamily)
    │   ├── FamilyStatus   → SCR-005
    │   ├── CreateFamily   → SCR-006
    │   ├── InviteMembers  → SCR-007
    │   └── JoinFamily     → SCR-008
    └── MainTabs      → TabNavigator               (if isSetup && hasFamily)
        ├── Suggestions tab → SuggestionNavigator
        │   ├── SuggestionList          → SCR-017
        │   ├── SuggestionDetail        → SCR-018
        │   ├── SuggestionCreateEvent   → SCR-013 ⚠️ shared screen
        │   └── SuggestionCreateLoveTask→ SCR-016 ⚠️ shared screen
        ├── Chat tab → ChatNavigator
        │   └── ChatScreen              → SCR-011
        ├── Home tab → SocialNavigator
        │   ├── FeedScreen              → SCR-010
        │   ├── ViewListFamily          → SCR-009 ⚠️ family screen in social nav
        │   └── Chat                    → SCR-011 ⚠️ duplicate ChatScreen
        ├── Schedule tab → ScheduleNavigator
        │   ├── FamilySchedule          → SCR-012
        │   └── CreateEvent             → SCR-013 ⚠️ shared screen
        └── LoveTasks tab → LoveTaskNavigator
            ├── LoveTasks               → SCR-014
            ├── TaskDetail              → SCR-015
            └── CreateLoveTask          → SCR-016 ⚠️ shared screen
```

**⚠️ Navigation anomalies found:**
- `ChatScreen` is registered in both `ChatNavigator` (Chat tab) and `SocialNavigator` (Home → Chat) — same component, two routes.
- `CreateEventScreen` is registered in both `ScheduleNavigator` and `SuggestionNavigator`.
- `CreateLoveTaskScreen` is registered in both `LoveTaskNavigator` and `SuggestionNavigator`.
- `ViewListFamilyScreen` (a family screen) lives inside `SocialNavigator`.

---

## Shared UI Inventory

| ID | Component | File Path | Used By | Duplicate Risk | Notes |
|---|---|---|---|---|---|
| CMP-001 | `AppButton` | `components/AppButton.tsx` | Sparse — most screens use `TouchableOpacity` directly | HIGH | Rarely adopted |
| CMP-002 | `AppError` | `components/AppError.tsx` | Unknown | LOW | Small error display component |
| CMP-003 | `AppHeader` | `components/AppHeader.tsx` | Some screens | MEDIUM | Most screens build custom headers inline |
| CMP-004 | `AppInput` | `components/AppInput.tsx` | Sparse — most screens use `TextInput` directly | HIGH | Rarely adopted |
| CMP-005 | `AppLoader` | `components/AppLoader.tsx` | Some screens | LOW | Loading spinner wrapper |
| CMP-006 | `AppScreen` | `components/AppScreen.tsx` | Very sparse — most screens use `SafeAreaView` directly | HIGH | Wraps `SafeAreaView` + `KeyboardAvoidingView`, mostly **ignored** by screens |
| CMP-007 | `AppText` | `components/AppText.tsx` | Very sparse | HIGH | Most screens use `<Text>` directly |
| CMP-008 | `InAppNotificationBanner` | `components/InAppNotificationBanner.tsx` | `RootNavigator` | LOW | Overlay notification banner |

---

## System Layout Inventory

| ID | Area | File / Location | Current Owner | Risk | Notes |
|---|---|---|---|---|---|
| SYS-001 | **SafeAreaProvider** | ❌ NOT FOUND | Nobody | CRITICAL | No `SafeAreaProvider` exists anywhere. `SafeAreaView` from `react-native` works without it on iOS but degrades on Android/Expo. |
| SYS-002 | **SafeAreaView** | Used directly in ~14 of 18 screens | Each screen individually | HIGH | No centralized ownership. Every screen manages its own insets with no shared strategy. |
| SYS-003 | **useSafeAreaInsets** | ❌ NOT FOUND | Nobody | HIGH | Never used. All safe area is via `SafeAreaView` wrapping — no dynamic inset access. |
| SYS-004 | **StatusBar** | ❌ NOT CONFIGURED | Nobody | MEDIUM | Never configured. No style (dark/light-content), no background color set for any screen. |
| SYS-005 | **Bottom Tab Insets** | `navigation/TabNavigator.tsx` (default RN tab bar) | React Navigation default | MEDIUM | Uses default bottom tab behavior — no explicit safe area accounting verified. |
| SYS-006 | **KeyboardAvoidingView** | `components/AppScreen.tsx`, `features/auth/screens/RegisterScreen.tsx`, `features/chat/screens/ChatScreen.tsx`, `features/lovetask/screens/CreateLoveTaskScreen.tsx`, `features/social/screens/FeedScreen.tsx`, `features/social/components/CreatePostModal.tsx` | Each file independently | HIGH | No unified strategy. Risk of double-avoidance if `AppScreen` is combined with screen-level KAV. |
| SYS-007 | **Hard-coded `paddingTop`** | `VersionScreen`, `ChatScreen`, `CreateFamilyScreen` (×3), `FamilyStatusScreen`, `InviteMembersScreen`, `ViewListFamilyScreen`, `CreateLoveTaskScreen`, `NotificationPopup`, `SuggestionDetailScreen` | Individual screens | HIGH | Values: 10, 20, 30, 35, 50, 80. Some are clearly offsetting status bar or header manually. |
| SYS-008 | **Hard-coded `paddingBottom`** | `ChatScreen` (×3), `ChatSidebar`, `CreateFamilyScreen`, `FamilyStatusScreen`, `JoinFamilyScreen`, `ViewListFamilyScreen` (×3), `CreateLoveTaskScreen` (×2), `LoveTasksScreen` (`paddingBottom: 100`), `TaskDetailScreen` (×2), `CreateEventScreen`, `FamilySchedule` (×2), `FeedScreen`, `SuggestionDetailScreen` (×2), `SuggestionsScreen`, `SetupProfileScreen` | Individual screens | CRITICAL | `paddingBottom: 100` in LoveTasksScreen is almost certainly a tab-bar hack. `paddingBottom: 80` in SetupProfileScreen is suspicious. Widespread arbitrary bottom offsets. |

---

## Token Foundation Status

| Token Type | File | Status | Notes |
|---|---|---|---|
| Colors | `theme/colors.ts` | ⚠️ Partial | Only 5 tokens: `primary`, `background`, `card`, `text`, `textSecondary`. Missing: surface, textMuted, primaryPressed, primarySoft, success, warning, error, border. Most screens use raw hex colors. |
| Spacing | `theme/spacing.ts` | ❌ Empty | File exists but is completely empty. All spacing is ad-hoc. |
| Typography | None | ❌ Missing | No typography token file exists. All font sizes and weights are ad-hoc in `StyleSheet.create`. |
| Border Radius | None | ❌ Missing | No radius token file. All border radii are ad-hoc. |

---

## Critical Findings Summary

### CRITICAL
- **SYS-001** — No `SafeAreaProvider` at root. The app uses `SafeAreaView` from `react-native` across all screens but has no `SafeAreaProvider`. On Android and newer Expo SDK versions this can silently produce incorrect insets. Must be resolved before any safe-area refactor work.
- **SYS-008** — `paddingBottom: 100` in LoveTasksScreen. Hard-coded tab bar offset hack. Brittle, device-specific, will break on devices with different system navigation heights.

### WARNING
- **SYS-006** — Fragmented keyboard avoidance. `KeyboardAvoidingView` is used in `AppScreen` (shared wrapper) AND independently in individual screens. If any screen ever uses `AppScreen` as its wrapper, it would get double keyboard avoidance.
- **Navigation** — 3 screens registered on dual routes. `ChatScreen`, `CreateEventScreen`, and `CreateLoveTaskScreen` each appear in two separate navigators. Navigation architecture concern to resolve before Phase 4.

### NOTE
- **Token foundation is nearly absent.** `spacing.ts` is empty, typography tokens don't exist, and `colors.ts` covers only 5 of the 14 required semantic roles. Phase 3 will need to build this from scratch.

---

## Phase 1 Completion Checklist

- [x] Every feature folder has been inspected.
- [x] Every screen has an inventory entry (18 screens).
- [x] Every known route has been mapped.
- [x] Shared UI has been inventoried (8 components).
- [x] Safe-area and keyboard infrastructure has been inventoried.
- [x] No screen has been visually refactored yet.
- [ ] **User has reviewed the discovered inventory.** ← Waiting

**Phase 1 Status: `READY_FOR_REVIEW`**
