import arizonaData from '../knowledge-base/arizona.json';
import schoolsData from '../knowledge-base/arizona-schools.json';
import type { SchoolPreferences } from '../types';
import {
  PERSONA,
  CORE_PRINCIPLES,
  SAFEGUARD_3,
  SAFEGUARD_4,
  SAFEGUARD_6,
  SAFEGUARD_7_8,
  LANGUAGE_RULES,
  PLANNED_START_RULES,
} from './prompt-base';

/**
 * Tab 3 — School Matches prompt.
 * Returns: top 3 school matches with full cost breakdowns, foster support, housing options.
 * Medium response (~2500–3500 tokens). On-demand only.
 */
export function buildSchoolsPrompt(prefs?: SchoolPreferences): string {
  const contextBlock = prefs && Object.keys(prefs).length > 0
    ? `\n═══════════════════════════════════════════════════════════
USER PREFERENCES (use to adjust location_fit and goal_fit weights)
═══════════════════════════════════════════════════════════

${prefs.location ? `Preferred location in Arizona: ${prefs.location}` : ''}
${prefs.priorities?.length ? `School priorities (user selected): ${prefs.priorities.join(', ')}` : ''}
${prefs.transportation ? `Transportation availability: ${prefs.transportation}` : ''}

Adjust location_fit scoring to strongly favor schools matching the user's preferred area.
Adjust goal_fit to weight the user's selected priorities higher.
If transportation is "No" or "Public transit only", weight transit_accessible schools more heavily.\n`
    : '';
  return `${PERSONA}

${CORE_PRINCIPLES}

═══════════════════════════════════════════════════════════
ETHICAL SAFEGUARDS (these override all other rules)
═══════════════════════════════════════════════════════════

${SAFEGUARD_3}

${SAFEGUARD_4}

${SAFEGUARD_6}

${SAFEGUARD_7_8}

═══════════════════════════════════════════════════════════
ARIZONA PROGRAM DATABASE (for cost calculations)
═══════════════════════════════════════════════════════════

${JSON.stringify(arizonaData, null, 2)}

═══════════════════════════════════════════════════════════
ARIZONA SCHOOLS DATABASE
═══════════════════════════════════════════════════════════

${JSON.stringify(schoolsData, null, 2)}

Today's date: ${new Date().toISOString().split('T')[0]}
${contextBlock}
${PLANNED_START_RULES}

PLANNED START + SCHOOL MATCHING: If planned_start is summer_2026 or fall_2026, boost goal_fit score for schools with rolling admissions or later application deadlines. Include this timing consideration in why_this_school when relevant.

═══════════════════════════════════════════════════════════
SCHOOL MATCHING RULES
═══════════════════════════════════════════════════════════

For each school in the database, calculate a fit_score (0–100):

financial_fit (40% of fit_score):
  Lower estimated_out_of_pocket = higher score
  Scale: $0 = 100, $2000 = 80, $5000 = 50, $8000+ = 20
  Has foster-specific scholarships beyond waiver/ETV/Pell: +10 bonus

support_fit (25% of fit_score):
  has_dedicated_program: +30 | has_campus_champion: +20
  Each support service offered: +5 (max +25)

location_fit (20% of fit_score):
  Matches user's area preference: +25
  Transit accessible AND user needs housing: +15
  Affordable housing nearby (avg rent < $1000): +10

goal_fit (15% of fit_score):
  education_goal matches school type: +30
  Has online options AND user selected online preference: +20
  User is "undecided" AND school is community college: +15

Return the top 3 schools by fit_score. Apply Safeguard 4 — return fit_label not raw score.

═══════════════════════════════════════════════════════════
COST BREAKDOWN LOGIC
═══════════════════════════════════════════════════════════

For each matched school, calculate in this exact order:
1. annual_tuition — full-time annual tuition from school database
2. pell_grant_applied — Pell Grant (max $7,395) if eligible. Applies FIRST.
3. tuition_after_waiver — AZ Tuition Waiver covers REMAINING tuition after Pell. Result = $0 for eligible students at public schools.
4. mandatory_fees — fees the waiver does NOT cover
5. books_supplies — estimated annual cost
6. housing_estimate — on-campus cost if available AND preferred, otherwise avg nearby rent × 12
7. transportation — estimated annual
8. personal — estimated annual
9. total_cost_of_attendance = mandatory_fees + books_supplies + housing_estimate + transportation + personal
10. etv_applied — ETV (max $5,000) if eligible. Covers housing, books, living.
11. other_scholarships — school-specific foster youth scholarships
12. estimated_out_of_pocket = total_cost_of_attendance - etv_applied - other_scholarships

KEY RULE: Tuition waiver applies AFTER all other grants EXCEPT ETV. Pell first to tuition, waiver covers the rest. ETV covers non-tuition costs. Never double-count.

═══════════════════════════════════════════════════════════
OUTPUT JSON SCHEMA — return this exact structure
═══════════════════════════════════════════════════════════

{
  "school_matches": [
    {
      "id": <string from schools database>,
      "name": <string>,
      "type": <"community_college" | "university">,
      "fit_score": <integer 0–100 — used internally for ranking only, do not show to user>,
      "fit_label": <"Strong match" | "Good match" | "Worth exploring">,
      "fit_reasons": [<3 strings, each personalized to user's intake data, explaining WHY this school fits>],
      "cost_breakdown": {
        "annual_tuition": <number>,
        "pell_grant_applied": <number — confirmed>,
        "tuition_after_waiver": <number — $0 for eligible students>,
        "mandatory_fees": <number — estimated>,
        "books_supplies": <number — estimated>,
        "housing_estimate": <number — estimated>,
        "transportation": <number — estimated>,
        "personal": <number — estimated>,
        "total_cost_of_attendance": <number — sum of non-tuition costs>,
        "etv_applied": <number — confirmed max if eligible>,
        "other_scholarships": <number>,
        "estimated_out_of_pocket": <number>,
        "cost_note": <"Tuition and fee estimates are for 2025-2026. Verify current rates at [school URL].">
      },
      "foster_support": {
        "program_name": <string>,
        "has_champion": <boolean>,
        "contact": <string — specific contact info>,
        "program_url": <string>,
        "services": [<strings>]
      },
      "housing_options": {
        "on_campus_available": <boolean>,
        "on_campus_cost": <number or null>,
        "avg_nearby_rent": <number — midpoint estimate>,
        "housing_note": <"Estimated range: $X–$Y/month near campus. Contact [school]'s housing office for current options.">
      },
      "why_this_school": <1–2 sentences PERSONALIZED to user's specific situation>,
      "source_urls": [<strings — official school pages>]
    }
  ],
  "other_options_note": "The Arizona Tuition Waiver applies at ALL Arizona public colleges and universities, not just the ones listed here. Ask your caseworker or financial aid office about other schools."
}

${LANGUAGE_RULES}`;
}
