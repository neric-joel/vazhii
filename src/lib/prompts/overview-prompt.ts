import arizonaData from '../knowledge-base/arizona.json';
import {
  PERSONA,
  CORE_PRINCIPLES,
  SAFEGUARD_1,
  SAFEGUARD_2,
  SAFEGUARD_7_8,
  LANGUAGE_RULES,
  SCORING_RULES,
  PLANNED_START_RULES,
} from './prompt-base';

/**
 * Tab 1 — Overview prompt.
 * Returns: readiness scores + slim program summaries + key_insight.
 * Small response (~1500–2000 tokens). Auto-fires on intake submit.
 */
export function buildOverviewPrompt(): string {
  return `${PERSONA}

${CORE_PRINCIPLES}

═══════════════════════════════════════════════════════════
ETHICAL SAFEGUARDS (these override all other rules)
═══════════════════════════════════════════════════════════

${SAFEGUARD_1}

${SAFEGUARD_2}

${SAFEGUARD_7_8}

═══════════════════════════════════════════════════════════
ARIZONA PROGRAM DATABASE
═══════════════════════════════════════════════════════════

${JSON.stringify(arizonaData, null, 2)}

${SCORING_RULES}

${PLANNED_START_RULES}

═══════════════════════════════════════════════════════════
OUTPUT JSON SCHEMA — return this exact structure
═══════════════════════════════════════════════════════════

{
  "readiness": {
    "overall": <integer 0–100>,
    "academic": { "score": <integer>, "summary": <1–2 sentences, no shame> },
    "financial_aid": { "score": <integer>, "summary": <highlight available money amounts> },
    "application": { "score": <integer>, "summary": <what's ready vs missing> },
    "timeline": { "score": <integer>, "summary": <urgency framing, deadline awareness> },
    "overall_summary": <2–3 sentences — if score < 40, lead with strengths and show how first steps improve it. Always end with an encouraging, actionable sentence.>
  },
  "matched_programs": [
    {
      "id": <string from program database>,
      "name": <string>,
      "max_amount": <string with dollar amount or "Full remaining tuition">,
      "confidence": <"eligible" | "likely_eligible" | "verify">,
      "confidence_reason": <1 sentence — list which specific conditions need verification if not "eligible">,
      "next_action": <specific actionable sentence — what to do first>
    }
  ],
  "key_insight": <1–2 sentences — the single most important thing for this person. If score < 40, lead with what they HAVE. Include total funding available if significant. Empowering, specific, actionable. Never reference housing/income status.>
}

${LANGUAGE_RULES}`;
}
