# Voce.AI

Voce.AI is a two-way AI voice conversation platform built for interview practice, language learning, and topic-based discussion. It combines live conversational coaching with summary feedback, room-level usage tracking, and a full Scope A observability stack for demos using Prometheus, Grafana, Docker, and Kubernetes.

## Core Features

- Live AI voice discussion rooms with persona-based experts
- AI-generated feedback summaries for completed sessions
- Convex-backed room persistence and usage telemetry
- Prometheus-style metrics exposed at `/api/metrics`
- Grafana dashboard provisioning for request rate, latency, token usage, and estimated AI cost
- Docker, Docker Compose, Kubernetes, and legacy shell monitoring support

## Tech Stack

- `Next.js 15` with App Router
- `React 19`
- `Tailwind CSS v4`
- `Convex`
- `Stack Auth`
- `OpenRouter`
- `Groq Whisper`
- `ElevenLabs`

## Environment Variables

Create `.env.local` with the values your deployment needs:

```bash
NEXT_PUBLIC_CONVEX_URL=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=deepseek/deepseek-r1
OPENROUTER_INPUT_COST_PER_MILLION=0
OPENROUTER_OUTPUT_COST_PER_MILLION=0
ASSEMBLY_API_KEY=
GROQ_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=JBFqnCBsd6RMkjVDRZzb
METRICS_BEARER_TOKEN=
```

`METRICS_BEARER_TOKEN` is optional but recommended for hosted deployments. If you set it, clients scraping `/api/metrics` must send `Authorization: Bearer <token>`.

## Local Development

Install dependencies and run the app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Check

This project builds successfully with:

```bash
npm run build
```

## Observability

### App Metrics

Prometheus-compatible metrics are available at:

```bash
/api/metrics
```

Tracked metrics include:

- HTTP request count
- HTTP request latency histogram
- AI request count
- AI latency histogram
- AI token consumption
- Estimated AI cost
- Process heap, RSS, and uptime gauges

### Docker Compose

For a local observability demo:

```bash
docker compose up --build
```

Services:

- App: `http://localhost:3000`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3002`

Grafana default credentials:

```bash
admin / admin
```

### Kubernetes

Kubernetes manifests live in [`k8s/`](./k8s). They deploy:

- `voce-app`
- `prometheus`
- `grafana`

Create the `voce-secrets` secret before applying manifests because secrets are intentionally not committed.

### Legacy Monitoring Fallback

For older systems without Prometheus/Grafana, use:

```bash
BASE_URL=http://localhost:3000 scripts/legacy_monitor.sh
```

This writes CSV telemetry into `./legacy-metrics/`.

## Vercel Deployment Notes

This app is ready for Vercel from the application side. Before deploying:

1. Add the environment variables listed above in Vercel.
2. Set `METRICS_BEARER_TOKEN` if `/api/metrics` should not be public.
3. Keep in mind that Prometheus, Grafana, Docker Compose, and Kubernetes are infrastructure/demo assets and are not run by Vercel itself.

For hosted monitoring after Vercel deployment, you have two good options:

- Run Prometheus/Grafana externally and scrape your deployed `/api/metrics`
- Use the legacy monitoring script against the deployed URL

## Repository Notes

- `.handoff/` stores the Universal Handoff Protocol context for AI session continuity.
- Existing secrets are not written into repo files.
- The current repo already has a remote configured; if creating a new private GitHub repo, use a separate remote so the original is preserved.

