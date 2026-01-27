# 🐻 Zustand Store Guideline (Mobile App)

This document defines the **standard conventions** for using **Zustand** as the state management solution in the mobile app.

All feature state must follow this guideline.

---

## 1. Core Principle

> Zustand store = **shared feature state**, not UI state.

Stores should contain **data that must be shared across screens** or represent **server data**.

---

## 2. Store Location (MANDATORY)

Each feature must have its own store.

```
src/features/<feature-name>/store/<feature>.store.ts
```

### Examples

```
features/auth/store/auth.store.ts
features/chat/store/chat.store.ts
features/family/store/family.store.ts
```

❌ Do NOT create one global store for the whole app.

---

## 3. Store Structure (STANDARD PATTERN)

Each store must contain:

1. **State**
2. **Actions (functions that update state)**

### Template

```ts
import { create } from "zustand";

type FeatureState = {
  data: SomeType | null;
  isLoading: boolean;
  error: string | null;

  fetchData: () => Promise<void>;
  reset: () => void;
};

export const useFeatureStore = create<FeatureState>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchData: async () => {
    try {
      set({ isLoading: true, error: null });
      // call API here
      set({ data: result, isLoading: false });
    } catch (e) {
      set({ error: "Something went wrong", isLoading: false });
    }
  },

  reset: () => set({ data: null, error: null }),
}));
```

---

## 4. What SHOULD Be in a Store

✅ Server data shared across screens  
✅ Authentication user info  
✅ Chat messages  
✅ Feature-level loading state  
✅ Feature-level error state

---

## 5. What MUST NOT Be in a Store

❌ Text input values  
❌ Modal open/close state  
❌ Form field temporary values  
❌ One-time UI toggles

These belong in local component state (useState).

---

## 6. Async Logic Rules

- API calls are allowed inside store actions
- Always manage `isLoading` and `error`
- Do not call third-party APIs directly (always use backend)

---

## 7. Naming Conventions

| Item       | Convention                                  |
| ---------- | ------------------------------------------- |
| Store file | `<feature>.store.ts`                        |
| Hook name  | `use<Feature>Store`                         |
| Actions    | verb-based (`fetchMessages`, `sendMessage`) |
| State      | nouns (`messages`, `user`, `isLoading`)     |

---

## 8. Using Store in Components

Always select only the state you need:

```ts
const messages = useChatStore((s) => s.messages);
const sendMessage = useChatStore((s) => s.sendMessage);
```

❌ Do NOT do this:

```ts
const store = useChatStore();
```

This causes unnecessary re-renders.

---

## 9. Store vs Hook Responsibility

| Logic Type                        | Store | Hook |
| --------------------------------- | ----- | ---- |
| Persisted/shared data             | ✅    | ❌   |
| API calls that update global data | ✅    | ❌   |
| UI orchestration                  | ❌    | ✅   |
| Combining multiple stores         | ❌    | ✅   |

Hooks coordinate UI. Stores hold data.

---

## 10. Cross-Feature Rules

- A feature should not modify another feature's store directly
- If data is needed across features, use API or shared context

---

## 11. Definition of Done (State Management)

Before finishing a task:

- [ ] Store follows template
- [ ] No UI-only state in store
- [ ] Async actions handle loading & error
- [ ] Components only select needed fields

---

## Final Rule

If removing a screen breaks the store design, the state is in the wrong place.
