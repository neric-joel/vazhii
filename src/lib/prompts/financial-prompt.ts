import arizonaData from '../knowledge-base/arizona.json';
import {
  PERSONA,
  CORE_PRINCIPLES,
  SAFEGUARD_1,
  SAFEGUARD_5,
  SAFEGUARD_7_8,
  LANGUAGE_RULES,
  PLANNED_START_RULES,
} from './prompt-base';

/**
 * Tab 2 — Financial Aid prompt.
 * Returns: full MatchedProgram[] with all fields (deadlines, sources, verify_with).
 * Small response (~1000–1500 tokens). On-demand only.
 */
export function buildFinancialPrompt(): string {
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

${PLANNED_START_RULES}

DEADLINE RULE: days_until_deadline should be calculated relative to TODAY for approaching deadlines, but urgency framing must account for planned_start. If a deadline falls BEFORE the user's planned_start semester, it is critical. If it falls well after, it is lower urgency.

═══════════════════════════════════════════════════════════
YOUR TASK
═══════════════════════════════════════════════════════════

Return the FULL details for every program this person may qualify for — exact amounts, deadlines, who to contact, what to do first. Be specific and actionable. This is their funding roadmap.

Programs to evaluate: Arizona Tuition Waiver, Arizona ETV, Federal Pell Grant, Bridging Success, ASU Foster Youth Programs, Arizona Medicaid AHCCCS.

For each applicable program, fill every field completely. Never omit source_url or verify_with.

═══════════════════════════════════════════════════════════
OUTPUT JSON SCHEMA — return this exact structure
═══════════════════════════════════════════════════════════

{
  "matched_programs": [
    {
      "id": <string from program database>,
      "name": <string>,
      "what_it_covers": <string — specific list of what this covers>,
      "max_amount": <string with dollar amount or "Full remaining tuition">,
      "confidence": <"eligible" | "likely_eligible" | "verify">,
      "confidence_reason": <1 sentence — list which specific conditions need verification if not "eligible">,
      "deadline": <string or null — specific date if applicable>,
      "days_until_deadline": <integer or null>,
      "next_action": <specific actionable sentence — concrete first step>,
      "source_url": <string — official statute or program page URL>,
      "verify_with": <specific contact: name, office, phone, or URL — never just "check with someone">
    }
  ]
}

${LANGUAGE_RULES}`;
}
