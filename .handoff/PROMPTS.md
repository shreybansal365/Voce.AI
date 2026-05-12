# How to Use the Universal Handoff Protocol
Save this in Apple Notes. This is the only thing you ever need.

---

## When Leaving Any AI

Say:

    rate limits dying, prepare for handoff

Wait for the verification receipt. Then switch.

---

## When You Want to Save Progress Without Leaving

Say:

    checkpoint

The AI will save your current progress to the handoff files.
Like a quicksave — you're not leaving, just creating a safety net.

---

## When Opening Any AI — Existing Project (has .handoff/ already)

Paste this:

    Read the .handoff/ directory in my project root. Start with README.md,
    then PROJECT_BIBLE.md, ACTIVE_SESSION.md, and SESSION_LOG.md. After
    reading, reply with a "UHP loaded" validation proof showing: project
    name, current state, next task, session count, and last AI model.
    Then continue from where the last AI left off. IMPORTANT: Throughout
    this session, silently update .handoff/ACTIVE_SESSION.md after every
    significant change you make. When I say "handoff" or "rate limits
    dying", immediately save all context to the handoff files.

---

## When Opening Any AI — Brand New Project (no .handoff/ yet)

Paste this:

    Set up the Universal Handoff Protocol in this project. Fetch the exact
    template files from https://github.com/shreybansal365/universal-handoff-protocol/tree/main/template
    — download README.md and PROMPTS.md exactly as they are, do not modify
    or reinterpret them. Place them in a .handoff/ directory in the project
    root. Then scan THIS project's codebase and generate a fresh
    PROJECT_BIBLE.md, ACTIVE_SESSION.md, and SESSION_LOG.md specific to
    this project. Add !.handoff/ to .gitignore if needed. Run the setup
    verification checklist. IMPORTANT: Throughout this session, silently
    update .handoff/ACTIVE_SESSION.md after every significant change.

---

## If an AI Stops Following the Protocol Mid-Session

Paste this:

    You are not following the Universal Handoff Protocol. Re-read
    .handoff/README.md immediately, especially the CRITICAL section at the
    end. Update .handoff/ACTIVE_SESSION.md with everything you've done so
    far. Confirm when re-engaged.

---

## Quick Reference (All Keywords)

| Say This | What Happens |
|---|---|
| `rate limits dying, prepare for handoff` | Full save + ready to switch |
| `checkpoint` or `save` | Quick save without leaving |
| `follow the protocol` | Snap AI back on track |

---

GitHub repo: https://github.com/shreybansal365/universal-handoff-protocol
