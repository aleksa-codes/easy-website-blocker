# Easy Website Blocker (WXT)

> **April 2026 Update:** Migrated from CRXJS and improved with a cleaner architecture and modern UI stack.

A Chrome extension that blocks distracting websites using MV3 Declarative Net Request rules, with per-domain path exceptions and a polished popup/options/blocked-page experience.

[![WXT](https://img.shields.io/badge/WXT-MV3-0ea5e9)](https://wxt.dev/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-Package_Manager-f9f1e1)](https://bun.sh/)

## Features

- **Fast MV3 blocking:** Uses Chrome Declarative Net Request dynamic rules for reliable domain-level blocking.
- **Per-site exceptions:** Allow specific paths (for example docs pages) while keeping the main domain blocked.
- **Live settings sync:** Rule and toggle changes are persisted in Chrome storage and reflected immediately.
- **SPA fallback protection:** Handles history-state navigation in single-page apps so blocked pages still redirect.
- **Three dedicated surfaces:** Popup for quick control, Options for full management, and a custom Blocked page.
- **Modern UI stack:** React 19 + Tailwind v4 + shadcn/ui primitives.

## Quick Start

```bash
# Install dependencies
bun install

# Start extension dev mode
bun run dev
```

Then load the extension from `.output/chrome-mv3` in `chrome://extensions` (Developer Mode -> Load unpacked).

## Scripts

| Command                 | Description                       |
| ----------------------- | --------------------------------- |
| `bun run dev`           | Run extension in dev mode         |
| `bun run dev:firefox`   | Run dev mode for Firefox          |
| `bun run build`         | Build production bundle           |
| `bun run build:firefox` | Build production bundle (Firefox) |
| `bun run zip`           | Create production zip             |
| `bun run zip:firefox`   | Create production zip (Firefox)   |
| `bun run typecheck`     | Run TypeScript checks             |
| `bun run format`        | Format code with Prettier         |

## Project Structure

```txt
src/
├─ entrypoints/         # background + popup/options/blocked entry files
├─ features/            # screen-level React features
├─ components/          # reusable forms, lists, and UI wrappers
├─ components/ui/       # shadcn-style UI primitives
├─ lib/                 # storage, types, URL normalization/validation
└─ assets/              # global Tailwind stylesheet
```

## How Blocking Works

1. Rules are stored in `chrome.storage.local`.
2. Settings are stored in `chrome.storage.sync`.
3. Background worker maps saved rules to DNR dynamic allow/redirect rules.
4. Navigation to blocked URLs is redirected to the bundled blocked page.
5. SPA history updates are checked as a fallback to keep blocking consistent.

## Tech Stack

- [WXT](https://wxt.dev/) for MV3 extension build tooling
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Bun](https://bun.sh/) for package management and scripts

## Load In Chrome

1. Run `bun run build`.
2. Open `chrome://extensions`.
3. Enable Developer Mode.
4. Click **Load unpacked**.
5. Select `.output/chrome-mv3`.

## License

MIT License. See [LICENSE](LICENSE) for details.
