# 🎙️ Voce.AI
### The Future of Spoken Intelligence

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Convex](https://img.shields.io/badge/Convex-Backend-FFBD51?style=for-the-badge)](https://www.convex.dev/)

**Voce.AI** (pronounced *vose dot ai*) is a premium, high-fidelity AI voice conversation platform designed for high-stakes interview practice, language immersion, and cognitive coaching. It moves beyond simple chat interfaces to create a deep, immersive "Neural Canvas" where speech is the primary input and intelligence is the result.

---

## ✨ The Experience

### 🎭 Socratic Dialogue & Persona Experts
Engage with a curated list of AI specialists—from IELTS examiners to technical interviewers—who utilize the Socratic method of questioning to probe your knowledge and elevate your spoken articulation.

### 🧪 Lavender Glass Design System
Voce.AI features a state-of-the-art **Lavender Glass** aesthetic. Built on `oklch` color tokens, it utilizes deep midnight purples and electric lavender accents with 32px backdrop-blur glassmorphism. The interface is meticulously designed to feel alive, responsive, and professional.

### 📊 Real-Time Observability
A full Scope-A observability stack is integrated directly into the platform. Monitor request rates, AI latency, token consumption, and estimated costs in real-time via a dedicated **Grafana** dashboard and **Prometheus** metrics.

---

## 🛠️ Technical Architecture

- **Framwork**: [Next.js 15](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Style Engine**: [Tailwind CSS v4](https://tailwindcss.com/) with OKLCH dynamic tokens
- **Intelligence**: [OpenRouter](https://openrouter.ai/) for high-context LLM switching
- **Acoustics**: [Groq Whisper](https://groq.com/) for near-instant transcription & [ElevenLabs](https://elevenlabs.io/) for high-fidelity vocal synthesis
- **Backend**: [Convex](https://www.convex.dev/) for real-time data synchronization and persistence
- **Telemetry**: Prometheus + Grafana + Docker Compose

---

## 🚀 Quick Start

### 1. Environment Configuration
Create a `.env.local` file with your credentials:

```bash
NEXT_PUBLIC_CONVEX_URL=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=deepseek/deepseek-r1
GROQ_API_KEY=
ELEVENLABS_API_KEY=
METRICS_BEARER_TOKEN=
```

### 2. Local Development
```bash
npm install
npm run dev
```

### 3. Observability Stack
Launch the full containerized environment to access live metrics:
```bash
docker compose up --build
```
- **App**: `http://localhost:3000`
- **Grafana**: `http://localhost:3002` (Login: `admin/admin`)

---

## 📜 Repository Philosophy
Voce.AI is designed for researchers, students, and professionals who demand an elite interface for AI interaction. The codebase is fully containerized, observed, and optimized for low-latency voice feedback loops.

---
© 2026 Voce.AI. Elevate your spoken intelligence.
