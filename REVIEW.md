# Review guidelines

This is a small React 19 + TypeScript app built with Vite and tested with Vitest.
When you review a pull request here, report problems in this order.

## 1. Correctness
- Boundary conditions in ranges, loops and page math.
- Code that assumes its input is present and well formed, especially user input.
- Paths through the code where a value can be `undefined` or `null`, even when
  TypeScript accepts it.

## 2. Lifecycle and async
- Every `useEffect` that subscribes, listens, starts a timer or opens a request
  must undo it in its cleanup function.
- Async work started by a component must not update state after the component
  unmounts or after newer work has replaced it. Prefer `AbortController` or an
  "ignore" flag, as `src/hooks/usePosts.ts` does.
- Effects should list every dependency they read (`react-hooks/exhaustive-deps`).

## 3. Secrets and configuration
- No keys, tokens or passwords in source, tests or fixtures, even "temporary" or
  "demo" ones. Configuration comes from `import.meta.env` (`VITE_*`) with no
  secret fallback.
- Anything under `src/auth/` handles sign-in: look closely at what is stored,
  where, and for how long.

## 4. Tests
- A logic change needs a test that would have failed before the change,
  including the edge case that motivated it.
- Tests must not call the network; mock `fetch`.

## Not worth a comment
- Formatting and import order (ESLint covers these).
- Copy and wording changes, unless the text is wrong or misleading.
