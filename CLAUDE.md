# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run start        # Start production server
```

No test framework is configured.

## What This App Is

ConvertYourSite is a Next.js agency website deployed on **Vercel** at https://convertyoursite.vercel.app/, with an AI-powered "Starter" pipeline that converts legacy websites into modern Next.js static sites deployed to GitHub Pages.

## Tech Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript 5**
- **Tailwind CSS v4** (CSS-based config, no tailwind.config) + **MUI 7** (Material UI)
- **OpenAI GPT-4o** for design/code/fix generation
- **Vercel Blob** for persistent project storage across serverless invocations
- **GitHub API** for repo creation, file push (Git Trees API), and Pages deployment
- **Cheerio** for HTML scraping
- **Remotion** for company reel video (separate from pipeline)

## Environment Variables

- `NEXT_PUBLIC_STARTER_PASSWORD` — gate password for /starter
- `OPENAI_API_KEY` — design, code, and fix generation
- `GITHUB_TOKEN` — repo creation, push, Pages deploy (needs `repo` scope)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob persistence

## Architecture

### Corporate Site
Standard pages at `/`, `/services`, `/portfolio`, `/about`, `/contact`, `/estimate`. Components in `src/components/{page}/`. Layout components in `src/components/layout/`. MUI theme in `src/theme/`.

### Starter Pipeline (`/starter`)

The pipeline is the core feature. It converts a client's existing website into a generated Next.js static site:

**10 stages**: Starting → Scraping → Designing → UI/UX (code gen) → Creating Repo → Generating Code → Deploying → QA Validation → Fixes → Complete

**Key flow:**
1. `POST /api/starter/projects` creates project and starts pipeline in background via `after()` (Next.js post-response callback)
2. Pipeline runs sequentially through stages, each updating project state in Vercel Blob
3. Frontend at `src/app/starter/page.tsx` polls `GET /api/starter/projects` every 8s
4. On error, user can retry via `POST /api/starter/projects/[id]/run-pipeline` which rewinds to the failed stage

**Storage pattern:** Each project is a JSON blob at `starter-projects/{id}.json` in Vercel Blob. An in-memory cache (4s TTL) reduces redundant reads. If Blob is unavailable, in-memory cache keeps working within the same function instance.

### Key Libraries (`src/lib/`)

| File | Role |
|------|------|
| `store.ts` | Project CRUD, Blob persistence, in-memory cache |
| `scraper.ts` | Cheerio-based website scraper (up to 10 pages) |
| `design-generator.ts` | GPT-4o → structured `DesignSpec` JSON |
| `code-generator.ts` | GPT-4o → complete Next.js static site files |
| `github-push.ts` | Creates repo, uploads files atomically via Git Trees API |
| `github-deploy.ts` | Enables GitHub Pages, polls for deployment |
| `qa-checker.ts` | Compares original vs deployed (content, nav, images, contact, meta) |
| `fix-generator.ts` | GPT-4o generates fixes from QA failures (up to 3 iterations) |
| `auth.ts` | Cookie-based session for /starter gate |

### API Route Patterns

- Routes use `after()` from `next/server` for background pipeline work
- Pipeline routes set `maxDuration = 300` (5 min timeout)
- Dynamic route params are Promise-based: `params: Promise<{ id: string }>`
- Auth check via `checkSession()` on all starter API routes

### Generated Sites

The AI generates complete Next.js sites with `output: "export"` for static HTML. Uses plain `<img>` tags (not `next/image`), Tailwind CSS v4, App Router. A GitHub Actions workflow (`.github/workflows/deploy.yml`) is injected to handle Pages deployment. Repo naming: `{slugify(clientName)}-site`.
