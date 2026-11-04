<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

> `next dev` rewrites only the text between the markers above and preserves everything else in this file. Edit outside the block, not inside it.

## Commands

Single Next.js app — no workspaces, no monorepo tooling. Run everything from the repo root.

- **This machine's PowerShell blocks `npm.ps1`/`npx.ps1` (execution policy). Use `npm.cmd` / `npx.cmd`** — e.g. `npm.cmd run dev`. This fails in the shell otherwise.
- Dev server: `npm.cmd run dev`
- Lint: `npm.cmd run lint` (ESLint 9 flat config in `eslint.config.mjs`). Single file: `npx.cmd eslint src/app/page.tsx`
- Typecheck: `npx.cmd tsc --noEmit` — there is no `typecheck` script.
- Verify in order: **lint → `tsc --noEmit` → `npm.cmd run build`**. Next 16 removed `next lint` and `next build` no longer lints, so lint only runs via the npm script.
- **No test runner exists** (no test script, config, or test files). lint + tsc + build is the whole verification loop.
- Fresh clone: run `npm.cmd run build` or `npm.cmd run dev` once before typechecking. The global `LayoutProps<"/">` / `PageProps` types are generated into `.next/*/types` (referenced by the gitignored `next-env.d.ts`), so `tsc` fails without them.
- No formatter and no CI (`.github/` absent) are configured; ESLint is the only static check.

### Pre-existing lint failures

`npm.cmd run lint` exits 1 today on problems unrelated to new work — don't assume you caused them:

- `react-hooks/set-state-in-effect` errors in `src/components/ui/carousel.tsx:98` and `src/hooks/use-mobile.ts:14` (shadcn-generated files)
- unused `Image` import warning in `src/app/page.tsx`

## Architecture and stack

- Next.js 16.4.4 App Router, React 19.3, TS `strict`. All source under `src/`; routes in `src/app/` (root `layout.tsx` + `page.tsx`, which is currently an empty WIP shell). Alias `@/*` → `./src/*`.
- **`cacheComponents: true` is on** in `next.config.ts` — this changes how pages are written: route segment configs (`dynamic`, `revalidate`, `fetchCache`) are replaced by `use cache` / `cacheLife`; uncached data must be wrapped in `<Suspense>`; and sync IO during prerender (`Date.now()`, `Math.random()`, `crypto.randomUUID()`) is a hard build error. See `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`.
- Also enabled: React Compiler (`reactCompiler: true`) and Turbopack with a `@tailwindcss/turbopack` loader rule for CSS. Don't re-add a Tailwind PostCSS config — there is none.
- **Tailwind v4 is CSS-first**: no `tailwind.config.*`; theme and shadcn CSS variables live in `src/app/globals.css` (`@import "tailwindcss"`, `@theme inline`).
- **shadcn/ui uses style `base-nova` built on `@base-ui/react`, not Radix** (`components.json`). Primitives in `src/components/ui/*` are CLI-generated — prefer regenerating/updating over hand-editing. The CLI ships locally: `npm.cmd exec shadcn -- add <component>`.
- `cn` is imported from the `cn` package (`import { cn } from "cn"`); `src/lib/utils.ts` only re-exports it.
- Code highlighting is a lazy shiki instance with a fixed language allowlist in `src/lib/highlighter.tsx` (used by `src/hooks/use-highlighted-code.ts`) — add new languages there.
