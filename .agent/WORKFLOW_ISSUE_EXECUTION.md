# Issue-Driven Engineering Workflow

This workflow defines the operational protocol for developing features and resolving bugs directly from GitHub Issues in `pnv-familier/mobile`.

---

## 1. Operating Rules & Branching Strategy

- **Base Branch**: `dev` (unless otherwise requested). Ensure `dev` is up to date before branching.
- **Branch Naming**:
  - Bug fixes: `fix/<issue-number>-<short-description>` (e.g. `fix/54-login-session-expiration`)
  - Enhancements/Features: `feature/<issue-number>-<short-description>` (e.g. `feature/52-event-time-picker`)
- **Ignored Issues**: Issue `#44` (AI voice chat) is skipped as instructed.

---

## 2. Execution Protocol per Issue

For every target issue:

### Step 1: Issue Analysis & Exploration
1. Fetch full issue details:
   ```bash
   gh issue view <issue-number> --json title,body,labels,comments
   ```
2. Locate and inspect the relevant codebase files.

### Step 2: Clarification & Alignment
- If any requirements are ambiguous, have edge cases, or offer alternative UX/technical solutions:
  - Ask targeted questions to clarify intent.
- Present a concise **Implementation Plan** covering:
  - Scope and changes
  - Affected components / files
  - Verification & testing plan

### Step 3: Branch Checkout & Implementation
1. Checkout and update base:
   ```bash
   git checkout dev && git pull origin dev
   ```
2. Create feature branch:
   ```bash
   git checkout -b <branch-name>
   ```
3. Implement the changes adhering to design system rules, dynamic safe-area insets, semantic tokens, and error handling standards.

### Step 4: Verification & Quality Gate
1. Run linting / TypeScript type checks:
   ```bash
   npm run lint # or tsc / relevant project scripts
   ```
2. Verify code syntax and dependencies.

### Step 5: Commit, Push & Pull Request
1. Commit changes with standard conventional commit message:
   ```bash
   git add <files>
   git commit -m "<type>(<scope>): <summary> (ref #<issue-number>)"
   ```
2. Push branch to origin:
   ```bash
   git push -u origin <branch-name>
   ```
3. Create Pull Request using `gh pr create`:
   - Title: Standardized PR title.
   - Body: Summary of changes, motivation, test steps, and `Closes #<issue-number>`.
   - Base branch: `dev`.
