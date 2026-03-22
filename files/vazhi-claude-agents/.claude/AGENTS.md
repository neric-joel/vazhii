# Vazhi Agent Orchestration

## Available Agents

| Agent | Domain | Model | When to Use |
|-------|--------|-------|-------------|
| `ui-designer` | Frontend/visual | Sonnet | Any component, page, layout, animation, or styling work |
| `prompt-engineer` | AI prompts | Opus | Any file in `src/lib/prompts/` — writing, editing, debugging prompts |
| `api-architect` | API integration | Sonnet | `claude.ts`, `api/assess.ts`, error handling, caching, demo fallback |
| `ethics-reviewer` | Safety/ethics | Opus | Before merging ANY user-facing change — language, data, scoring |
| `code-reviewer` | Code quality | Sonnet | After completing ANY file — non-negotiable, every file gets reviewed |
| `data-researcher` | Program data | Sonnet | Adding/updating `arizona.json`, `arizona-schools.json`, verifying facts |
| `qa-tester` | Testing | Sonnet | Writing tests, verifying flows, pre-deploy checks |

## Routing Rules

### By file path:
- `src/lib/prompts/*` → `prompt-engineer` (exclusively)
- `src/lib/claude.ts` or `api/*` → `api-architect`
- `src/components/*` or `src/pages/*` → `ui-designer`
- `src/lib/knowledge-base/*` → `data-researcher`
- `tests/*` → `qa-tester`
- `src/lib/types.ts` → whoever is making the change + `code-reviewer`
- `src/lib/score-engine.ts` → `api-architect` + `ethics-reviewer`

### By task type:
- "Make it look better" → `ui-designer`
- "Fix the prompt" → `prompt-engineer`
- "It's not loading" → `api-architect`
- "Add a new program" → `data-researcher` → `ethics-reviewer`
- "Is this safe to ship?" → `ethics-reviewer`
- "Write tests for X" → `qa-tester`
- "Review my code" → `code-reviewer`

## Mandatory Agent Chains

Some changes require multiple agents in sequence:

### New Feature
1. `ui-designer` — builds the component
2. `code-reviewer` — reviews the code
3. `ethics-reviewer` — reviews user-facing impact (if applicable)
4. `qa-tester` — writes/runs tests

### Prompt Change
1. `prompt-engineer` — edits the prompt
2. `ethics-reviewer` — verifies safeguards preserved
3. `qa-tester` — tests with demo persona

### Data Update
1. `data-researcher` — finds and verifies new data
2. `ethics-reviewer` — reviews accuracy and presentation
3. `prompt-engineer` — updates prompt if schema changed
4. `qa-tester` — verifies output still parses correctly

### Pre-Deploy
1. `qa-tester` — full test suite
2. `code-reviewer` — final review of changed files
3. `ethics-reviewer` — sign-off on user-facing changes

## How to Invoke in Claude Code

In your terminal with Claude Code, you can reference agents by saying:

```
Use the prompt-engineer agent to fix the financial prompt
```

or

```
Run ethics-reviewer on the new school recommendation feature
```

Claude Code will load the agent's instructions and apply them to your task.

## Agent Boundaries

Agents have strict ownership. If you're in `prompt-engineer` mode and need to change a React component, STOP and switch to `ui-designer`. Cross-domain changes get messy. The exceptions are:
- `code-reviewer` reviews everything
- `ethics-reviewer` reviews everything user-facing
- `qa-tester` tests everything
