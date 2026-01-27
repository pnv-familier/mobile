# 📱 Mobile Coding Guideline (React Native + Expo)

This document defines the **mandatory structure and workflow** for the mobile app  
(**React Native + Expo + TypeScript**).

All team members must follow this guideline.

---

## 1. Core Principles

### Feature-Based Architecture
- Code is organized by **feature**, not by layer.
- A feature owns:
  - screens
  - components
  - hooks
  - API calls
  - state
  - types

> A feature should feel like a **mini app**.

### Responsibility Rules
| Concern | Location |
|------|------|
| UI | `screens`, `components` |
| Logic / async | `hooks` |
| API calls | `api` |
| State | `store` |
| Types | `types.ts` |

**Rule:** Screens must stay **dumb**.

---

## 2. Project Structure
```
src/
├── features/
├── navigation/
├── components/
├── hooks/
├── api/
├── store/
├── theme/
└── utils/
```

---

## 3. Feature Structure (MANDATORY)
```
features/
└── <feature-name>/
├── screens/
├── components/
├── hooks/
├── api/
├── store/
├── types.ts
└── index.ts
```

Example:
```
features/chat/
├── screens/ChatScreen.tsx
├── components/MessageBubble.tsx
├── hooks/useChat.ts
├── api/chat.api.ts
├── store/chat.slice.ts
├── types.ts
└── index.ts
```

---

## 4. Folder Rules (Strict)

### `screens/`
- Navigation entry points
- Compose UI + hooks

❌ No API calls  
❌ No business logic

---

### `components/`
- Feature-specific UI only
- Stateless when possible

If reused across features → move to `src/components/`

---

### `hooks/`
- Feature logic
- API calls
- Loading / error handling
- State updates

Screens must rely on hooks for logic.

---

### `api/`
- Backend calls only
- One API file per feature
- ❌ No third-party APIs (Gemini stays on backend)

---

### `store/`
- Feature-owned state
- Root store only combines slices
- ❌ No cross-feature state access

---

### `types.ts`
- Request / response models
- Feature state types

❌ No imports from other features  
❌ No global types

---

### `index.ts`
- Feature public API
- Prevent deep imports

---

## 5. Shared Folders

- `/components` → reusable UI only
- `/hooks` → reusable logic only
- `/api` → axios instance & interceptors only

Keep shared folders **small**.

---

## 6. Task Implementation Flow

Follow **in order**:

1. Identify feature (`features/<name>`)
2. Define types (`types.ts`)
3. Add API call (`api/`)
4. Implement hook (`hooks/`)
5. Build components (`components/`)
6. Wire screen (`screens/`)
7. Export from `index.ts`

---

## 7. Naming Rules

- Feature folder: `kebab-case`
- Screen: `XxxScreen`
- Hook: `useXxx`
- API file: `<feature>.api.ts`
- Store: `<feature>.slice.ts`

---

## 8. Forbidden Patterns

❌ API calls in screens  
❌ Logic in components  
❌ Cross-feature imports  
❌ Large shared folders  
❌ Direct Gemini / third-party calls  

---

## 9. Definition of Done

Before marking a task done:
- Feature structure respected
- Logic in hooks
- Screen is clean
- Types defined first
- No debug or unused code

---

## Final Rule

> If someone cannot understand your feature in **5 minutes**, it is not done.

**Clarity > Cleverness.**