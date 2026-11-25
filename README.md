# Post Browser: a Claude Ship demo

A small React + TypeScript app that pages through posts from
[JSONPlaceholder](https://jsonplaceholder.typicode.com), behind a sign-in stub.
It exists to show **Claude Ship** working end to end on real pull requests.

```bash
npm ci
npm run dev        # http://localhost:5173 (any username, 8+ char password)
npm run lint && npm run typecheck && npm test
```

## Claude Ship in one picture

```
  you open a PR
       │
       ▼
 ┌─────────────────┐   inline findings +       ┌──────────────────────┐
 │  Code Review    │── "Claude Code Review" ──►│  you, or PR Steward  │
 │  reads the diff │   check                   │  "@claude steward"   │
 └─────────────────┘                           └──────────┬───────────┘
       ▲                                                  │ pushes fix
       │            re-review on every push               │ commits
       └──────────────────────────────────────────────────┘
       │
       ▼ result (pass / fail) feeds the policy
 ┌──────────────────────────────────────────────────────────────────┐
 │  Claude Approvals: "Claude Approvals" check                      │
 │   routine change + review passes  ─► Claude approves, 1 seat     │
 │   src/auth/** (sign-in)           ─► waits for a human reviewer  │
 │   .claude/** (the rules)          ─► two people                  │
 └──────────────────────────────────────────────────────────────────┘
       │
       ▼
  GitHub ruleset: requires "Claude Approvals" + CI (lint, test) ─► merge
```

## Which file drives which agent

| Agent | What it does | Config in this repo |
|---|---|---|
| Code Review | Reviews each PR and posts inline findings and a **Claude Code Review** check | [`REVIEW.md`](REVIEW.md): what to look for, in what order |
| PR Steward | Answers `@claude steward`: fixes failing CI, conflicts and review findings, and pushes commits as `Claude` | [`.claude/skills/steward/SKILL.md`](.claude/skills/steward/SKILL.md): house rules for its fixes |
| Claude Approvals | Decides who must approve each PR and posts the **Claude Approvals** check | `.claude/approvals.yml`: rules by path and by review result |
| CI (GitHub Actions) | Lint, type-check, tests, build | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) |

The org-level switches (turning each agent on and choosing repositories) live
in claude.ai under **Organization settings → Claude Ship**. The files above only
shape what the agents do once they are on.

## Layout

```
src/
  api/client.ts         fetch wrapper for the posts API
  auth/                 sign-in stub (session storage)   ← sensitive path
  components/PostList   list + pagination UI
  hooks/usePosts.ts     data loading with AbortController
  lib/pagination.ts     page math
  config.ts             env-driven settings
```
