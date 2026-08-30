# Phase 2 — Screen-by-Screen UI Analysis
**Status:** `READY_FOR_REVIEW`

---

## How to read this document

Each screen audit covers 13 dimensions. Findings are tagged:
- **P0** — Blocks usability or breaks interaction
- **P1** — Major hierarchy, safe-area, or consistency problem
- **P2** — Noticeable visual or UX inconsistency
- **P3** — Minor polish issue

Findings marked `[SYSTEMIC]` appear across many screens and will be resolved once in Phase 3 (token system + safe area infrastructure). They are noted per screen for completeness but will not require per-screen fixes.

---

## SCR-001 — LoginScreen
**File:** `features/auth/screens/LoginScreen.tsx`
**Route:** `Login` | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | Entry point for email/password login and Google SSO. Clear single goal. | OK |
| 2 | Visual Hierarchy | Logo → Title → Subtitle → Form → Login CTA → Divider → Google → Sign-up link. Logical. | OK |
| 3 | Layout | Uses `AppScreen` (SafeAreaView + KAV) with `justifyContent: center`. No scroll — content may clip on small screens. | P2 |
| 4 | Safe Area | `AppScreen` wraps `SafeAreaView`. No `SafeAreaProvider` at root. | P1 SYSTEMIC |
| 5 | Spacing | All ad-hoc margin values. | P2 SYSTEMIC |
| 6 | Typography | Title 24/700 OK. Version link `fontSize: 11, opacity: 0.7` + nested `opacity: 0.2` — nearly invisible. | P2 |
| 7 | Color | All raw hex. `#cc701f` versionLink opacity 0.2 = invisible. | P2 SYSTEMIC |
| 8 | Components | Uses AppScreen, AppButton, AppText. Google button is raw TouchableOpacity (not shared). | P3 |
| 9 | UX States | Login loading: AppButton loading prop OK. No error display for auth failures. | P2 |
| 10 | Keyboard | AppScreen KAV with no scroll. On small iOS devices, keyboard pushes content off screen. | P1 |
| 11 | Ergonomics | CTA and Google button full-width OK. Sign-up link is small tap target (inline text). | P2 |
| 12 | Navigation | Login → Register and Version. Correct. | OK |
| 13 | Polish | versionLink opacity 0.2 nearly invisible — likely unintentional. | P2 |

**Priority fixes:** P1 no scroll with keyboard, P2 invisible version link.

---

## SCR-002 — RegisterScreen
**File:** `features/auth/screens/RegisterScreen.tsx`
**Route:** `Register` | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | Email/password + Google registration. | OK |
| 2 | Visual Hierarchy | Logo → Title → 4 inputs → Strength indicator → Register → Google → Login. Dense but logical. | OK |
| 3 | Layout | Uses `AppScreen` (SafeAreaView + KAV) THEN another `KeyboardAvoidingView` inside. Double KAV. | P0 |
| 4 | Safe Area | AppScreen owns it. No SafeAreaProvider. | P1 SYSTEMIC |
| 5 | Spacing | Ad-hoc throughout. | P2 SYSTEMIC |
| 6 | Typography | Matches SCR-001. | P2 SYSTEMIC |
| 7 | Color | Same raw hex as SCR-001. Register borderRadius: 26 vs Google borderRadius: 14 — inconsistent within same screen. | P2 |
| 8 | Components | Register and Google buttons are raw TouchableOpacity — inconsistent with SCR-001 which uses AppButton. | P2 |
| 9 | UX States | Password strength shown OK. Register button has no spinner when loading. | P2 |
| 10 | Keyboard | Double KAV — AppScreen (ios: padding) + inner KAV (ios: padding, android: height). Doubles keyboard offset on iOS. | P0 |
| 11 | Ergonomics | Buttons full-width OK. Login link is small tap target. | P2 |
| 12 | Navigation | Back to Login. Correct. | OK |
| 13 | Polish | Inconsistent border radii (26 vs 14) and CTA style vs LoginScreen. | P2 |

**Priority fixes:** P0 double KAV (critical).

---

## SCR-003 — VersionScreen
**File:** `features/auth/screens/VersionScreen.tsx`
**Route:** `Version` | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | OTA update info + manual update check. Developer utility screen. | OK |
| 2 | Visual Hierarchy | Back → Title → Info card → Update button. Clean. | OK |
| 3 | Layout | AppScreen used. Header `paddingTop: 20` — hard-coded top offset. | P1 |
| 4 | Safe Area | AppScreen owns safe area. paddingTop: 20 in header is redundant/risky. | P1 |
| 5 | Spacing | Ad-hoc but reasonable. | P2 SYSTEMIC |
| 6 | Typography | Header 20/700. Info labels 14/500. Values 14/600. Consistent. | P3 |
| 7 | Color | Raw hex. | P2 SYSTEMIC |
| 8 | Components | Uses AppScreen, AppText, AppButton — good shared component adoption. | OK |
| 9 | UX States | Checking state OK. Alert for success/error. | P3 |
| 10 | Keyboard | No inputs. No KAV needed. | OK |
| 11 | Ergonomics | Back button padding: 8. Update button full-width. | OK |
| 12 | Navigation | goBack() correct. | OK |
| 13 | Polish | Minimal — utility screen. | OK |

**Priority fixes:** P1 paddingTop: 20 redundant with AppScreen safe area.

---

## SCR-004 — SetupProfileScreen
**File:** `features/user/screen/SetupProfileScreen.tsx`
**Route:** `SetupProfile` | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | First-run: DOB, gender, hobbies. One-time onboarding. | OK |
| 2 | Visual Hierarchy | Header → 3 input cards → Save CTA. Cards group inputs well. | OK |
| 3 | Layout | AppScreen used. scrollContent paddingBottom: 80 — hard-coded bottom buffer. | P1 |
| 4 | Safe Area | AppScreen owns. paddingBottom: 80 likely compensating for missing safe area at bottom. | P1 |
| 5 | Spacing | paddingVertical: 30, paddingHorizontal: 24. Ad-hoc. | P2 SYSTEMIC |
| 6 | Typography | Header title fontSize: 16/700 — too small for screen title (should be heading2: 20/600). Step title also 16/700 — same as header, no differentiation. | P2 |
| 7 | Color | Raw hex throughout. Muted color #B8860B — unusual brownish-gold, lower contrast. | P2 SYSTEMIC |
| 8 | Components | AppScreen, AppText, AppButton OK. Modal picker custom-built inline (not shared). | P3 |
| 9 | UX States | Loading: button shows "Loading" OK. No error state if onSaveProfile fails. | P2 |
| 10 | Keyboard | AppScreen KAV + ScrollView. Should work. | OK |
| 11 | Ergonomics | Date selector paddingVertical: 12 OK. Hobby tags paddingVertical: 8 — borderline. | P3 |
| 12 | Navigation | No back button — correct for onboarding. | OK |
| 13 | Polish | Screen title/purpose not communicated — header just shows a subtitle description. | P2 |

**Priority fixes:** P1 paddingBottom: 80, P2 typography hierarchy.

---

## SCR-005 — FamilyStatusScreen
**File:** `features/family/screens/FamilyStatusScreen.tsx`
**Route:** `FamilyStatus` | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | Decision screen: join or create family. | OK |
| 2 | Visual Hierarchy | Logo → Illustration → Title → Subtitle → 2 option cards. Clean. | OK |
| 3 | Layout | SafeAreaView directly. Back button `paddingTop: 30` — hard-coded safe area hack. | P1 |
| 4 | Safe Area | paddingTop: 30 insufficient if SafeAreaProvider missing. | P1 SYSTEMIC |
| 5 | Spacing | paddingTop: 30, paddingHorizontal: 25, paddingBottom: 30. Ad-hoc. | P2 SYSTEMIC |
| 6 | Typography | Title 26/bold. Subtitle 16/600. Card title 15/700. Card desc 12/italic. Reasonable hierarchy. | P3 |
| 7 | Color | Raw hex. Subtitle same color as title — no visual hierarchy by color. | P2 |
| 8 | Components | React-native primitives only. No shared components used. | P2 SYSTEMIC |
| 9 | UX States | Static choice screen. No states needed. | P3 |
| 10 | Keyboard | No inputs. | OK |
| 11 | Ergonomics | Option cards full-width with paddingVertical: 15 OK. | P3 |
| 12 | Navigation | Back calls logout() — unusual but logically correct for onboarding. Not communicated to user. | P2 |
| 13 | Polish | Card description italic + opacity 0.7 — readable but low contrast. | P3 |

**Priority fixes:** P1 paddingTop: 30 safe area hack, P2 logout-as-back not communicated.

---

## SCR-006 — CreateFamilyScreen
**File:** `features/family/screens/CreateFamilyScreen.tsx`
**Route:** `CreateFamily` | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | Create family with a name. Single-input form. | OK |
| 2 | Visual Hierarchy | Header → Avatar → Title → Input → Suggestions → CTA. OK. | OK |
| 3 | Layout | SafeAreaView. Header height: 60, paddingTop: 10. Avatar container paddingTop: 50. Footer paddingBottom: 35 + button marginBottom: 40 — excessive double-bottom. | P1 |
| 4 | Safe Area | SafeAreaView + paddingTop: 10 in header — redundant. | P1 SYSTEMIC |
| 5 | Spacing | paddingTop: 10, 50, 10. paddingBottom: 35, marginBottom: 40. Extremely ad-hoc. | P2 SYSTEMIC |
| 6 | Typography | Header 22/700. Main title 26/bold with padding: 20 on text (unusual). | P2 |
| 7 | Color | Raw hex. Validation error uses bare color: 'red'. | P2 SYSTEMIC |
| 8 | Components | Raw primitives. No AppText, AppButton, AppInput. Inline button + ActivityIndicator. | P2 |
| 9 | UX States | Loading: ActivityIndicator OK. Validation error inline OK. | OK |
| 10 | Keyboard | No KAV. TextInput in ScrollView — Android may cover input. | P1 |
| 11 | Ergonomics | CTA height: 55 OK. Camera placeholder non-functional. | P3 |
| 12 | Navigation | goBack() + continue. Correct. | OK |
| 13 | Polish | Camera button non-functional — misleads user. color: 'red' for error. | P2 |

**Priority fixes:** P1 no KAV, P1 excessive bottom padding, P2 no shared components.

---

## SCR-007 — InviteMembersScreen
**File:** `features/family/screens/InviteMembersScreen.tsx`
**Route:** `InviteMembers` | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | Share invite code. Last onboarding step. | OK |
| 2 | Visual Hierarchy | Header → Logo → Title → Code card → CTAs → Skip. Clear. | OK |
| 3 | Layout | SafeAreaView. Header paddingTop: 10. Bottom marginBottom: 40. | P2 |
| 4 | Safe Area | SafeAreaView + paddingTop: 10 in header. | P1 SYSTEMIC |
| 5 | Spacing | paddingHorizontal: 16/30, paddingTop: 10, marginBottom: 15/40. Mixed. | P2 SYSTEMIC |
| 6 | Typography | Header 22/700. Code 26/bold. Title 24/bold. Consistent. | P3 |
| 7 | Color | Raw hex. | P2 SYSTEMIC |
| 8 | Components | Raw primitives. Feather + Ionicons — two icon libs on same screen. | P2 |
| 9 | UX States | No loading. Copy is instant. No error if copy fails. | P3 |
| 10 | Keyboard | No inputs. | OK |
| 11 | Ergonomics | Copy/Share paddingVertical: 12 OK. Skip link could be more prominent. | P3 |
| 12 | Navigation | Both Continue and Skip call handleFinish — intentional. | OK |
| 13 | Polish | Two different icon libraries on same screen. Logo 200x200 — large on small screens. | P2 |

**Priority fixes:** P1 header safe area hack, P2 icon library inconsistency.

---

## SCR-008 — JoinFamilyScreen
**File:** `features/family/screens/JoinFamilyScreen.tsx`
**Route:** `JoinFamily` | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | Two-step: enter invite code → pick relationship. Input-heavy. | OK |
| 2 | Visual Hierarchy | Header → Step content → CTA. Good. | OK |
| 3 | Layout | AppScreen (SafeAreaView + KAV). Back button absolute, top: 30 — hardcoded pixel offset. | P1 |
| 4 | Safe Area | AppScreen handles it. Back button position absolute with top: 30 is fragile. | P1 |
| 5 | Spacing | paddingVertical: 30, paddingHorizontal: 24, marginBottom: 16/24. Ad-hoc. | P2 SYSTEMIC |
| 6 | Typography | Header title fontSize: 16/700 — too small for screen title. Step title 18/700. | P2 |
| 7 | Color | Raw hex with rgba values. | P2 SYSTEMIC |
| 8 | Components | AppScreen, AppText, AppButton OK. Relationship list built inline. | P3 |
| 9 | UX States | Loading: button text "Loading" OK. No error state if family not found. | P2 |
| 10 | Keyboard | AppScreen has KAV (undefined on Android). TextInput may be covered on Android. | P1 |
| 11 | Ergonomics | Relationship cards padding: 12 OK. Fixed-height scroll for relationship list. | P3 |
| 12 | Navigation | Back in header + wizard back. Both correct. | OK |
| 13 | Polish | Absolute back button brittle. Icon differs from other screens (Feather vs Ionicons). | P2 |

**Priority fixes:** P1 absolute back button, P1 Android keyboard coverage.

---

## SCR-009 — ViewListFamilyScreen
**File:** `features/family/screens/ViewListFamilyScreen.tsx`
**Route:** `ViewListFamily` | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | View family members, name, invite code. Management screen. | OK |
| 2 | Visual Hierarchy | Nav header → Avatar → Name → Code → Meta → Members. Good. | OK |
| 3 | Layout | SafeAreaView. navHeader paddingTop: 35, paddingBottom: 15. Orphaned TabItem component + bottomTab style defined but never rendered. | P1 |
| 4 | Safe Area | SafeAreaView + paddingTop: 35 — hard-coded status bar hack. | P1 |
| 5 | Spacing | paddingTop: 35, paddingBottom: 15, marginVertical: 25. Ad-hoc. | P2 SYSTEMIC |
| 6 | Typography | Nav 20/bold. Family name 24/bold. Member name 16/600. Member role 13. Hierarchy OK. | P3 |
| 7 | Color | Local constants (BACKGROUND_COLOR, ACCENT_COLOR, TEXT_COLOR) — better than raw hex but not shared tokens. | P2 SYSTEMIC |
| 8 | Components | Raw primitives. AppHeader NOT used. MoreVertical button has NO onPress handler — non-functional. | P1 |
| 9 | UX States | Loading: ActivityIndicator OK. No error state. No empty state if members = 0. | P2 |
| 10 | Keyboard | No inputs. | OK |
| 11 | Ergonomics | Member item padding: 15 OK. Camera button width/height: 34 — borderline small. | P3 |
| 12 | Navigation | goBack() OK. Screen placed in SocialNavigator — unusual location for family management. | P2 |
| 13 | Polish | familyAvatar hardcoded to Unsplash URL (placeholder never cleaned up). MoreVertical non-functional. Orphaned TabItem/bottomTab code. | P2 |

**Priority fixes:** P1 paddingTop: 35 hack, P1 orphaned code, P1 non-functional MoreVertical.

---

## SCR-010 — FeedScreen
**File:** `features/social/screens/FeedScreen.tsx`
**Route:** `FeedScreen` (Home tab) | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | Family social feed. Main daily-use tab. | OK |
| 2 | Visual Hierarchy | AppHeader → Family card → Create banner → Posts. Header and banner compete. | P2 |
| 3 | Layout | SafeAreaView directly. KAV in Modal isolated from screen. | P2 |
| 4 | Safe Area | SafeAreaView. No SafeAreaProvider at root. Bottom tab nav handled by RN. | P1 SYSTEMIC |
| 5 | Spacing | paddingBottom: 20. Ad-hoc throughout. | P2 SYSTEMIC |
| 6 | Typography | AppHeader for title. Content uses raw Text with ad-hoc sizes. | P2 SYSTEMIC |
| 7 | Color | Local constants. Most content raw hex. | P2 SYSTEMIC |
| 8 | Components | AppHeader OK. PostCard OK. Create-post Modal embedded inline AND CreatePostModal component exists separately — inconsistency. | P2 |
| 9 | UX States | Loading, Error+Retry, Empty (with illustration), Posting progress — all 5 states covered. Best state coverage in app. | OK |
| 10 | Keyboard | KAV only in Modal, not the screen. Correct. | OK |
| 11 | Ergonomics | FAB and create-post button adequate. | P3 |
| 12 | Navigation | ViewListFamily from family card OK. | OK |
| 13 | Polish | Create-post logic partially duplicated (inline modal + CreatePostModal component). | P2 |

**Priority fixes:** P1 safe area (systemic), P2 create-post inconsistency.

---

## SCR-011 — ChatScreen
**File:** `features/chat/screens/ChatScreen.tsx`
**Route:** `ChatScreen` (Chat tab) / `Chat` (Social) | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | AI family chat with streaming, mentions, suggestion chips. | OK |
| 2 | Visual Hierarchy | Header → FlatList → Mention dropdown → Input bar. Correct chat pattern. | OK |
| 3 | Layout | SafeAreaView directly. KAV wraps header + list + input correctly. SuggestionCard and ChatSidebar are outside KAV intentionally. | OK |
| 4 | Safe Area | SafeAreaView. keyboardVerticalOffset: 90 on iOS — hardcoded tab bar offset. Brittle. | P1 |
| 5 | Spacing | paddingVertical: 15, padding: 15. Ad-hoc. | P2 SYSTEMIC |
| 6 | Typography | Header 18/bold. Welcome 22/bold. Reasonable. | P3 |
| 7 | Color | Local constants. Raw hex for #FFF, #333, #F5F5F5. | P2 SYSTEMIC |
| 8 | Components | Feature-local components well-encapsulated. No AppHeader — builds own header. | P2 |
| 9 | UX States | Streaming with TypingIndicator, Error via Alert, Empty welcome, Suggestion card — all covered. | OK |
| 10 | Keyboard | KAV behavior: padding/height. keyboardVerticalOffset: 90 hardcoded for iOS tab bar. FlatList keyboardDismissMode: on-drag OK. | P1 |
| 11 | Ergonomics | Voice + send buttons adequate width/height. Input multiline up to 100px. | OK |
| 12 | Navigation | Dual route. Navigation to SuggestionDetail on AI confirm. | P2 |
| 13 | Polish | Mic button present but unclear if ever functional — no visible state. | P3 |

**Priority fixes:** P1 keyboardVerticalOffset: 90 (hardcoded tab height).

---

## SCR-012 — FamilySchedule
**File:** `features/schedule/screens/FamilySchedule.tsx`
**Route:** `FamilySchedule` (Schedule tab) | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | Month/week calendar + event list + create FAB. High complexity. | OK |
| 2 | Visual Hierarchy | AppHeader → Search → Toggle → Calendar → Event list → FAB. Layered but logical. | OK |
| 3 | Layout | SafeAreaView. FAB position: absolute, bottom: 20, right: 20 — no bottom inset. | P2 |
| 4 | Safe Area | SafeAreaView. FAB absolute position may overlap system gesture bar on Android. | P1 |
| 5 | Spacing | paddingHorizontal: 20, marginBottom: 20. Ad-hoc. | P2 SYSTEMIC |
| 6 | Typography | Month 18/bold. Day labels 12. Date text 12. Event title 14/500. Functional. | P2 SYSTEMIC |
| 7 | Color | Local constants. Calendar grid raw #333, #999. | P2 SYSTEMIC |
| 8 | Components | AppHeader OK. Search, calendar, event detail all inline — large monolithic screen. | P2 |
| 9 | UX States | Loading: ActivityIndicator in event list OK. No error state for fetch failure. Empty per day OK. Search no-results: silent. | P2 |
| 10 | Keyboard | Search input with no KAV. Keyboard may cover content. | P2 |
| 11 | Ergonomics | Date cells width 14.28%, height 40 — calendar standard. FAB 50px OK. | OK |
| 12 | Navigation | FAB to CreateEvent. Event detail inline Modal. | OK |
| 13 | Polish | paddingBottom: 15 duplicated in two scroll variants. Search returns no "no results" message. | P2 |

**Priority fixes:** P1 FAB absolute with no inset, P2 missing error state.

---

## SCR-013 — CreateEventScreen
**File:** `features/schedule/screens/CreateEventScreen.tsx`
**Route:** `CreateEvent` / `SuggestionCreateEvent` | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | Create calendar event: title, date, time, note, participants. Input form. | OK |
| 2 | Visual Hierarchy | AppHeader → ScrollView with labeled sections. Good. | OK |
| 3 | Layout | SafeAreaView. scrollContent paddingBottom: 30. No KAV — keyboard may cover inputs. | P1 |
| 4 | Safe Area | SafeAreaView + paddingBottom: 30 ad-hoc buffer. | P1 SYSTEMIC |
| 5 | Spacing | padding: 16, paddingBottom: 30. buttonRow marginTop: 50 — very large. | P2 SYSTEMIC |
| 6 | Typography | Labels 16/600. Inputs 15. Button 15/bold. Picker title 17/bold. Ad-hoc. | P2 SYSTEMIC |
| 7 | Color | Local constants. Cancel and Save buttons BOTH use same backgroundColor: '#D99B5F' — no visual distinction. | P1 |
| 8 | Components | AppHeader OK. All form fields raw TextInput (no AppInput). Participant picker complex inline modal. | P2 |
| 9 | UX States | Loading OK. Validation alerts OK. showInvalidCharWarning state exists but never rendered in JSX — dead code. | P2 |
| 10 | Keyboard | No KAV. Multiple text inputs. Keyboard covers lower inputs. | P1 |
| 11 | Ergonomics | Picker modal maxHeight: 70% OK. Cancel/Save identical visual style — destructive action not distinct. | P1 |
| 12 | Navigation | goBack() in AppHeader OK. Cancel with Alert confirmation OK. | OK |
| 13 | Polish | showInvalidCharWarning dead state. Cancel/Save identical color (P1). | P2 |

**Priority fixes:** P1 no KAV, P1 cancel/save identical color, P2 dead state.

---

## SCR-014 — LoveTasksScreen
**File:** `features/lovetask/screens/LoveTasksScreen.tsx`
**Route:** `LoveTasks` (LoveTasks tab) | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | List received/created love tasks. FAB to create. | OK |
| 2 | Visual Hierarchy | AppHeader → Banner card → Tab switcher → Task list. Good. | OK |
| 3 | Layout | SafeAreaView. container paddingBottom: 100 — CRITICAL tab bar hack. FAB absolute bottom: 30. Double-bottom: 100px scroll padding + 30px FAB. | P0 |
| 4 | Safe Area | SafeAreaView + paddingBottom: 100. Most egregious safe-area hack in the codebase. | P0 |
| 5 | Spacing | padding: 16, paddingBottom: 100. marginBottom: 20. | P2 SYSTEMIC |
| 6 | Typography | AppHeader for title OK. Banner 18/600. Task 15/bold. From 12. Reasonable. | P3 |
| 7 | Color | Local constants. Status colors (green/orange/pink) semantically correct but raw hex. | P2 SYSTEMIC |
| 8 | Components | AppHeader OK. Task cards, FAB, tabs all inline. | P2 |
| 9 | UX States | Loading, Error+Retry, Empty (with illustration). All 3 covered. | OK |
| 10 | Keyboard | No inputs on list screen. | OK |
| 11 | Ergonomics | Task cards full-width OK. FAB 54px OK. Tab paddingVertical: 10 OK. | OK |
| 12 | Navigation | TaskDetail and CreateLoveTask correctly. | OK |
| 13 | Polish | paddingBottom: 100 deeply broken. minHeight: 400 on task list arbitrary. | P1 |

**Priority fixes:** P0 paddingBottom: 100 (most critical in the app), P0 FAB without inset.

---

## SCR-015 — TaskDetailScreen
**File:** `features/lovetask/screens/TaskDetailScreen.tsx`
**Route:** `TaskDetail` | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | View task detail, complete or share. State-driven CTAs. | OK |
| 2 | Visual Hierarchy | AppHeader → Sender/Recipient card → Detail card → Love message → Reminder → CTA. Good escalation. | OK |
| 3 | Layout | SafeAreaView. container paddingBottom: 40. Bottom sheet modal for options. | P2 |
| 4 | Safe Area | Three separate SafeAreaView wrappers (loading / error / main) — duplicated. | P1 |
| 5 | Spacing | padding: 20, paddingBottom: 40. marginTop: 25/20/25. Ad-hoc. | P2 SYSTEMIC |
| 6 | Typography | Task title 18/bold. roleLabel fontSize: 10 — very small. Names 12/bold. | P2 |
| 7 | Color | Local constants + raw hex. Status colors semantic but raw. | P2 SYSTEMIC |
| 8 | Components | AppHeader, AppButton OK. CreatePostModal cross-feature dependency for share flow. | P2 |
| 9 | UX States | Loading, Error+Retry, and 3 task status states (PENDING/SHARED/COMPLETED) all handled. | OK |
| 10 | Keyboard | No inputs. CreatePostModal has own KAV. | OK |
| 11 | Ergonomics | Complete task requires Alert confirmation — protects destructive action. Share full-width. | OK |
| 12 | Navigation | Options modal → ViewListFamily OK. AppHeader back OK. | OK |
| 13 | Polish | optionSheet marginTop: 'auto' + justifyContent: center — bottom sheet renders centered not at bottom. roleLabel fontSize: 10 too small. | P2 |

**Priority fixes:** P1 triple SafeAreaView pattern, P2 roleLabel too small.

---

## SCR-016 — CreateLoveTaskScreen
**File:** `features/lovetask/screens/CreateLoveTaskScreen.tsx`
**Route:** `CreateLoveTask` / `SuggestionCreateLoveTask` | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | Create and assign a love task. Form with member picker. | OK |
| 2 | Visual Hierarchy | Custom header (logo + Bell + User + Menu) → Form → CTA. Header too busy (3 icons). | P2 |
| 3 | Layout | SafeAreaView. KAV wraps header + scroll. header paddingTop: 35 — hard-coded. | P1 |
| 4 | Safe Area | SafeAreaView + paddingTop: 35 in header. Duplication pattern. | P1 |
| 5 | Spacing | paddingTop: 35, paddingBottom: 40, padding: 15. Ad-hoc. | P2 SYSTEMIC |
| 6 | Typography | Header 18/bold. Labels bold. Input 15. All ad-hoc. | P2 SYSTEMIC |
| 7 | Color | Local constants. required: color '#FF0000' — raw red. Raw #AAA, #CCC. | P2 SYSTEMIC |
| 8 | Components | AppButton OK. No AppHeader — custom header. Bell and Menu icons have NO onPress — non-functional. | P1 |
| 9 | UX States | Loading: ActivityIndicator OK. Validation: Alert OK. No error state for member fetch fail. | P2 |
| 10 | Keyboard | SafeAreaView + KAV(padding/height). Scroll + KAV works. | OK |
| 11 | Ergonomics | Send CTA padding: 12, borderRadius: 20 OK. 3 non-functional icons in header waste tap space. | P2 |
| 12 | Navigation | goBack() on success OK. Options modal → ViewListFamily OK. | OK |
| 13 | Polish | Bell and Menu non-functional. Options modal identical to SCR-015 — shared component candidate. | P2 |

**Priority fixes:** P1 paddingTop: 35 hack, P1 non-functional header icons.

---

## SCR-017 — SuggestionsScreen
**File:** `features/suggestion/screens/SuggestionsScreen.tsx`
**Route:** `SuggestionList` (Suggestions tab) | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | AI suggestion list with filter tabs. | OK |
| 2 | Visual Hierarchy | AppHeader → Filter row → List/Loading/Error/Empty. Clean. | OK |
| 3 | Layout | SafeAreaView. list paddingBottom: 40 — tab bar offset hack. Filter wrapper large paddingVertical: 18. | P2 |
| 4 | Safe Area | SafeAreaView + paddingBottom: 40 — tab bar hack. | P1 |
| 5 | Spacing | paddingBottom: 40, marginHorizontal: 8, padding: 14. Ad-hoc. | P2 SYSTEMIC |
| 6 | Typography | Card title 15/bold. Type 11/600. Description 13. Filter 14/600. Good hierarchy. | P3 |
| 7 | Color | Local constants. Status colors semantic. Border #F5D6B5 — warm consistent. | P2 SYSTEMIC |
| 8 | Components | AppHeader OK. Cards and filter tabs built inline. | P2 |
| 9 | UX States | Loading, Error+Retry, Empty — all 3 covered. | OK |
| 10 | Keyboard | No inputs. | OK |
| 11 | Ergonomics | Filter buttons paddingVertical: 8 OK. Cards full-width OK. | OK |
| 12 | Navigation | SuggestionDetail correct. | OK |
| 13 | Polish | FILTERS array has hardcoded English labels ('All', 'Pending', 'Done') — i18n gap. getFilterLabel uses t() but FILTERS labels don't. | P2 |

**Priority fixes:** P1 paddingBottom: 40 tab bar hack, P2 i18n gap in filter labels.

---

## SCR-018 — SuggestionDetailScreen
**File:** `features/suggestion/screens/SuggestionDetailScreen.tsx`
**Route:** `SuggestionDetail` | **Status:** `NOT_STARTED`

| # | Dimension | Finding | Severity |
|---|---|---|---|
| 1 | Purpose | AI suggestion detail: content, reasoning, action CTA. | OK |
| 2 | Visual Hierarchy | Custom header → Title card → Content → Why → Action. Good flow. | OK |
| 3 | Layout | SafeAreaView for all 3 states. header paddingTop: 35. container paddingBottom: 40. | P1 |
| 4 | Safe Area | SafeAreaView + paddingTop: 35. Three SafeAreaViews for conditional states. | P1 |
| 5 | Spacing | paddingTop: 35, paddingBottom: 15+40, padding: 16. Ad-hoc. | P2 SYSTEMIC |
| 6 | Typography | Header 18/bold. Section title 15/bold. Body 14. Timestamp 12/italic. Good cascade. | P3 |
| 7 | Color | Local constants. Action buttons use type-specific colors (#E91E63, #2196F3) — semantic. | P2 SYSTEMIC |
| 8 | Components | No AppHeader — custom logo header. Sections inline. | P2 |
| 9 | UX States | Loading, Error+Retry, conditional action CTA (not OFFLINE/isDone). All handled. | OK |
| 10 | Keyboard | No inputs. | OK |
| 11 | Ergonomics | Action buttons paddingVertical: 14 OK. Read-only sections not tappable — correct. | OK |
| 12 | Navigation | SuggestionCreateLoveTask / SuggestionCreateEvent with prefill + onSuccess callback. Tightly coupled. | P2 |
| 13 | Polish | paddingBottom: 15 in header AND paddingBottom: 40 in scroll — both present. Triple SafeAreaView redundant. | P2 |

**Priority fixes:** P1 paddingTop: 35 hack, P1 triple SafeAreaView, P2 custom header inconsistency.

---

## Cross-Cutting Summary

| ID | Screen | P0 | P1 | P2 | P3 |
|---|---|---|---|---|---|
| SCR-001 | LoginScreen | 0 | 1 | 4 | 1 |
| SCR-002 | RegisterScreen | 1 | 1 | 5 | 0 |
| SCR-003 | VersionScreen | 0 | 1 | 2 | 1 |
| SCR-004 | SetupProfileScreen | 0 | 2 | 4 | 1 |
| SCR-005 | FamilyStatusScreen | 0 | 2 | 3 | 1 |
| SCR-006 | CreateFamilyScreen | 0 | 3 | 4 | 1 |
| SCR-007 | InviteMembersScreen | 0 | 1 | 4 | 1 |
| SCR-008 | JoinFamilyScreen | 0 | 3 | 3 | 1 |
| SCR-009 | ViewListFamilyScreen | 0 | 4 | 3 | 1 |
| SCR-010 | FeedScreen | 0 | 2 | 4 | 1 |
| SCR-011 | ChatScreen | 0 | 2 | 4 | 1 |
| SCR-012 | FamilySchedule | 0 | 2 | 5 | 1 |
| SCR-013 | CreateEventScreen | 0 | 4 | 3 | 1 |
| SCR-014 | LoveTasksScreen | 2 | 2 | 3 | 1 |
| SCR-015 | TaskDetailScreen | 0 | 2 | 4 | 1 |
| SCR-016 | CreateLoveTaskScreen | 0 | 3 | 4 | 1 |
| SCR-017 | SuggestionsScreen | 0 | 1 | 4 | 1 |
| SCR-018 | SuggestionDetailScreen | 0 | 3 | 3 | 1 |

---

## Systemic Issues (resolve once in Phase 3)

| ID | Issue | Affected Screens | Resolution |
|---|---|---|---|
| SYS-A | No SafeAreaProvider at root | All 18 | Add to App.tsx |
| SYS-B | Hard-coded paddingTop as status bar hack | 8 screens | useSafeAreaInsets().top |
| SYS-C | Hard-coded paddingBottom as tab bar hack | 9 screens | useSafeAreaInsets().bottom |
| SYS-D | No spacing tokens | All 18 | Create theme/spacing.ts |
| SYS-E | No typography tokens | All 18 | Create theme/typography.ts |
| SYS-F | No color semantic tokens | All 18 | Expand theme/colors.ts |
| SYS-G | No border radius tokens | All 18 | Create theme/radius.ts |
| SYS-H | Raw Text instead of AppText | 12 screens | Per-screen in Phase 4 |
| SYS-I | Triple SafeAreaView conditional pattern | SCR-015, 018 | Single wrapper |

---

## Recommended Refactor Order (Phase 4)

1. SCR-010 FeedScreen — Main daily-use feed tab, high visibility
2. SCR-011 ChatScreen — High daily use, streaming chat, KAV offset
3. SCR-012 FamilySchedule — High complexity calendar, FAB position
4. SCR-013 CreateEventScreen — Form with no KAV, cancel/save button distinction
5. SCR-014 LoveTasksScreen — P0 paddingBottom: 100 tab bar hack
6. SCR-015 TaskDetailScreen — State-driven CTAs, triple SafeAreaView cleanup
7. SCR-016 CreateLoveTaskScreen — Non-functional header icons, safe area hack
8. SCR-017 SuggestionsScreen — i18n gap in filter labels, paddingBottom hack
9. SCR-018 SuggestionDetailScreen — Triple SafeAreaView, custom header standardization
10. SCR-001 LoginScreen — Entry point, no scroll with keyboard
11. SCR-002 RegisterScreen — P0 double KAV
12. SCR-003 VersionScreen — Utility screen, lowest risk
13. SCR-004 SetupProfileScreen — paddingBottom: 80, typography hierarchy
14. SCR-005 FamilyStatusScreen — paddingTop: 30, logout-as-back UX clarity
15. SCR-006 CreateFamilyScreen — No KAV, no shared components
16. SCR-007 InviteMembersScreen — Icon library inconsistency
17. SCR-008 JoinFamilyScreen — Absolute back button, Android KAV gap
18. SCR-009 ViewListFamilyScreen — Orphaned code, non-functional MoreVertical button

---

## Phase 2 Completion Checklist

- [x] All 18 screens audited across all 13 dimensions.
- [x] All findings tagged P0–P3.
- [x] Systemic issues identified and grouped.
- [x] Priority refactor order defined.
- [x] No screen has been modified.
- [ ] **User has reviewed this analysis.** ← Waiting

**Phase 2 Status: `READY_FOR_REVIEW`**
