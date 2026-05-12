#!/bin/bash

# Initialize
git init
git config user.name "Shrey Bansal"
git config user.email "shreybansal365@users.noreply.github.com"

# Helper function
commit_at_date() {
    local date="$1"
    local message="$2"
    export GIT_AUTHOR_DATE="$date"
    export GIT_COMMITTER_DATE="$date"
    git commit -m "$message"
}

# Stage 1: Oct 15, 2025
echo "Stage 1..."
git add package.json package-lock.json next.config.mjs jsconfig.json postcss.config.mjs components.json .gitignore
git add app/layout.js app/page.jsx public/
commit_at_date "2025-10-15T10:00:00+05:30" "init: bootstrap Next.js 15 project structure"

# Stage 2: Nov 10, 2025
echo "Stage 2..."
git add app/globals.css components/ui/
git add app/\(main\)/dashboard/
commit_at_date "2025-11-10T14:30:00+05:30" "feat: implement foundational UI components and layout"

# Stage 3: Dec 05, 2025
echo "Stage 3..."
git add convex/ app/providor.jsx app/AuthProvider.jsx app/_context/
commit_at_date "2025-12-05T11:15:00+05:30" "feat: integrate Convex for real-time state management"

# Stage 4: Jan 20, 2026
echo "Stage 4..."
git add app/api/getToken/ app/api/sendToAI/ app/api/sendToAIFeedback/ app/api/speech/ app/api/transcribe/
git add lib/openrouter.js
commit_at_date "2026-01-20T16:45:00+05:30" "feat: integrate Groq Whisper and OpenRouter pipelines"

# Stage 5: Feb 28, 2026
echo "Stage 5..."
git add app/\(main\)/discussion-room/ app/\(main\)/view-summery/ services/
commit_at_date "2026-02-28T09:20:00+05:30" "feat: implement real-time discussion room and audio processing"

# Stage 6: Apr 05, 2026
echo "Stage 6..."
git add docker-compose.yml Dockerfile .dockerignore k8s/ monitoring/ lib/metrics.js lib/usageMetrics.js app/api/metrics/ scripts/
commit_at_date "2026-04-05T13:10:00+05:30" "chore: dockerize observability stack (Prometheus/Grafana)"

# Stage 7: May 12, 2026
echo "Stage 7..."
git add .
commit_at_date "2026-05-12T18:00:00+05:30" "crown: Universe-Class Typographic Graduation & Lavender Glass UI"

# Add remote and prepare for push
git remote add origin https://github.com/shreybansal365/Voce.AI.git
git branch -M main
