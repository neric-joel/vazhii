import type {
  IntakeFormData,
  OverviewResult,
  FinancialAidResult,
  SchoolMatchResult,
  ActionPlanResult,
  RoadmapResult,
  SchoolPreferences,
  ActionPlanContext,
  RoadmapPreferences,
} from './types';
import { buildOverviewPrompt } from './prompts/overview-prompt';
import { buildFinancialPrompt } from './prompts/financial-prompt';
import { buildSchoolsPrompt } from './prompts/schools-prompt';
import { buildActionPlanPrompt } from './prompts/action-plan-prompt';
import { buildRoadmapPrompt } from './prompts/roadmap-prompt';
import {
  DEMO_RESULT,
  DEMO_OVERVIEW,
  DEMO_FINANCIAL,
  DEMO_SCHOOLS,
  DEMO_ACTION_PLAN,
  DEMO_ROADMAP,
} from './demo-data';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const FETCH_TIMEOUT_MS = 55_000; // 55s — Vercel serverless functions time out at 60s

// ─── Routing: proxy vs direct ────────────────────────────────────────────────
//
// Production (deployed to Vercel): no VITE_CLAUDE_API_KEY in the bundle.
// All calls go through /api/assess — the key lives server-side only.
//
// Local dev shortcut: set VITE_CLAUDE_API_KEY in .env to bypass the proxy
// and call Anthropic directly (avoids needing `vercel dev` locally).

function localDevKey(): string | null {
  const k = import.meta.env.VITE_CLAUDE_API_KEY;
  return k && k !== 'your_key_here' && k.trim() !== '' ? k : null;
}

const USE_PROXY = !localDevKey();

// ─── Core Fetch ──────────────────────────────────────────────────────────────

async function callAPI(
  systemPrompt: string,
  intakeData: IntakeFormData,
  maxTokens: number,
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    let response: Response;

    if (USE_PROXY) {
      // Production path — key stays server-side
      response = await fetch('/api/assess', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, intakeData, maxTokens }),
      });
    } else {
      // Local dev fallback — direct browser call
      response = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': localDevKey()!,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: 'user', content: JSON.stringify(intakeData) }],
        }),
      });
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn(`[PathForward] API HTTP ${response.status}:`, errorBody.slice(0, 200));
      throw new Error(`Claude API error ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text as string;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function parseJSON<T>(raw: string, section: string): T {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  if (!cleaned.endsWith('}')) {
    console.warn(`[PathForward] ${section}: response may be truncated. Last 80 chars:`, cleaned.slice(-80));
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error(`[PathForward] ${section}: JSON.parse failed.`, err);
    console.error(`[PathForward] ${section}: First 300 chars:`, cleaned.slice(0, 300));
    throw err;
  }
}

function hasAccess(): boolean {
  // True if we have a direct key (local dev) or are on the proxy path (production)
  return USE_PROXY || localDevKey() !== null;
}

// ─── Public Section Functions ────────────────────────────────────────────────

/** Tab 1 — auto-fires on intake submit. Returns scores + slim programs + key_insight. */
export async function fetchOverview(intakeData: IntakeFormData): Promise<OverviewResult> {
  if (!hasAccess()) {
    console.warn('[PathForward] No API access — overview demo fallback.');
    return DEMO_OVERVIEW;
  }
  try {
    const raw = await callAPI(buildOverviewPrompt(), intakeData, 2500);
    const result = parseJSON<OverviewResult>(raw, 'Overview');
    console.log('[PathForward] Overview succeeded.');
    return result;
  } catch (err) {
    console.error('[PathForward] Overview failed — demo fallback:', err);
    return DEMO_OVERVIEW;
  }
}

/** Tab 2 — on-demand. Returns full matched_programs with all fields. */
export async function fetchFinancialAid(intakeData: IntakeFormData): Promise<FinancialAidResult> {
  if (!hasAccess()) {
    console.warn('[PathForward] No API access — financial demo fallback.');
    return DEMO_FINANCIAL;
  }
  try {
    const raw = await callAPI(buildFinancialPrompt(), intakeData, 2000);
    const result = parseJSON<FinancialAidResult>(raw, 'FinancialAid');
    console.log('[PathForward] FinancialAid succeeded.');
    return result;
  } catch (err) {
    console.error('[PathForward] FinancialAid failed — demo fallback:', err);
    return DEMO_FINANCIAL;
  }
}

/** Tab 3 — on-demand. Returns top 3 school matches with cost breakdowns. */
export async function fetchSchoolMatches(
  intakeData: IntakeFormData,
  prefs?: SchoolPreferences,
): Promise<SchoolMatchResult> {
  if (!hasAccess()) {
    console.warn('[PathForward] No API access — schools demo fallback.');
    return DEMO_SCHOOLS;
  }
  try {
    const raw = await callAPI(buildSchoolsPrompt(prefs), intakeData, 4000);
    const result = parseJSON<SchoolMatchResult>(raw, 'Schools');
    console.log('[PathForward] Schools succeeded.');
    return result;
  } catch (err) {
    console.error('[PathForward] Schools failed — demo fallback:', err);
    return DEMO_SCHOOLS;
  }
}

/** Tab 4 — on-demand. Returns sequenced action plan + score deltas. */
export async function fetchActionPlan(
  intakeData: IntakeFormData,
  context?: ActionPlanContext,
): Promise<ActionPlanResult> {
  if (!hasAccess()) {
    console.warn('[PathForward] No API access — action plan demo fallback.');
    return DEMO_ACTION_PLAN;
  }
  try {
    const raw = await callAPI(buildActionPlanPrompt(context), intakeData, 3000);
    const result = parseJSON<ActionPlanResult>(raw, 'ActionPlan');
    console.log('[PathForward] ActionPlan succeeded.');
    return result;
  } catch (err) {
    console.error('[PathForward] ActionPlan failed — demo fallback:', err);
    return DEMO_ACTION_PLAN;
  }
}

/** Tab 5 — on-demand. Requires topSchoolId from schoolResult. */
export async function fetchRoadmap(
  intakeData: IntakeFormData,
  topSchoolId: string,
  prefs?: RoadmapPreferences,
): Promise<RoadmapResult> {
  if (!hasAccess()) {
    console.warn('[PathForward] No API access — roadmap demo fallback.');
    return DEMO_ROADMAP;
  }
  try {
    const raw = await callAPI(buildRoadmapPrompt(topSchoolId, prefs), intakeData, 3000);
    const result = parseJSON<RoadmapResult>(raw, 'Roadmap');
    console.log('[PathForward] Roadmap succeeded.');
    return result;
  } catch (err) {
    console.error('[PathForward] Roadmap failed — demo fallback:', err);
    return DEMO_ROADMAP;
  }
}

// ─── Legacy export (used by pdf-export.ts) ───────────────────────────────────
export { DEMO_RESULT };
