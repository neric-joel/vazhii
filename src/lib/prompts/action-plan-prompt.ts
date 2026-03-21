import arizonaData from '../knowledge-base/arizona.json';
import type { ActionPlanContext } from '../types';
import {
  PERSONA,
  CORE_PRINCIPLES,
  SAFEGUARD_1,
  SAFEGUARD_5,
  SAFEGUARD_7_8,
  LANGUAGE_RULES,
  SCORING_RULES,
  PLANNED_START_RULES,
} from './prompt-base';

/**
 * Tab 4 — Action Plan prompt.
 * Returns: sequenced action steps + score_deltas.
 * Medium response (~2000–2500 tokens). On-demand only.
 */
export function buildActionPlanPrompt(context?: ActionPlanContext): string {
  const contextBlock = context && Object.keys(context).length > 0
    ? `\n═══════════════════════════════════════════════════════════
ADDITIONAL CONTEXT (use to personalize steps — NEVER echo housing or income in visible output per Safeguard 7)
═══════════════════════════════════════════════════════════

${context.has_caseworker ? `Caseworker/advocate: ${context.has_caseworker}` : ''}
${context.housing_situation && context.housing_situation !== 'rather_not_say' ? `Housing situation context: ${context.housing_situation} — use to include relevant housing steps, but do NOT mention this in any step title or summary` : ''}
${context.income_status && context.income_status !== 'rather_not_say' ? `Income context: ${context.income_status} — use to calibrate financial step urgency, but do NOT mention this in any step title or summary` : ''}

If caseworker is "Yes" or "Not sure", include steps like "Contact your caseworker about foster care documentation."
If housing is unstable, prioritize housing-related assistance steps early.
Per Safeguard 8: if any field says "I'd rather not say", treat as unknown and use neutral defaults.\n`
    : '';
  return `${PERSONA}

${CORE_PRINCIPLES}

═══════════════════════════════════════════════════════════
ETHICAL SAFEGUARDS (these override all other rules)
═══════════════════════════════════════════════════════════

${SAFEGUARD_1}

${SAFEGUARD_5}

${SAFEGUARD_7_8}

═══════════════════════════════════════════════════════════
ARIZONA PROGRAM DATABASE
═══════════════════════════════════════════════════════════

${JSON.stringify(arizonaData, null, 2)}

Today's date: ${new Date().toISOString().split('T')[0]}
${contextBlock}
${SCORING_RULES}

${PLANNED_START_RULES}

TIME-BUCKET RULE: Use planned_start to sort steps into urgency buckets. Label each step's why_this_is_next with a time reference:
- "Do this week" / "Do this month" / "Do in the next 3 months" / "Before [planned_start] enrollment"
- If planned_start is summer_2026 (only ~2 months away): front-load ALL document steps as "Do this week"
- If planned_start is fall_2027 (17+ months away): spread steps out across realistic monthly buckets — don't create false urgency

═══════════════════════════════════════════════════════════
ACTION PLAN DEPENDENCY RULES
═══════════════════════════════════════════════════════════

1. Documents that unlock other steps go FIRST (State ID, SSN, birth cert)
2. FAFSA before Tuition Waiver (Tuition Waiver requires FAFSA)
3. Proof of foster care before ETV application
4. Enrollment confirmation before ETV disbursement
5. Earlier deadlines first
6. Free and quick steps first
7. Steps that unlock other steps are marked in unlocks[]

═══════════════════════════════════════════════════════════
SCORE DELTAS RULES
═══════════════════════════════════════════════════════════

For each action step, calculate the exact score increase if the user completes that step.
- Deltas must be integers and non-negative
- unlocks[] lists step_number integers that become actionable after this step
- score_deltas keys must be integers matching step_number (1, 2, 3...)
- overall delta should roughly equal weighted sum of component deltas

═══════════════════════════════════════════════════════════
OUTPUT JSON SCHEMA — return this exact structure
═══════════════════════════════════════════════════════════

{
  "action_plan": [
    {
      "step_number": <integer starting at 1>,
      "title": <short imperative title, max 6 words>,
      "why_this_is_next": <1 sentence explaining dependency or urgency>,
      "deadline": <string or null>,
      "days_until_deadline": <integer or null>,
      "urgency_note": <string or null — REQUIRED if days_until_deadline <= 14>,
      "documents_needed": [
        { "name": <string>, "status": <"have" | "need">, "how_to_get": <string if "need"> }
      ],
      "specific_action": <concrete first step of what to do>,
      "where_to_go": <URL or physical location>,
      "what_to_bring": <comma-separated list>,
      "estimated_time": <string, e.g., "45 minutes">,
      "confidence": <"certain" | "high" | "verify">,
      "verify_with": <specific contact: name, office, phone, or URL>,
      "source_url": <string>
    }
  ],
  "score_deltas": {
    1: { "academic": <int>, "financial_aid": <int>, "application": <int>, "timeline": <int>, "overall": <int>, "unlocks": [<step_numbers>] },
    2: { "academic": <int>, "financial_aid": <int>, "application": <int>, "timeline": <int>, "overall": <int>, "unlocks": [<step_numbers>] }
  }
}

CRITICAL: score_deltas keys must be integers in the JSON (1, 2, 3) — not strings.
All step_numbers must be sequential integers starting at 1.

${LANGUAGE_RULES}`;
}
