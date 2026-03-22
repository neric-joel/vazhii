# Path Forward

<p align="center">
  <strong>AI-powered college readiness for foster youth in Arizona</strong><br>

</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white" alt="React 18">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Claude_API-Sonnet_4.6-D97706?style=flat" alt="Claude API">
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/License-MIT-0F6E56?style=flat" alt="MIT License">
</p>

---

## What is Path Forward?

800 foster youth age out of the Arizona system every year. Most leave $12,000+ in college funding on the table — not because they're ineligible, but because the system is too complex to navigate alone.

Path Forward is a 2-minute AI assessment that builds a personalized college readiness plan: which programs you qualify for, what to do first, which schools fit your situation, and a semester-by-semester roadmap — all in one place, for free.

**Everything runs in your browser. No account. No data stored. No tracking.**

---

## Live Demo

**[pathforward-az.vercel.app](https://pathforward-az.vercel.app)** — Try Demo mode for an instant preview with sample data, no API key needed.

---

## Features

### Intake Form (6 steps, ~2 minutes)
- Age + state with live eligibility warnings (age 22+ Tuition Waiver alert)
- Education goal selector with auto-advance on tap
- Timeline status (still in care / just aged out / 3–12 months / over a year)
- Planned start semester (Summer 2026 through Fall 2027)
- Documents checklist (ID, SSN, birth certificate, diploma, transcripts, foster care proof)
- Benefits already applied for (FAFSA, ETV, Tuition Waiver, AHCCCS)

### Dashboard (5 tabs, lazy-loaded per section)

**Overview** — Auto-fires on submit
- Readiness score rings: Overall, Academic, Financial Aid, Application, Timeline
- Key insight panel personalized to your situation
- Funding summary showing matched programs

**Funding** — On-demand with pre-generation questions
- Full matched program cards: Pell Grant ($7,395), Arizona ETV ($5,000), Tuition Waiver, AHCCCS
- Confidence levels (Confirmed eligible / Very likely / Needs verification)
- Deadlines, next actions, source URLs, verify contacts on every card

**Schools** — On-demand with location + priority questions
- 3 matched Arizona schools with full cost waterfall
- Tuition → Pell Grant → Tuition Waiver → ETV → estimated out-of-pocket
- Foster youth support programs, housing options, fit labels

**Action Plan** — Auto-generates on tab click
- Sequenced steps with document checklists per step
- Score delta indicators showing what each step improves
- Checkable completion with live score updates (no extra API call)

**Roadmap** — On-demand with school picker + attendance questions
- Semester-by-semester plan from today to graduation
- Phase breakdown: Preparation → First Semester → Academic Year → Graduation
- Cost per phase with funding applied per semester

### PDF Export
- Cover page with generated sections list
- All sections as formatted autoTable tables
- Header + footer + page numbers on every page
- Saves as `path-forward-college-plan.pdf`

### Demo Mode
- Full dashboard with sample data — no API key needed
- Available from "Try Demo" on the landing page
- Per-section fallback if any live API call fails

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| AI | Claude claude-sonnet-4-6 via Anthropic API |
| Serverless proxy | Vercel Functions (`api/assess.ts`) |
| PDF generation | jsPDF + jspdf-autotable |
| Fonts | Space Grotesk · Inter · IBM Plex Mono |
| Deployment | Vercel |

---

## Architecture

```
Browser (React + TypeScript)
  │
  ├── Intake Form (6 steps — no API calls, pure UI)
  │
  └── Dashboard (5 tabs, results cached in App.tsx state)
       │
       ├── Overview Tab ──── auto-fires on submit (~2k tokens)
       ├── Funding Tab ────── on-demand + questions (~1.5k tokens)
       ├── Schools Tab ────── on-demand + questions (~3k tokens)
       ├── Action Plan Tab ── auto-generates on tab click (~2k tokens)
       └── Roadmap Tab ────── on-demand + school picker (~2k tokens)
              │
              ▼
       POST /api/assess  (Vercel serverless — CLAUDE_API_KEY server-side only)
              │
              ▼
       Claude claude-sonnet-4-6  →  structured JSON response
              │
              ▼
       Per-section result cached — tab switches are instant
       Each section fails independently with demo data fallback
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- An Anthropic API key ([console.anthropic.com](https://console.anthropic.com))

### Installation

```bash
git clone https://github.com/neric-joel/path-forward.git
cd path-forward
npm install
```

### Environment

```bash
# .env.local (never committed — for local dev only)
VITE_CLAUDE_API_KEY=sk-ant-api...
```

For Vercel production, set `CLAUDE_API_KEY` in the dashboard (server-side only, not prefixed with `VITE_`).

### Run

```bash
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview production build locally
```

---

## Ethical Design

8 safeguards are embedded into every AI prompt and response:

| # | Safeguard | Implementation |
|---|-----------|---------------|
| 1 | **Wrong Eligibility** | `confidence: "verify"` on unconfirmable claims. Source URL + verify contact on every card. |
| 2 | **Discouraging Language** | Prompts lead with strengths. "Low" is banned. All score framing is constructive. |
| 3 | **False Cost Certainty** | Housing costs are ranges, labeled as estimates. No false precision. |
| 4 | **Overconfident Rankings** | Schools get `fit_label` (Strong / Good / Worth exploring), never a raw score ranking. |
| 5 | **False Urgency** | Urgent items point to a specific person + phone number, not a panic message. |
| 6 | **Missing Options** | Every response includes `other_options_note` acknowledging programs not shown. |
| 7 | **Shared Device Privacy** | Housing + income answers excluded from all visible summaries and PDF exports. |
| 8 | **"I'd Rather Not Say"** | Sensitive questions have this as a first-class option. Zero plan quality penalty applied. |

---

## Project Structure

```
vazhi/
├── api/
│   └── assess.ts                    # Vercel serverless proxy
├── src/
│   ├── components/
│   │   ├── intake/                  # IntakeForm + 6 field components
│   │   ├── dashboard/               # DashboardView + 5 tab components
│   │   │   └── TabQuestionScreen.tsx  # Pre-generation question UI
│   │   ├── shared/                  # TabLoader, AnalyzingScreen, Shimmer
│   │   └── ui/                      # HeroAscii, BackgroundPaths
│   ├── lib/
│   │   ├── prompts/                 # Per-section Claude prompts
│   │   ├── claude.ts                # API fetch functions + dual routing
│   │   ├── demo-data.ts             # Per-section demo data
│   │   ├── pdf-export.ts            # jsPDF + autoTable
│   │   ├── score-engine.ts          # Client-side score delta calculation
│   │   └── types.ts                 # Shared TypeScript interfaces
│   └── pages/
│       ├── Home.tsx
│       ├── Intake.tsx
│       └── Dashboard.tsx
└── vercel.json                      # SPA rewrites + /api/ passthrough
```

---

## Hackathon

**HackASU 2026** — March 20–22, 2026
**Track 3: Economic Empowerment & Education**

Path Forward was built in 72 hours to demonstrate how AI can make complex government benefit systems navigable for vulnerable populations — without requiring technical literacy, a personal data account, or a caseworker appointment.

---

## Team

Built at HackASU 2026.

---

## License

MIT — free to use, adapt, and deploy for any foster youth support organization.

---

<p align="center">
  <a href="https://pathforward-az.vercel.app">Live Demo</a> ·
  <a href="https://github.com/neric-joel/path-forward">GitHub</a> ·
  Built for foster youth in Arizona
</p>
