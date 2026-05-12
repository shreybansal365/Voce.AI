# Project Bible — Voce.AI
> Last Updated: 2026-04-19 | Version: 1.0.0 (Universe-Class Graduation)

## Project Overview
**Voce.AI** is a high-fidelity, neural-audio conversational intelligence platform designed for cognitive coaching and professional interview mastery. Conceived by **Shrey Bansal**, it synthesizes Socratic dialectics with near-zero latency vocal feedback loops within a bespoke **Lavender Glass** workspace.

## Tech Stack
- **Framework**: Next.js 16.2.3 (App Router), React 19.1.0 (Concurrent Mode)
- **Styling**: Tailwind CSS v4 (OKLCH color space), Glassmorphism utilities.
- **Backend (Real-Time)**: Convex 1.27.5 (Reactive persistence).
- **Intelligence Hub**: OpenRouter (LLM routing: Gemini 2.0 Flash, Llama 3).
- **Audio Processing**: Groq (Whisper for STT), ElevenLabs (Neural Vocal Synthesis).
- **Identity & Security**: Stack Auth (with production domain white-listing).
- **Observability**: Scope-A Stack (Prometheus 2.51.1, Grafana 10.4.2).
- **Infrastructure**: Docker Compose, Kubernetes (K8s) manifests.

## Core Architecture
Voce.AI orchestrates a high-speed audio-to-logic pipeline:
1.  **Frontend**: React 19 UI captures audio via `RecordRTC`.
2.  **Transcription**: Raw audio is streamed to **Groq Whisper** for sub-second text conversion.
3.  **Inference**: Transcribed packets are routed through **Next.js Server Actions** to **OpenRouter**.
4.  **Synthesis**: AI reasoning is converted back to audio via **ElevenLabs API**.
5.  **Persistence**: Every exchange is atomically stored in **Convex** for real-time reporting.

## Design System: "Lavender Glass"
- **Base Neutral**: `oklch(0.12 0.03 285)` (Deep Midnight Purple).
- **Glass Panel**: `oklch(0.12 0.03 285 / 85%)` with `32px backdrop-filter`.
- **Primary Accent**: `oklch(0.65 0.15 285)` (Vibrant Lavender).
- **Motion**: 300ms-400ms cubic-bezier kinetic transitions for all UI interactions.

## Key Decisions & Artifacts
- **[Resilience Patch]:** Isolated `UpdateUsageStats` in a try/catch block within the report generation flow to prevent non-critical telemetry failures from blocking the user's result delivery.
- **[Lavender Centering]:** Replaced CSS transform-based centering in `DialogContent` with a `grid place-items-center` layout to resolve backdrop-blur rendering bugs on high-refresh-rate displays.
- **[Immaculate Branding]:** Upgraded README to a typographic masterpiece (version 4.0) that prioritizes narrative authority over generic visual placeholders.

## Directory Map
- `app/`: Next.js 15 App Router (Main logic, Discussion Rooms, Dashboard).
- `convex/`: Schema and real-time functions for the project.
- `components/`: UI components (including Radix-based the glassmorphic Dialog).
- `monitoring/`: Prometheus and Grafana configuration.
- `stack/`: Identity and authentication orchestration.
- `scripts/`: Deployment and maintenance utilities.
- `.handoff/`: Universal Handoff Protocol core files.

## Local Development
```bash
docker compose up -d --build
# Access UI at http://localhost:3000
# Access Metrics at http://localhost:3002
```

## Production Deployment
- **Platform**: Vercel (Auto-deployed via GitHub push).
- **Domain**: `https://voce-ai.vercel.app`.
- **Requirement**: `Trusted Domains` must be updated in Stack Auth dashboard for every new Vercel production URL.

---
© 2026 Voce.AI. **Perfecting the Sound of Intelligence.**
