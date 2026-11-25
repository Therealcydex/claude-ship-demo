---
name: steward
description: House rules for PR Steward in this repository
user-invocable: false
disable-model-invocation: true
---

- Work on failing checks, merge conflicts, and Important findings from Code Review.
- Make the smallest change that fixes the problem. Don't refactor, rename or reformat code you were not asked to touch.
- Every logic fix gets a unit test next to the code (`*.test.ts` / `*.test.tsx`) that fails without the fix. Cover the edge case that caused the bug.
- Never commit secrets, tokens or keys, real or fake. When a finding is a hardcoded value, read it from `import.meta.env` (`VITE_*`) instead and leave no fallback value in source.
- Don't touch `.claude/`, `REVIEW.md`, `.github/` or `package-lock.json` unless a finding is about them. Regenerate `package-lock.json` with `npm install`; don't edit it directly.
- Run `npm run lint`, `npm run typecheck` and `npm test` before you push. If Node or npm is missing in your environment, push the fix and rely on the `lint` and `test` CI checks instead. Read their logs if they fail.
- One commit per finding, with a message that says what was fixed.
- Leave comments from human reviewers to the author.
