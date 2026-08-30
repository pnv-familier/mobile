# Familier Mobile UI Design System & Coding Rules

> **Important**: These rules are mandatory for all developers and AI coding agents working on the Familier mobile application. All UI components, screens, and features must follow these guidelines.

---

## 1. Design Tokens (Single Source of Truth)

All design values must come from `theme/`. **Never use raw hex colors, arbitrary spacing, or ad-hoc font sizes in screen or component styles.**

### 🎨 Colors (`theme/colors.ts`)

Always import and use semantic tokens:
```ts
import { colors } from '@/theme';
```

- **Background & Surfaces:**
  - `colors.background`: `#FAF7F2` (Warm default app background)
  - `colors.backgroundSecondary`: `#FFF4E6`
  - `colors.surface`: `#FFFFFF` (Card and modal surfaces)
  - `colors.surfaceSecondary`: `#F5F2EC` (Input backgrounds, secondary chips)
  - `colors.surfaceTertiary`: `rgba(212, 160, 86, 0.08)`
- **Brand / Primary:**
  - `colors.primary`: `#D4A056` (Main brand color)
  - `colors.primaryPressed`: `#B8860B`
  - `colors.primarySoft`: `#FDF2E3` (Tinted badges, soft active chips)
  - `colors.primaryWarm`: `#E39A5A`
- **Text:**
  - `colors.textPrimary`: `#4A3428` (High contrast primary text)
  - `colors.textSecondary`: `#8D5B39` (Subtitles, descriptions, captions)
  - `colors.textMuted`: `#9E9E9E` (Placeholders, inactive items)
  - `colors.textLight`: `#FFFFFF`
- **Status:**
  - `colors.success`, `colors.warning`, `colors.error`, `colors.info`, `colors.love`
- **Borders:**
  - `colors.borderLight`: `#F5F0E8` (Subtle card borders)
  - `colors.border`: `#EDE6DA`
  - `colors.borderMedium`: `#DFD6C6`

---

### 📏 Spacing (`theme/spacing.ts`)

```ts
import { spacing } from '@/theme';

// xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48
```
- Related elements should have small gaps (`spacing.xs` or `spacing.sm`).
- Unrelated sections should have larger gaps (`spacing.lg` or `spacing.xl`).

---

### 🔤 Typography (`theme/typography.ts` & `AppText`)

Prefer `<AppText>` with predefined variants:
```tsx
<AppText variant="heading1" color="brand">Main Title</AppText>
<AppText variant="bodySmall" color="secondary">Supporting description</AppText>
```

Available Variants:
- `display` (32px, bold)
- `heading1` (24px, bold)
- `heading2` (20px, semi-bold)
- `heading3` (18px, semi-bold)
- `body` / `bodyBold` (16px)
- `bodySmall` / `bodySmallBold` (14px)
- `caption` / `captionBold` (12px)
- `tiny` (11px)

---

### 🔲 Radius & Shadows (`theme/radius.ts`, `theme/shadows.ts`)

- `radius.sm`: 8px
- `radius.md`: 12px
- `radius.lg`: 16px
- `radius.xl`: 20px
- `radius.xxl`: 24px
- `radius.full`: 999px (Pills & avatars)
- `shadows.sm`, `shadows.md`, `shadows.lg`

---

## 2. Safe Area & Layout Inset Rules

- **Never** hardcode `paddingTop` (e.g. `paddingTop: 35`) or `paddingBottom` (e.g. `paddingBottom: 80`).
- Every screen must be wrapped in `<AppScreen>`:
  ```tsx
  <AppScreen edges={['top']} backgroundColor={colors.background}>
    {/* Screen content */}
  </AppScreen>
  ```
- Screens inside bottom tab navigators should configure tab safe insets dynamically without stacking duplicate padding.

---

## 3. Header & Navigation Standard

Use `<AppHeader>` for screens requiring a navigation top bar:
```tsx
<AppHeader
  title="Screen Title"
  navigation={navigation}
  showBack={true} // renders back chevron
  showNotification={isAuthenticated} // auto-hidden if unauthenticated
  showProfile={isAuthenticated}
/>
```

---

## 4. Action Buttons & Mobile Ergonomics

1. **Pinned Bottom Footer Pattern:**
   Primary action CTAs (Save, Next, Continue, Create) must be pinned to the bottom of the screen outside the scroll area for easy one-thumb reachability:
   ```tsx
   <View style={styles.bottomFooter}>
     <AppButton
       title="Save"
       variant="primary"
       size="md"
       onPress={handleSave}
       disabled={!isValid || loading}
       loading={loading}
     />
   </View>
   ```
   **Footer Styling Standard:**
   ```ts
   bottomFooter: {
     paddingHorizontal: spacing.md,
     paddingVertical: spacing.md,
     backgroundColor: colors.surface,
     borderTopWidth: 1,
     borderTopColor: colors.borderLight,
     ...shadows.sm,
   }
   ```

2. **Standardized Button Sizes & Variants:**
   - Sizes: `sm` (34px height), `md` (40px height), `lg` (46px height).
   - Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`.
   - Disabled states must remain clearly legible (soft brand tint with visible contrast).

---

## 5. Keyboard Safety

- Forms must be wrapped with `KeyboardAvoidingView` + `ScrollView` (`keyboardShouldPersistTaps="handled"`):
  ```tsx
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    style={{ flex: 1 }}
  >
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Inputs */}
    </ScrollView>
    {/* Pinned Bottom CTA */}
  </KeyboardAvoidingView>
  ```
- Never nest duplicate `KeyboardAvoidingView` components.

---

## 6. Icons Standard

- Standardize exclusively on `lucide-react-native`.
- Do not import from `@expo/vector-icons` (Ionicons, MaterialIcons, Feather) in new or refactored screens.

---

## 7. UX States Checklist

Every screen implementation must handle:
1. **Loading State**: Display `ActivityIndicator` (using `colors.primary`) or skeleton.
2. **Empty State**: Use `<EmptyState>` component with image, title, and actionable CTA.
3. **Validation & Errors**: Show inline helper text using `colors.error`.
