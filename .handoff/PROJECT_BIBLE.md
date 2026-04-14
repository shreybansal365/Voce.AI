# Project Bible: Voce.AI

## Overview
Voce.AI is a high-fidelity, two-way AI voice conversational platform designed for academic and professional excellence. It pivots from generic AI assistants to specialized expert personas that engage in active dialogue, including Socratic questioning and high-stakes debating.

## Tech Stack
- **Frontend:** Next.js 16.x (App Router), Tailwind CSS v4, Lucide React icons, Glassmorphism design system
- **Backend/Realtime:** Convex v1.27.5
- **Authentication:** Stack Auth
- **AI Models:** OpenRouter (google/gemini-2.0-flash-001, deepseek/deepseek-r1)
- **Speech Engine:** Web Speech API (Synthesis), ElevenLabs SDK, + Custom API (Transcription)
- **State Management:** React Context (UserContext) + Convex Hooks
- **Observability/Infra:** Prometheus-compatible metrics endpoint, Grafana dashboards, Docker, Docker Compose, Kubernetes manifests, legacy shell-based metrics collector

## File Structure Map
- `/app` — Core application routes
    - `/(main)` — Authenticated experience
        - `/_components` — Shared authenticated layout helpers
        - `/dashboard` — Expert selection and session boarding
        - `/discussion-room` — Live voice interaction environment
        - `/view-summery` — Performance analysis and AI assessment reports
    - `/api` — AI, speech, transcription, and token-related route handlers
    - `/handler` — Stack Auth route handling
- `/convex` — Database schema, mutations, and queries
- `/k8s` — Kubernetes manifests for app, Prometheus, and Grafana
- `/components` — Shared UI primitives
- `/lib` — Utility helpers
- `/monitoring` — Prometheus scrape config and Grafana provisioning/dashboard files
- `/scripts` — Operational helper scripts including legacy monitoring fallback
- `/services` — Shared logic
    - `Options.jsx` — Source of truth for Expert personas, scripts, and prompts
    - `GlobalServices.jsx` — AI model request wrappers
- `/public` — Static assets (Personas, Avatars)
- `/stack` — Stack Auth generated/config files
- `/.handoff` — UHP Protocol documentation

## Architecture Details
- **Voice Logic:** Uses a "Strict First" gender-locked picker to ensure Mat (Male) and Joanna/Sallie (Female) maintain consistent identities.
- **AI Pipeline:** Responses are cleaned of internal `<think>` tags (from DeepSeek) before being rendered or spoken.
- **Database:** `DiscussionRoom` table tracks topics, expert names, and full conversation summaries.
- **Scaling Telemetry:** `DiscussionRoom` now also stores cumulative `usageStats` so each room can track request counts, estimated token volume, estimated spend, and last model used.
- **Metrics Export:** The app exposes Prometheus-format telemetry at `/api/metrics`, with optional bearer-token protection via `METRICS_BEARER_TOKEN`.
- **Dashboards:** Grafana is provisioned automatically with a Voce overview dashboard for request rate, latency, AI token flow, and estimated cost.
- **Docker Notes:** The Dockerized Next app runs as a non-root user; the image ensures `/app/.next/cache` is writable to avoid runtime `EACCES` crashes. Docker Compose uses `.env.local` via `env_file` and maps the app to host port `3001`.

## Key Decisions
- **[Two-Way Pivot]:** Removed passive features (Meditation) in favor of active engagement (Socratic Seminar/Debate Arena) to align with academic presentation requirements. — To emphasize interactive intelligence.
- **[DeepSeek R1 Integration]:** Refactored API routes to handle internal reasoning tags. — Required because modern reasoning models output internal thoughts that break standard JSON parsing.
- **[Strict Voice Locking]:** Implemented priority-based voice scanning for "Samantha/Alex" keywords. — Resolves browser inconsistency where male/female voices would swap randomly.
- **[Voice Upgrade Path]:** Kept ElevenLabs installed alongside browser synthesis. — Preserves a higher-fidelity upgrade path without blocking the current presentation-ready flow.
- **[Room-Level Usage Tracking]:** AI usage is estimated at the Next.js API layer and persisted per discussion room in Convex. — Gives the team model-scaling visibility without changing the live conversational UX.
- **[Zero-Dependency Metrics]:** Implemented the `/api/metrics` exporter without adding a Prometheus library dependency. — Avoids install/network blockers and keeps Vercel deployment simpler.
- **[Optional Metrics Auth]:** Secured the metrics endpoint with an optional bearer token. — Prevents accidental public exposure of internal telemetry on hosted deployments like Vercel.
- **[Non-Root Container Stability]:** Kept non-root runtime and explicitly fixed Next cache permissions. — Prevents intermittent runtime failures that surfaced as UI “Connection error”.

## How to Run
```bash
npm install
npm run dev
npx convex dev
```
