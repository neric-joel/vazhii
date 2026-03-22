<p align="center">
  <h1 align="center">Path Forward</h1>
  <p align="center"><strong>AI-powered college readiness for foster youth aging out of care</strong></p>
  <p align="center">
    <a href="https://pathforward-az.vercel.app">🔗 Live Demo</a> ·
    <a href="https://youtu.be/YOUR_VIDEO_ID">🎥 Demo Video</a> ·
    <a href="https://github.com/neric-joel/path-forward">💻 GitHub</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Claude_API-191919?style=flat&logo=anthropic&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/Deployed_on_Vercel-000?style=flat&logo=vercel&logoColor=white" />
  </p>
  <p align="center"><em>HackASU 2026 · Track 3: Economic Empowerment & Education</em></p>
</p>

---

## 15,000+ foster youth age out every year. Less than 3% get a college degree.

The money exists — Pell Grants, tuition waivers, training vouchers — up to **$24,790/year** in Arizona alone. But the system is so fragmented that most eligible youth never claim it.

**Path Forward** fixes the navigation problem. Answer 6 questions → get a personalized plan with matched funding, school recommendations, a sequenced action plan, and a semester roadmap. Download the PDF. Bring it to your caseworker.

No account. No data stored. Everything runs in your browser.

---

## Demo

> **[Try it live →](https://pathforward-az.vercel.app)**

<!-- Add screenshots here - replace with actual screenshot URLs after taking them -->
<!-- ![Landing Page](screenshots/landing.png) -->
<!-- ![Dashboard Overview](screenshots/dashboard.png) -->
<!-- ![Action Plan](screenshots/action-plan.png) -->

---

## How It Works
6 Questions → Claude AI → 5-Tab Personalized Dashboard → PDF Export

**Intake** — Age, education goal, timeline, documents, benefits. 2 minutes.

**Dashboard** — 5 tabs, each powered by a focused Claude API call:
- **Overview** — Readiness score, funding snapshot, next actions
- **Funding** — Matched programs with eligibility confidence, deadlines, source links
- **Schools** — Top 3 matches with cost breakdowns (tuition → grants stacked → out-of-pocket)
- **Action Plan** — Sequenced steps with dependency chains. Check them off, scores update instantly.
- **Roadmap** — Semester-by-semester timeline for your chosen school

**PDF** — Professional export designed for a caseworker meeting.

---

## Why AI (and not just a website)

A static site can list programs. It can't:
- Cross-reference 6+ programs with **interdependent** eligibility rules per person
- Sequence action steps where Step 3 depends on Step 1 being done first
- Calculate how grants **stack** differently at each school
- Pre-compute score changes for each action ("completing FAFSA unlocks Steps 3 and 5")

The full Arizona program database is embedded in every Claude prompt — no vector DB, no retrieval step.

---

## Ethical Safeguards

8 hard-coded rules in every API call:

1. No false eligibility — confidence levels on everything
2. No discouraging language — scores below 40 lead with strengths
3. No false cost precision — housing as ranges, tuition labeled estimated vs confirmed
4. No overconfident rankings — "Strong match" not #1/#2/#3
5. No false urgency — deadlines include a helper contact, not panic
6. No missing options — always notes the Tuition Waiver works at ALL AZ public schools
7. Privacy on shared devices — sensitive fields never echoed in outputs
8. "I'd rather not say" — opt-out on every sensitive question, no penalty

Zero data stored. No accounts. No tracking. Privacy banner on every page.

---

## Tech Stack

| | |
|---|---|
| **Frontend** | React 18 · TypeScript · Tailwind CSS · shadcn/ui |
| **AI** | Claude API (claude-sonnet-4-20250514) via Vercel serverless proxy |
| **PDF** | jsPDF + jspdf-autotable |
| **Deploy** | Vercel (serverless functions + static) |

API key lives server-side in `api/assess.ts` — never touches the browser.

---

## Architecture
```
Intake (6 steps, no API call)
↓
Vercel Proxy (/api/assess) ← API key server-side
↓
┌────────┬────────┬────────┬────────┬────────┐
│Overview│Funding │Schools │Action  │Roadmap │
│auto    │on-click│on-click│on-click│gated   │
└────────┴────────┴────────┴────────┴────────┘
↓
Dashboard → Score Updates (client-side) → PDF
```

5 independent API calls (2K-4K tokens each) instead of one monolithic request. Each tab loads in 10-20s, fails independently, caches results.

---

## Run Locally
```bash
git clone https://github.com/neric-joel/path-forward.git
cd path-forward
npm install
echo "VITE_CLAUDE_API_KEY=your_key" > .env
npm run dev
```

No API key? Full demo mode works out of the box.

---

## What's Next

- **Spanish language support** — 30%+ of AZ foster youth are Spanish-speaking
- **Expand to California and Texas** — same architecture, new JSON knowledge base
- **Document upload** — parse case plans, auto-fill intake
- **Campus coordinator dashboard** — caseworkers track student progress

---

## Team

**Neric Joel** — Full-stack development, AI integration, ethical design

---

<p align="center"><strong>Path Forward</strong> — Your path to college starts here.</p>
