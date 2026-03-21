# Vazhi வழி — AI College Readiness for Foster Youth

> **வழி** (vazhi) = "path" in Tamil

**Live demo:** [vazhii.vercel.app](https://vazhii.vercel.app)

Vazhi is an AI-powered college readiness tool built for foster youth aging out of the Arizona system. Answer 6 quick questions, and Vazhi uses Claude to generate a personalized readiness snapshot, matched funding programs, school recommendations, a sequenced action plan, and a semester-by-semester roadmap — in a private browser session with no account and no saved data.

---

## The Problem

Foster youth aging out of the system in Arizona have access to up to **$12,395/year in grant funding** (Pell Grant + ETV + Tuition Waiver) — but most never claim it. The information is scattered across government portals, eligibility rules are complex, and there's no single place that connects the dots.

Beyond money, they face compounding barriers:
- Multiple school changes mean incomplete transcripts
- No parent to cosign or fill out FAFSA parental sections
- Deadlines that expire while navigating housing instability
- No one person who knows all the programs and how they stack

Vazhi bridges that gap — helping users arrive at their first caseworker meeting with a plan already in hand.

---

## How It Works

### Step 1 — 6-Step Intake

The intake collects exactly what's needed and nothing more:

1. **Age + State** — determines eligibility windows (under-23 first disbursement rule, ETV age limits)
2. **Education Goal** — community college, 4-year university, or trade/vocational program
3. **Timeline** — still in care / just aged out / 3–12 months out / over a year out
4. **Documents on hand** — birth certificate, SSN card, state ID, transcripts, proof of foster care
5. **Benefits already applied for** — avoids recommending programs the user already has

Intake is instant — no API call happens here. The form just collects data and navigates to the dashboard.

### Step 2 — Tabbed Dashboard (V3 Architecture)

The dashboard has 5 independent tabs. Each tab fires its own focused Claude API call on demand, rather than one monolithic 22,000-character request.

**Why 5 separate calls?**
The original V1/V2 architecture sent everything in one prompt and parsed a massive JSON response. This caused 2-minute wait times and frequent truncation errors. V3 splits each section into a small, focused call (2,000–4,000 tokens each), reducing per-tab response time to 10–20 seconds and eliminating truncation entirely.

---

## The 5 Tabs

### Tab 1 — Overview (auto-fires on arrival)

The Overview tab fires automatically when you reach the dashboard. While you read the demo banner and privacy notice, Claude is already working.

**What it returns:**
- **Key Insight** — one sentence summarizing the most important thing for this person right now
- **Readiness Snapshot** — 5 animated score rings: 1 composite Overall score + 4 sub-scores:
  - **Overall** (0–100) — weighted composite of all dimensions
  - **Academic** — GED/diploma status, transcript situation
  - **Financial Aid** — documents needed for FAFSA, ETV, tuition waiver
  - **Application** — how close to submission-ready
  - **Timeline** — urgency relative to deadlines and age limits
- **Funding Summary** — top 3 matched programs with confidence badges and next actions (slim version; full details in Funding tab)

**Loading state:** Section-specific skeleton cards with `animate-pulse`, plus "Analyzing your situation — usually takes 10–20 seconds…"

---

### Tab 2 — Funding (on-demand)

Shows a SectionIntro card first ("Show My Funding Details" button). Fires the funding API call on click.

**What it returns:** Full matched programs list, each with:
- **Confidence badge:** `Confirmed eligible` (green) / `Very likely eligible` (teal) / `Check with your caseworker` (amber)
- **Confidence reason** — plain-language explanation of why this rating was assigned
- **Amount** — max annual amount
- **What it covers** — tuition, housing, books, etc.
- **Deadline** — with urgency note if within 14 days
- **Next action** — single most important step (e.g. "Complete FAFSA at studentaid.gov — use school code 001081 for ASU")
- **Source URL** — direct link to the program page
- **Verify with** — specific office or phone number

**Programs covered:**

| Program | Amount | Type |
|---------|--------|------|
| Federal Pell Grant | Up to $7,395/yr | Federal grant |
| Arizona ETV | Up to $5,000/yr (10 semesters) | State grant |
| Arizona Tuition Waiver | Full remaining tuition | State waiver |
| Bridging Success (Maricopa CC) | Free | Support program |
| ASU Foster Youth Programs | Free | Support program |
| AHCCCS (Medicaid extension) | Health coverage to age 26 | Healthcare |

---

### Tab 3 — Schools (on-demand)

Shows optional contextual questions first (location in Arizona, school priorities multiselect, transportation access), then a "Find My School Matches" button. Fires the schools API call on click.

**What it returns:** Top 3 Arizona school matches, each with:
- **Fit label** — `Strong match` / `Good match` / `Worth exploring` (never raw scores — prevents false precision)
- **Fit reasons** — 2–3 bullet points explaining why this school fits
- **Full cost breakdown** — 12-step calculation showing how grants stack:
  - Annual tuition → Pell Grant applied → Tuition Waiver covers remainder → ETV covers non-tuition costs → Estimated out-of-pocket
  - Amounts labeled as `confirmed` vs `estimated` (Ethical Safeguard 3)
- **Foster support program** — dedicated contact, campus champion, specific services
- **Housing options** — on-campus cost + nearby rent range (ranges, never single numbers — Safeguard 3)
- **Why this school** — personalized 1–2 sentence explanation
- **Other options note** — always present: "These 3 aren't the only options — the AZ Tuition Waiver applies at ALL Arizona public colleges" (Ethical Safeguard 6)

**Matching algorithm (weighted):**
- Financial fit: 40% (how much of tuition gets covered after all grants)
- Foster support: 25% (dedicated program, campus champion, services)
- Location: 20% (transit access, proximity)
- Goal alignment: 15% (degree paths match education goal)

**Arizona Schools in the database:**
Mesa Community College, Arizona State University (ASU), University of Arizona, Maricopa Community Colleges network, Pima Community College, and others.

---

### Tab 4 — Action Plan (on-demand)

Shows optional contextual questions (caseworker status, housing situation, income status — sensitive fields marked private, never echoed in output), then a "Build My Action Plan" button. Fires the action plan API call on click.

**What it returns:** A sequenced list of steps, each with:
- **Title + why this is next** — explains the dependency chain ("Do this before FAFSA because FAFSA requires a valid SSN card")
- **Deadline** — with urgency note + specific helper contact if within 14 days (Ethical Safeguard 5)
- **Documents needed** — each listed as `have` or `need`, with `how_to_get` instructions for missing ones
- **Specific action** — one concrete thing to do
- **Where to go + what to bring** — exact office/portal + what to carry
- **Estimated time** — realistic duration ("~45 minutes at the MVD")
- **Confidence** — `Confirmed eligible` / `Very likely eligible` / `Check with your caseworker`
- **Source URL** — direct link

**Interactive scoring:** Each step has a checkbox. Checking it instantly applies pre-calculated score deltas to all 4 score rings — no second API call. Deltas are integers baked into the response (e.g. completing "Get State ID" adds +5 Application, +3 Financial Aid).

**Step ordering rules (7 explicit dependency rules in the prompt):**
1. Documents before applications
2. FAFSA before Tuition Waiver (waiver requires FAFSA dependency)
3. ETV before tuition waiver (ETV doesn't count against waiver; waiver covers remainder)
4. GED/diploma before transcript request
5. State ID before any in-person application
6. School application before housing application
7. Pell Grant before ETV (FAFSA prerequisite)

**Step unlocking:** Step 1 is always unlocked. Steps with prerequisites are locked until their dependency is checked. Steps with no prerequisites are available by default.

---

### Tab 5 — Roadmap (on-demand, gated)

**Gated:** The Roadmap tab is disabled until Tab 3 (Schools) has been generated. It needs a school to build a semester-specific timeline.

Once schools are generated, shows a **school picker** — radio-style cards for each matched school with fit label badge. User selects which school to roadmap for (defaults to top match). Optional questions (full-time vs part-time, on/off campus preference) refine the output. CTA shows the selected school name: "Build My Roadmap for [School Name] →"

A "Try a different school" link resets the roadmap result so the user can pick again. Fires the roadmap API call on click.

**What it returns:** A phased semester timeline:
- **Recommended start date** — based on timeline field + next enrollment window
- **Total semesters to degree** — based on education goal + school type
- **Phases** — each with tasks, cost estimates, and funding applied:
  - `preparation` — Pre-enrollment: documents, FAFSA, applications, housing
  - `active_semester` — Semester 1, 2, etc.: registration, ETV renewal, GPA maintenance
  - `summer` — Summer plans: ETV eligibility, optional enrollment
  - `graduation` — Final steps: degree audit, transfer if applicable

**Each task includes:**
- What + why
- Deadline (if any) — amber left border on deadline tasks for urgency scanning
- Dependencies (what must happen first)
- Estimated time
- Help from (specific contact/office)
- Category tag: `financial` / `academic` / `housing` / `administrative` / `support`

**Phase visual identity:** Each phase type has its own color and icon — 🧭 Preparation (amber), 📖 Active Semester (teal), ☀️ Summer (sky blue), 🎓 Graduation (gold). Phases are connected by a dashed vertical timeline path.

---

## Readiness Scoring

Scores are calculated by Claude from intake data using these rules:

| Dimension | Factors |
|-----------|---------|
| **Academic** | Has diploma/GED (+30), transcript available (+15), school gaps understood (+10), coursework alignment (+15) |
| **Financial Aid** | FAFSA-ready docs (+25), has SSN card (+10), has proof of foster care (+20), ETV-applied (+10) |
| **Application** | Has state ID (+20), knows target school (+15), has contact with foster support office (+10) |
| **Timeline** | Just aged out (+30 urgency bonus), deadlines > 30 days (+20), under 21 (+15) |
| **Overall** | Weighted average: Academic 25%, Financial Aid 35%, Application 25%, Timeline 15% |

Scores below 40: Claude leads with strengths, never uses the word "low" (Ethical Safeguard 2).

---

## The 8 Ethical Safeguards

Every Claude API call is governed by 8 hard-coded safeguards that override all other instructions:

| # | Name | Rule |
|---|------|------|
| 1 | **Wrong Eligibility** | Confidence = "verify" if ANY eligibility condition can't be confirmed from intake data alone |
| 2 | **Discouraging Low Scores** | Scores below 40 lead with strengths; never use the word "low" |
| 3 | **False Cost Certainty** | Housing shown as ranges; tuition labeled estimated vs confirmed |
| 4 | **Overconfident Rankings** | Schools shown with fit_label ("Strong match"), NEVER raw scores |
| 5 | **False Urgency** | Deadlines within 14 days include urgency_note pointing to a specific helper — not panic language |
| 6 | **Missing Options** | other_options_note always reminds that the AZ Tuition Waiver applies at ALL AZ public schools |
| 7 | **Privacy on Shared Devices** | Housing situation and income status never echoed in summaries or Key Insight |
| 8 | **"I'd Rather Not Say"** | Neutral defaults, no penalty, no inference from skipped fields |

---

## Ethical Design Principles

Beyond the 8 rule-based safeguards, Vazhi is designed around these principles:

| Principle | How it's applied |
|-----------|-----------------|
| **Navigator, not counselor** | Every result includes a confidence level, source URL, and "verify with" contact — users always know where to go next |
| **Trauma-informed language** | No shame, no blame — "here's where things stand and here's what to do next." Low scores never use the word "low." |
| **Financial aid before academics** | Money surfaces first in every section — Pell, ETV, and the Tuition Waiver are the headline, not a footnote |
| **Privacy by design** | No accounts, no data stored, privacy banner on every page. Sensitive fields (housing, income) are never echoed in outputs |
| **Graceful uncertainty** | Results labeled "Confirmed eligible," "Very likely eligible," or "Check with your caseworker" — never false precision |
| **Human handoff built in** | PDF export is designed to be brought to a real caseworker — the footer says "Verify all information with the contacts listed" |
| **"I'd rather not say" is first-class** | Sensitive intake questions have an opt-out; skipping a field applies neutral defaults, never a score penalty |
| **Demo fallback per section** | If any API call fails, a realistic demo response loads — the app never crashes or shows a broken state |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 (`useSearchParams` for tab routing) |
| AI | Claude API (`claude-sonnet-4-20250514`) via Vercel serverless proxy (`api/assess.ts`) |
| PDF | jsPDF |
| Deploy | Vercel (serverless functions + static hosting) |
| Testing | Playwright (Python) |

**No database. No auth. No data stored.** All Claude API calls route through a Vercel serverless proxy (`/api/assess`) — the API key never touches the browser or the client bundle. User data stays in the browser tab and is never persisted. Local development uses a direct browser shortcut (see Local Development below).

---

## V3 Architecture

```
User → Intake Form (6 steps, no API call)
            ↓ instant navigation
       /dashboard?tab=overview
            ↓
    Vercel Serverless Proxy (/api/assess) ← CLAUDE_API_KEY server-side only
            ↓
    Claude API (focused system prompt + AZ knowledge base embedded)
            ↓
    ┌──────────────────────────────────────────────────────────────┐
    │  Tab 1: Overview (auto-fires)                                │
    │  ↓ fetchOverview() — 2,500 tokens                           │
    │  Returns: readiness scores + slim program list + key_insight │
    └──────────────────────────────────────────────────────────────┘
            ↓ (user clicks CTA on each tab — each fires its own call)
    ┌──────────────┬──────────────┬──────────────┬────────────────┐
    │ Tab 2        │ Tab 3        │ Tab 4        │ Tab 5          │
    │ Funding      │ Schools      │ Action Plan  │ Roadmap        │
    │ 2,000 tokens │ 4,000 tokens │ 3,000 tokens │ 3,000 tokens   │
    │ on-demand    │ on-demand    │ on-demand    │ gated on Tab 3 │
    └──────────────┴──────────────┴──────────────┴────────────────┘
            ↓
    Interactive Dashboard — score rings update on step completion
            ↓
    PDF Export — downloadable plan for caseworker handoff
```

**Why this matters:** Each section call takes 10–20 seconds instead of the original 2-minute monolithic call. Tab results are cached in React state — switching tabs never re-fires an API call. Demo mode pre-populates all 5 tabs instantly without any API calls.

---

## Prompt Architecture

Each of the 5 API calls uses a focused prompt built from shared base modules:

| File | Used By | Contents |
|------|---------|----------|
| `prompt-base.ts` | All 5 | Persona, core principles, language rules, 8 safeguards |
| `overview-prompt.ts` | Tab 1 | Program DB, safeguards 1+2+7+8, scoring rules |
| `financial-prompt.ts` | Tab 2 | Program DB, safeguards 1+5+7+8, deadline rules |
| `schools-prompt.ts` | Tab 3 | Program DB + Schools DB, matching algorithm, cost breakdown logic, safeguards 3+4+6+7+8 |
| `action-plan-prompt.ts` | Tab 4 | Program DB, dependency rules, score delta rules, safeguards 1+5+7+8 |
| `roadmap-prompt.ts` | Tab 5 | Schools DB, phased timeline rules, safeguard 3 |

The Arizona knowledge base (programs + schools) is embedded directly in the system prompt at runtime — no vector database or retrieval step needed.

---

## Project Structure

```
api/
└── assess.ts                       # Vercel serverless proxy — holds CLAUDE_API_KEY server-side
src/
├── components/
│   ├── intake/
│   │   ├── IntakeForm.tsx          # 6-step form (no API call — just collects data)
│   │   ├── StepIndicator.tsx       # Progress bar
│   │   └── fields/                 # AgeState, EducationGoal, Timeline, Documents, Benefits
│   ├── dashboard/
│   │   ├── DashboardView.tsx       # Tab routing + PDF export button
│   │   ├── TabBar.tsx              # 5 tabs with green dot on generated tabs
│   │   ├── TabQuestions.tsx        # Reusable contextual question forms (radio/multiselect/sensitive)
│   │   ├── SectionIntro.tsx        # Shared CTA card for Tabs 2–5
│   │   ├── OverviewTab.tsx         # Auto-fires fetchOverview, skeleton loading
│   │   ├── FinancialAidTab.tsx     # On-demand, renders FinancialAidCards
│   │   ├── SchoolsTab.tsx          # On-demand + location/priorities questions
│   │   ├── ActionPlanTab.tsx       # On-demand + housing/income questions (sensitive)
│   │   ├── RoadmapTab.tsx          # School picker + attendance questions, gated on schoolResult
│   │   ├── ReadinessSnapshot.tsx   # 4 ScoreRing components
│   │   ├── ScoreRing.tsx           # Animated SVG ring
│   │   ├── FinancialAidCards.tsx   # Program list with confidence badges
│   │   ├── SchoolMatches.tsx       # Top 3 school cards + other_options_note
│   │   ├── SchoolMatchCard.tsx     # Cost breakdown table, foster support, housing
│   │   ├── ActionPlan.tsx          # Checkable step list with progress bar
│   │   ├── ActionStep.tsx          # Individual step card with delta preview
│   │   └── SemesterRoadmap.tsx     # Phased timeline with per-phase visual identity
│   └── shared/
│       ├── ConfidenceBadge.tsx     # Confirmed eligible / Very likely eligible / Check with caseworker
│       ├── SourceCitation.tsx      # Source URL + verify with contact
│       └── LoadingSkeleton.tsx     # Generic skeleton
├── lib/
│   ├── claude.ts                   # Dual routing: /api/assess proxy (prod) or direct browser (dev)
│   ├── score-engine.ts             # applyAllCompletedDeltas(), getUnlockedSteps()
│   ├── pdf-export.ts               # PDF: cover page + 5 nullable sections + footer every page
│   ├── types.ts                    # V3 TypeScript interfaces + SchoolPreferences/ActionPlanContext/RoadmapPreferences
│   ├── demo-data.ts                # Per-section demo fallbacks
│   └── prompts/
│       ├── prompt-base.ts          # Shared persona + safeguards
│       ├── overview-prompt.ts
│       ├── financial-prompt.ts
│       ├── schools-prompt.ts       # Accepts SchoolPreferences context
│       ├── action-plan-prompt.ts   # Accepts ActionPlanContext (sensitive fields)
│       └── roadmap-prompt.ts       # Accepts RoadmapPreferences + school ID
│   └── knowledge-base/
│       ├── arizona.json            # AZ programs (Pell, ETV, Tuition Waiver, etc.)
│       └── arizona-schools.json    # AZ school profiles with tuition, support, housing
└── pages/
    ├── Home.tsx                    # Cinematic landing page (path hero, amber CTA)
    ├── Intake.tsx                  # Multi-step form — instant navigation on complete
    └── Dashboard.tsx               # Passes all 5 section states to DashboardView
```

---

## Demo Mode

Clicking "Try Demo" pre-populates all 5 tabs instantly using realistic hardcoded data for a 20-year-old foster youth from Phoenix who just aged out. No API call is made.

Demo data is defined in `src/lib/demo-data.ts` as 5 per-section exports (`DEMO_OVERVIEW`, `DEMO_FINANCIAL`, `DEMO_SCHOOLS`, `DEMO_ACTION_PLAN`, `DEMO_ROADMAP`) matching the exact shape that the Claude API returns for each tab.

If the Claude API fails during real intake (timeout, error, no API key), each tab independently falls back to its demo data. The app never crashes.

---

## Local Development

```bash
# Install dependencies
npm install

# Add your Claude API key (local dev only — bypasses the serverless proxy)
echo "VITE_CLAUDE_API_KEY=your_key_here" > .env

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

**How routing works locally:** If `VITE_CLAUDE_API_KEY` is set in `.env`, the app uses a local dev shortcut — calling Claude directly (bypassing the serverless proxy). This shortcut only applies when running `npm run dev` locally and never affects production. If no key is set, the app falls back to demo data on every tab — the full dashboard experience works without a key.

**In production (Vercel):** API calls go through `api/assess.ts`. Set `CLAUDE_API_KEY` (no `VITE_` prefix) in Vercel project settings → Environment Variables.

---

## Running Tests

End-to-end Playwright tests that verify the full V3 flow:

```bash
# Install playwright
pip install playwright
playwright install chromium

# V3 full tab test — 21 checks
# Tests: homepage, Try Demo (all 5 tabs), real intake instant nav,
# Overview skeleton, Overview API call, Funding SectionIntro, Roadmap gate
python scripts/with_server.py --server "npm run dev" --port 5173 -- python tests/test_v3_tabs.py
```

**What the V3 test verifies:**
1. Homepage renders with "Get My Plan" and "Try Demo" buttons
2. Try Demo navigates to `/dashboard` instantly
3. All 5 tabs are visible in the TabBar
4. Demo Mode banner is shown
5. Key Insight and Readiness Snapshot are on Overview
6. Funding tab shows demo programs (Pell Grant, ETV, etc.)
7. Schools tab shows demo matches (Mesa Community College, etc.)
8. Roadmap tab shows demo phases (Pre-enrollment, Semester 1)
9. Real intake navigates to `/dashboard` in < 3 seconds (no API call on submit)
10. Overview skeleton shows while API call is in progress
11. Overview content renders after API call completes
12. `[Vazhi] Overview succeeded` appears in browser console
13. Funding tab shows SectionIntro (not yet generated)
14. Roadmap tab shows gated message (requires school matches first)

---

## Deployment

Deployed to Vercel via GitHub (`neric-joel/vazhii` remote — note the double-i).

```bash
# Build locally
npm run build

# Push to trigger Vercel auto-deploy
git push vercel-repo main
```

**Required environment variable in Vercel:** `CLAUDE_API_KEY` (server-side, no `VITE_` prefix). The serverless function in `api/assess.ts` reads this at request time — it is never exposed to the browser or baked into the build.

`vercel.json` is configured so `/api/assess` routes to the serverless function and all other paths fall through to the React SPA.

---

## Hackathon Context

Built for the **Claude AI Hackathon** (March 2026).

**Problem:** Foster youth have access to thousands in unclaimed grant money but no single tool to navigate the eligibility rules, document requirements, and application sequence.

**Solution:** 5-question intake → AI-generated personalized plan → 5 deep-dive tabs → PDF for caseworker handoff.

**What makes it different:**

| Feature | How it works |
|---------|-------------|
| **Embedded knowledge base** | Full Arizona program database and school profiles embedded directly in the Claude system prompt — no vector DB, no retrieval |
| **V3 tabbed architecture** | 5 focused API calls instead of one 22K-character monolith — eliminates truncation, reduces wait time from 2 min to 10–20s per tab |
| **Serverless API proxy** | Claude API key lives server-side in `api/assess.ts` — never exposed to the browser or baked into the build |
| **Contextual questions per tab** | Each tab surfaces optional mini-questions (location, priorities, housing, attendance) that refine Claude's output without blocking the user |
| **Instant score updates** | Score deltas are pre-calculated by Claude and baked into the response — checking a step applies the delta client-side, no second API call |
| **8 ethical safeguards** | Hard-coded guardrails in every prompt prevent false eligibility claims, discouraging language, false cost precision, and privacy violations |
| **Trauma-informed UX** | Language designed for the target population — no shame, no blame, plain language, financial aid shown before academic requirements |
| **PDF caseworker bridge** | Cover page + all generated sections + footer on every page — "This is a navigation guide, not legal advice. Verify with the contacts listed." |
| **Zero user data stored** | No database, no auth — user data stays in the browser tab and is cleared on close |

---

*வழி — Find your path.*
