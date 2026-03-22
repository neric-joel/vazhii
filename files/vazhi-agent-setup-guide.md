# Vazhi V4 — Claude Code Agent Setup Guide

## What You're Getting

7 specialized agents for your `.claude/agents/` directory that will make Claude Code work like a team of specialists on your project.

| Agent | What It Does | When to Use |
|-------|-------------|-------------|
| **ui-designer** | All visual work — components, pages, animations, responsive design | "Make it look better", "Build the landing page", "Fix mobile layout" |
| **prompt-engineer** | All AI prompt work — the 6 prompt files that power Vazhi's intelligence | "Fix the financial prompt", "Add a new output field", "Prompts are returning bad JSON" |
| **api-architect** | API integration — Claude API calls, serverless proxy, error handling, caching | "It's not loading", "Add retry logic", "Fix the demo fallback" |
| **ethics-reviewer** | Safety review — trauma-informed language, data accuracy, privacy | Run before merging ANY user-facing change |
| **code-reviewer** | Code quality — TypeScript, React patterns, accessibility, performance | Run after completing ANY file |
| **data-researcher** | Program data — arizona.json, school data, eligibility rules, deadlines | "Add a new scholarship", "Update tuition numbers", "Verify this deadline" |
| **qa-tester** | Testing — Playwright E2E tests, demo mode verification, pre-deploy checks | "Write tests for the intake form", "Verify score updates work" |

## Setup Instructions

### Step 1: Copy the agent files into your repo

```bash
# From your vazhi project root:
mkdir -p .claude/agents

# Copy all 7 agent files:
cp [downloaded-path]/.claude/agents/*.md .claude/agents/
cp [downloaded-path]/.claude/AGENTS.md .claude/AGENTS.md
```

Your directory should look like:
```
vazhi/
├── .claude/
│   ├── AGENTS.md              # Orchestration guide
│   └── agents/
│       ├── ui-designer.md
│       ├── prompt-engineer.md
│       ├── api-architect.md
│       ├── ethics-reviewer.md
│       ├── code-reviewer.md
│       ├── data-researcher.md
│       └── qa-tester.md
├── src/
├── ...
```

### Step 2: Update your CLAUDE.md

Add this section to your existing CLAUDE.md (near the top, after the skills table):

```markdown
## Agents

All agents are in `.claude/agents/` — see AGENTS.md for orchestration rules.

**Mandatory chains:**
- After ANY file: run `code-reviewer`
- Before ANY merge of user-facing changes: run `ethics-reviewer`
- Before deploy: run `qa-tester`

**File routing:**
- `src/lib/prompts/*` → `prompt-engineer` only
- `src/components/*` or `src/pages/*` → `ui-designer`
- `src/lib/claude.ts` or `api/*` → `api-architect`
- `src/lib/knowledge-base/*` → `data-researcher`
```

### Step 3: Use agents in Claude Code

In your terminal running Claude Code, you invoke agents naturally:

```
# Design work
"Use ui-designer to rebuild the landing page with a fresh V4 look"

# Prompt work
"Use prompt-engineer to add planned_start support to the schools prompt"

# Fix API issues
"Use api-architect to add timeout handling to the overview API call"

# Review before shipping
"Run ethics-reviewer on the new school recommendation cards"

# Testing
"Use qa-tester to write Playwright tests for the demo mode flow"
```

## How Agents Work Together

### Example: Adding a new feature (cost waterfall animation)

1. **You say:** "Add an animated cost waterfall to the Schools tab"
2. **ui-designer** builds the React component with CSS animations
3. **code-reviewer** checks TypeScript types, React patterns, accessibility
4. **ethics-reviewer** verifies dollar amounts are sourced and presentation isn't misleading
5. **qa-tester** writes a test that verifies the animation renders with correct amounts

### Example: Updating scholarship data

1. **You say:** "Update ETV amounts for 2026-2027"
2. **data-researcher** finds official source, updates arizona.json with new amounts and source URL
3. **prompt-engineer** verifies the prompt still references the correct field names
4. **ethics-reviewer** confirms the "last_verified" date is updated and amounts match the source
5. **qa-tester** runs the demo persona to verify output still parses correctly

## Tips

- **Don't skip code-reviewer** — it catches the bugs that waste hours later
- **Don't skip ethics-reviewer on user-facing changes** — one bad eligibility claim could send a foster youth down the wrong path
- **prompt-engineer uses Opus** — it's slower but catches prompt issues that Sonnet misses
- **ethics-reviewer uses Opus** — safety review is worth the extra quality
- **All other agents use Sonnet** — fast enough for iterative work
