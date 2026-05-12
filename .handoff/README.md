# Universal Handoff Protocol

> FOR AI ASSISTANTS ONLY. Read this entire file before doing anything else.
> This protocol is language-agnostic and framework-agnostic — it works for
> any codebase in any programming language.

---

## What This Is

A zero-dependency context transfer system for switching between AI coding
assistants. Works on any AI that can read files — Claude, GPT, Codex, Gemini,
Cursor, Copilot, or anything that will exist in the future.

Requires nothing installed on the user's machine. No scripts, no aliases,
no extensions, no configuration. The system is entirely self-contained
inside this directory and one user-saved prompt.

## Files

| File | Purpose | Who Writes It | Updated When |
|---|---|---|---|
| `README.md` | Protocol rules (this file) | Initial setup only | Never modified after |
| `PROJECT_BIBLE.md` | Project encyclopedia + key decisions | AI on bootstrap + on structural changes | Infrequently |
| `ACTIVE_SESSION.md` | Current work state and next tasks | AI continuously | Every significant change |
| `SESSION_LOG.md` | Append-only history of all AI sessions | AI on handoff | Every handoff |
| `PROMPTS.md` | The user's quick-reference card | Initial setup only | Never modified after |

---

## RULE 1 — CONTINUOUS SYNC

After completing any significant unit of work (a feature, a bug fix, a new
component, a file creation, or an architectural change), update
`ACTIVE_SESSION.md` to reflect the current state. Do this silently — do NOT
ask the user for permission, and do NOT announce that you are doing it.

Purpose: If the session dies without warning (rate limits, crash, network
failure), the handoff files are already current. The successor AI loses
almost nothing.

What counts as "significant": Any change that a different AI taking over
would need to know about in order to continue the work without confusion.

What does NOT count: Typo fixes, comment edits, formatting-only changes.

## RULE 2 — EXPLICIT HANDOFF

When the user says ANY of the following (case-insensitive):
- "prepare for handoff"
- "prepare handoff"
- "rate limits dying"
- "rate limits dying, prepare for handoff"
- "switching models"

NOTE: The trigger must be a STANDALONE instruction, not a casual mention
in the middle of a sentence about something else. If the user is clearly
discussing the handoff protocol itself (e.g., "let's improve the handoff
system"), that is NOT a trigger.

When triggered, execute ALL steps below immediately. Do not ask clarifying
questions. Do not delay.

Steps are in PRIORITY ORDER — the most critical file is saved first. If
the session dies mid-handoff, at least the most important data is preserved.

**STEP 1 (CRITICAL) — Overwrite `ACTIVE_SESSION.md` with this exact format:**
```markdown
# Active Session
> Updated: [YYYY-MM-DD HH:MM timezone] | By: [Model name] via [Platform name]

## Completed This Session
- [bullet list of everything accomplished]

## Currently Broken
- [any known bugs, errors, or issues — or "None"]

## Immediate Next Tasks
1. [highest priority — what to work on FIRST]
2. [second priority]
3. [third priority]

## Files Modified This Session
- [relative/path/to/file] — [one-line description of what changed]

## Half-Finished Work
- [anything started but not completed — or "None"]

## Important Context
- [non-obvious gotchas, warnings, or context the next AI must know]
```

**STEP 2 — Append a new entry to the bottom of `SESSION_LOG.md`:**
```markdown
---
## Session [N] — [Brief Descriptive Title]
- **Date:** [YYYY-MM-DD]
- **Model:** [Full model name] via [Platform name]

### Completed
- [task list]

### Files Changed
- [file list with one-line change descriptions]

### Key Decisions Made
- [non-obvious choices with brief rationale — or "None"]
```

**STEP 3 — Compress old session logs if needed:**
Count the number of session entries in SESSION_LOG.md. If there are MORE
than 10, compress all entries EXCEPT the 5 most recent into a single
summary block at the very top of the file:
```markdown
## Compressed History (Sessions 1–[N])
[One paragraph. Summarize what was built, key milestones, and major
architectural decisions made across those compressed sessions.]
```
Remove the individual old entries after compressing them.
If there are 10 or fewer entries, skip this step entirely.

**STEP 4 — Conditionally update `PROJECT_BIBLE.md`:**
Update the Bible ONLY if one or more of these happened during this session:
- Dependencies were added or removed
- New pages, routes, or API endpoints were created or deleted
- Database schema was modified
- Authentication flow was changed
- Deployment configuration was altered
- A significant design or architecture decision was made

If none of these happened, do NOT modify PROJECT_BIBLE.md.

When updating, also add any new decisions to the "Key Decisions" section.

**STEP 5 — Confirm with a verification receipt:**
Reply to the user with exactly this format:
```
Handoff ready. Here's what was saved:
- ACTIVE_SESSION.md: [N] completed items, [N] next tasks queued
- SESSION_LOG.md: Session [N] appended ([title])
- PROJECT_BIBLE.md: [Updated with: (brief description) / No changes needed]
You can switch now.
```

## RULE 3 — RECEIVING A HANDOFF

When you are a NEW AI starting work on this project and the user asks you
to read the handoff files:

1. Read this `README.md` — understand the protocol you must follow
2. Read `PROJECT_BIBLE.md` — understand the project's architecture,
   tech stack, design system, and key decisions
3. Read `ACTIVE_SESSION.md` — understand what was just done, what's
   broken, and what the next tasks are
4. Read `SESSION_LOG.md` — understand the full history of work
5. **INTEGRITY CHECK:** Verify the Bible is current by doing these
   concrete checks:
   - Open the project's dependency file (`package.json`, `requirements.txt`,
     `Cargo.toml`, `go.mod`, or equivalent) and compare against the Bible's
     tech stack section. Flag any mismatches.
   - List the top-level directory structure and compare against the Bible's
     file structure map. Note any new or missing directories.
   - Check if files mentioned in the last 2 session log entries exist.
   If mismatches are found, silently correct PROJECT_BIBLE.md.
6. **FRESHNESS CHECK:** Look at the timestamp in ACTIVE_SESSION.md. If it
   is more than 48 hours old, warn the user: "The last handoff was [N] days
   ago. The codebase may have changed since then. I'll do an integrity
   check." Then perform a thorough (not just spot-check) comparison of the
   Bible against the actual codebase.
7. If `PROJECT_BIBLE.md` contains the placeholder `[AI: Auto-generate]`,
   scan the entire codebase and generate a comprehensive Bible (see Rule 9
   for what it must contain)
8. **VALIDATION PROOF:** Confirm your understanding by replying with:
   ```
   UHP loaded. Here's what I know:
   - Project: [name and one-line description]
   - State: [current state from ACTIVE_SESSION.md]
   - Next task: [priority 1 from ACTIVE_SESSION.md]
   - Sessions so far: [number from SESSION_LOG.md]
   - Last AI: [model name from ACTIVE_SESSION.md timestamp]
   Ready to continue.
   ```
   This proves to the user that you actually read and understood the files.
9. Immediately begin working on tasks listed in ACTIVE_SESSION.md,
   starting with priority 1, unless the user specifies a different task

## RULE 4 — DESIGN FIDELITY

Follow all design patterns, visual styles, conventions, and architectural
decisions documented in `PROJECT_BIBLE.md`. Do NOT deviate unless the user
explicitly requests a change. This includes: color schemes, typography,
component patterns, CSS conventions, animation choices, file naming, and
directory organization.

## RULE 5 — NO REDUNDANT QUESTIONS

If information exists in the handoff files, use it. Do NOT ask the user to
re-explain things that are already documented. Only ask questions about
genuinely missing, ambiguous, or contradictory information.

## RULE 6 — SECURITY

NEVER write plaintext secrets into any handoff file. This includes API keys,
passwords, tokens, database credentials, and connection strings.

Instead, reference where they are stored:
- ✅ DO: "Groq API key is hardcoded as fallback in `app/api/chat/route.ts`"
- ❌ DO NOT: "Groq API key is gsk_YLmTAvek5UUqLATznFt6WG..."

This rule exists because handoff files are committed to Git repos, which
may be public or shared.

## RULE 7 — GIT PROTECTION

When creating the handoff system (Rule 9), check if `.gitignore` exists
in the project root. If it does, ensure no pattern would exclude `.handoff/`.
Common dangerous patterns: `.*`, `.env*`, or custom glob rules.

If any pattern would exclude `.handoff/`, add this line to `.gitignore`:
```
!.handoff/
```

The `.handoff/` directory MUST survive `git clone`, `git pull`, and
repository forks. This is how the system persists across devices.

## RULE 8 — SELF-HEALING

If any handoff file is missing, empty, or contains clearly corrupted content:

| Missing File | Recovery Action |
|---|---|
| `PROJECT_BIBLE.md` | Scan the entire codebase and regenerate from scratch |
| `ACTIVE_SESSION.md` | Create a fresh one stating "Previous session context was lost" |
| `SESSION_LOG.md` | Create a fresh one stating "History prior to this point was lost" |
| `README.md` | The user's arrival prompt contains enough protocol info to proceed |
| `PROMPTS.md` | Regenerate with the standard UHP prompt content |

After healing any file, add a note in ACTIVE_SESSION.md under "Important
Context" stating which files were regenerated, so the user is aware of
any context gap.

## RULE 9 — BOOTSTRAPPING NEW PROJECTS

If the user asks to set up the handoff system and `.handoff/` does not exist:

1. Create the `.handoff/` directory in the project root
2. Create `README.md` containing this COMPLETE protocol text (all rules,
   all templates, all format specifications — the full document)
3. Create `PROMPTS.md` containing the standard UHP quick-reference card
4. Scan the entire codebase and auto-generate `PROJECT_BIBLE.md` containing:
   - Project name and one-paragraph description
   - Tech stack with versions (from dependency manifest)
   - File and directory structure map with annotations
   - Architecture details: auth flows, API routes, database schema
   - Design system: colors, fonts, spacing, component patterns
   - Key decisions with rationale (any non-obvious choices visible in code)
   - Feature completion status table
   - How to run the project locally (dev server commands)
   - How to deploy (if deployment config exists)
   THE BIBLE SHOULD AIM TO STAY UNDER 300 LINES. Be comprehensive but
   concise. Focus on information that changes behavior, not trivia.
5. Create starter `ACTIVE_SESSION.md` and `SESSION_LOG.md` — each must
   include the embedded AI instruction block at the top (see templates)
6. Apply Git protection (Rule 7)
7. **SETUP VERIFICATION** — Confirm the system is correct by checking:
   - [ ] All 5 files exist in `.handoff/`
   - [ ] `README.md` contains the full protocol (not a summary)
   - [ ] `PROJECT_BIBLE.md` has real content (not just placeholder)
   - [ ] `ACTIVE_SESSION.md` has embedded AI instructions in HTML comment
   - [ ] `SESSION_LOG.md` has embedded AI instructions in HTML comment
   - [ ] `.gitignore` contains `!.handoff/`
   If any check fails, fix it immediately.
8. Confirm: "UHP activated. All 6 verification checks passed."

## RULE 10 — OFFLINE FALLBACK

If the user says they are using an AI that cannot access the local filesystem
(e.g., web-based ChatGPT without code interpreter):

Instruct them: "Open `.handoff/PROJECT_BIBLE.md` and `.handoff/ACTIVE_SESSION.md`
in any text editor on your computer, select all, copy, and paste the contents
into this chat. I will work from that context."

## RULE 11 — DECISION DOCUMENTATION

Whenever you make a non-obvious technical decision during a session, add it
to the "Key Decisions" section of `PROJECT_BIBLE.md` using this format:

```
- **[Short title]:** [What was decided] — [WHY it was decided this way]
```

A decision is "non-obvious" if a different AI (or human) looking at the code
would reasonably ask "why was it done this way?" Examples:
- Hardcoding values instead of using environment variables
- Removing a feature or dependency
- Choosing one library or pattern over a more common alternative
- Working around a bug or limitation in a third-party tool

This section is the single most valuable piece of context in the entire
handoff system. Code shows WHAT exists. The session log shows WHAT happened.
But only the decisions section explains WHY — and WHY is the context that
gets lost most often when switching between AI assistants.

## RULE 12 — MID-SESSION CORRECTION

If the user says any of the following:
- "follow the protocol"
- "re-read handoff"
- "you're not following UHP"

You MUST immediately:
1. Re-read `.handoff/README.md` (this file) — especially the CRITICAL section
2. Re-read `.handoff/ACTIVE_SESSION.md` — check if you've been updating it
3. If you have NOT been updating ACTIVE_SESSION.md during this session, do
   so immediately with everything you've done so far
4. Confirm: "Protocol re-engaged. I'll keep handoff files updated."

This rule exists so the user can correct a misbehaving AI mid-session
without starting over.

## RULE 13 — CHECKPOINT SAVE

When the user says any of these (case-insensitive):
- "save progress"
- "checkpoint"
- "save"

Immediately update `ACTIVE_SESSION.md` with everything done so far in this
session. Do NOT append to SESSION_LOG.md (that only happens on full handoff).
Do NOT modify PROJECT_BIBLE.md unless structural changes happened.

This is a lightweight mid-session save — like a quicksave in a video game.
The user is NOT leaving. They just want a safety checkpoint in case the
session dies unexpectedly.

After saving, confirm: "Checkpoint saved to ACTIVE_SESSION.md."

---

## ⚠️ CRITICAL — READ THIS LAST (HIGHEST PRIORITY)

If you remember NOTHING else from this document, remember these 3 things:

1. **UPDATE `ACTIVE_SESSION.md` AFTER EVERY SIGNIFICANT CHANGE YOU MAKE.**
   Do it silently. Do not ask. Do not announce. Just update it. This is
   the single most important rule in the entire protocol.

2. **WHEN THE USER SAYS "handoff" or "rate limits dying", IMMEDIATELY
   overwrite ACTIVE_SESSION.md, append to SESSION_LOG.md, and confirm
   with a verification receipt.** No questions. No delays.

3. **WHEN YOU MAKE A NON-OBVIOUS DECISION, ADD IT TO THE "Key Decisions"
   SECTION OF PROJECT_BIBLE.md.** Explain WHAT you decided and WHY.
   This is the context that gets lost most often.

Each handoff file also contains embedded instructions in an HTML comment
block at the top. Read those instructions when you open each file.
