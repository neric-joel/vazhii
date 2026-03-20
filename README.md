# Vazhi வழி — AI College Readiness for Foster Youth

> **வழி** (vazhi) = "path" in Tamil

**Live demo:** [vazhii.vercel.app](https://vazhii.vercel.app)

Vazhi is an AI-powered college readiness tool built for foster youth aging out of the system in Arizona. Answer 5 quick questions, and Vazhi uses Claude to generate a personalized readiness snapshot, matched funding programs, and a sequenced action plan — all in your browser. No account. No data stored.

---

## The Problem

Foster youth aging out of the system in Arizona have access to up to **$12,395/year in grant funding** (Pell Grant + ETV + Tuition Waiver) — but most never claim it. The information is scattered across government portals, the eligibility rules are complex, and there's no single place that connects the dots.

Vazhi is that place.

---

## What It Does

1. **5-question intake** — age, education goal, timeline, documents on hand, benefits already applied for
2. **Claude API assessment** — system prompt embeds the full Arizona program database and scoring rules; returns structured JSON
3. **Readiness Snapshot** — 4 animated score rings (Overall, Academic, Financial Aid, Application, Timeline)
4. **Matched Funding** — programs ranked by confidence (Eligible / Likely Eligible / Verify) with source URLs
5. **Sequenced Action Plan** — steps ordered by dependency and deadline, each with exact documents needed, where to go, what to bring
6. **Live score updates** — checking off a step instantly recalculates all scores using pre-calculated deltas from Claude
7. **PDF export** — downloadable college readiness plan the user can bring to a caseworker

---

## Sample Output

From the live app (19-year-old, community college, just aged out):

| Score | Value |
|-------|-------|
| Overall | 52 / 100 |
| Academic | 60 / 100 |
| Financial Aid | 40 / 100 |
| Application | 35 / 100 |
| Timeline | 75 / 100 |

**Matched programs:** Pell Grant ($7,395/yr) · ETV ($5,000/yr) · AZ Tuition Waiver (full remaining tuition)

**Key insight:** *"You qualify for up to $12,395 in grant funding this year — money that doesn't need to be repaid."*

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| AI | Claude API (`claude-sonnet-4-20250514`) — client-side, no backend |
| PDF | jsPDF |
| Deploy | Vercel |
| Testing | Playwright (Python) |

**No backend. No database. No auth.** Every Claude call is made directly from the browser. All data stays in the browser tab.

---

## Architecture

```
User → Intake Form (5 fields)
            ↓
      Claude API (system prompt + AZ knowledge base)
            ↓
      Structured JSON Response
            ↓
   ┌────────────────┬─────────────────┬───────────────────┐
   │ Readiness      │ Financial Aid   │ Sequenced         │
   │ Snapshot       │ Matches         │ Action Plan       │
   │ (4 score rings)│ (with sources)  │ (with deltas)     │
   └────────────────┴─────────────────┴───────────────────┘
            ↓                                ↓
      Interactive Dashboard            PDF Export
            ↓
   Step Completion → Instant Score Updates (pre-calculated deltas)
```

---

## Project Structure

```
src/
├── components/
│   ├── intake/          # 5-step intake form + StepIndicator
│   ├── dashboard/       # ScoreRing, ScoreBar, AidCard, ActionStep
│   └── shared/          # ConfidenceBadge, SourceCitation, LoadingSkeleton
├── lib/
│   ├── claude.ts        # Claude API wrapper (retry + demo fallback)
│   ├── prompt.ts        # System prompt with embedded AZ knowledge base
│   ├── score-engine.ts  # Client-side delta application
│   ├── pdf-export.ts    # PDF generation
│   ├── types.ts         # TypeScript interfaces
│   └── knowledge-base/
│       └── arizona.json # AZ program data (Pell, ETV, Tuition Waiver, etc.)
└── pages/
    ├── Home.tsx          # Cinematic landing page
    ├── Intake.tsx        # Multi-step form
    └── Dashboard.tsx     # Results + action plan
```

---

## Arizona Programs Covered

| Program | Amount | Type |
|---------|--------|------|
| Federal Pell Grant | Up to $7,395/yr | Federal grant |
| Arizona ETV | Up to $5,000/yr (10 semesters) | State grant |
| Arizona Tuition Waiver | Full remaining tuition | State waiver |
| Bridging Success (Maricopa CC) | Free | Support program |
| ASU Foster Youth Programs | Free | Support program |
| AHCCCS (Medicaid extension) | Health coverage to age 26 | Healthcare |

---

## Ethical Design Principles

- **Navigator, not counselor** — every result includes confidence level + source URL + "verify with" contact
- **Trauma-informed language** — no shame, no blame; "here's where things stand"
- **Financial aid before academics** — money first, requirements second
- **Privacy first** — no data stored or transmitted beyond the Claude API call
- **Demo fallback** — if the API fails, a realistic fallback loads so the demo never crashes
- **Plain language** — no jargon without a tooltip

---

## Local Development

```bash
# Install dependencies
npm install

# Add your Claude API key
echo "VITE_CLAUDE_API_KEY=your_key_here" > .env

# Start dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

---

## Running Tests

End-to-end Playwright tests against the live site:

```bash
# Install playwright
pip install playwright
playwright install chromium

# Full score update test (check + uncheck)
python test_ring_debug.py

# Full e2e: intake → dashboard → score deltas
python test_score_updates.py
```

---

## Deployment

Deployed to Vercel via GitHub integration (`neric-joel/vazhii`).

To redeploy manually:
```bash
# Build
npm run build

# Push triggers auto-deploy on Vercel
git push
```

The `VITE_CLAUDE_API_KEY` environment variable must be set in Vercel project settings (Settings → Environment Variables) so it gets baked into the build.

---

## Hackathon Context

Built for the **Claude AI Hackathon** (March 2026).

**Problem:** Foster youth have access to thousands in unclaimed grant money but no single tool to navigate it.

**Solution:** A 2-minute intake → personalized AI plan → actionable steps with exact documents, deadlines, and offices to contact.

**What makes it different:**
- Embeds the full Arizona program database directly in the Claude system prompt
- Pre-calculates score deltas per action step so the dashboard updates instantly without a second API call
- Trauma-informed UX designed specifically for the target population
- PDF output bridges AI → human caseworker handoff

---

*வழி — Find your path.*
