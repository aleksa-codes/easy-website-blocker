# AGENTS.md

## Project Purpose

This repository is the WXT-based version of **Easy Website Blocker**.
It blocks configured domains using MV3 Declarative Net Request (DNR), supports per-domain path exceptions, and provides popup/options/blocked pages with React + Tailwind + shadcn UI.

## Stack

- WXT (`wxt.config.ts`) with `srcDir: "src"`
- React 19 + TypeScript
- Tailwind CSS v4 via `@tailwindcss/vite`
- shadcn/ui components
- Bun package manager (`bun.lock`)

## Core Architecture

- Background worker: `src/entrypoints/background.ts`
  - Instantly syncs Chrome DNR dynamic rules directly from storage.
  - Handles history-state SPA navigation fallback blocking.
- Settings & Storage model: `src/lib/storage.ts`
  - `chrome.storage.local`: `rules`
  - `chrome.storage.sync`: `settings`
- Validation & Parsing: `src/lib/url.ts`
- UI entrypoints:
  - `src/entrypoints/popup/*`
  - `src/entrypoints/options/*`
  - `src/entrypoints/blocked/*`

## Data Model

Defined in `src/lib/types.ts`:

- `SiteRule`: `{ domain, addedAt, exceptions[] }`
- `AppSettings`:
  - `isBlockingEnabled`
  - `showSitesInPopup`
  - `showBlockingToggleInPopup`

## Development Rules

1. Keep behavior parity with the current extension unless explicitly changing UX.
2. Preserve domain/path normalization semantics in `src/lib/url.ts`.
3. When editing DNR logic inside `src/entrypoints/background.ts`, verify both:
   - generated redirect/allow rules
   - history-state SPA blocking fallback
4. Prefer `@/` imports (maps to `src/`).
5. Keep dependencies modern and Bun-first.
6. Keep the backend structure minimal without unnecessary object-oriented wrappers or extra services.

## Commands

- `bun run typecheck`
- `bun run build`
- `bun run dev`

Always run `typecheck` + `build` before handing off significant changes.

## shadcn/UI Notes

This repo already has `components.json` configured for `src/assets/tailwind.css`.
When adding new components, use shadcn CLI and keep generated files under `src/components/ui`.

If shadcn CLI framework detection ever fails in WXT, use a temporary `vite.config.ts` workaround, run CLI, then remove the temp file.
