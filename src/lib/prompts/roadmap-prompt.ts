import schoolsData from '../knowledge-base/arizona-schools.json';
import type { RoadmapPreferences } from '../types';
import {
  PERSONA,
  CORE_PRINCIPLES,
  SAFEGUARD_3,
  SAFEGUARD_7_8,
  LANGUAGE_RULES,
  PLANNED_START_RULES,
} from './prompt-base';

/**
 * Tab 5 — Semester Roadmap prompt.
 * Returns: semester_roadmap based on the user's selected school.
 * Requires topSchoolId from schoolResult (Tab 3).
 * Medium response (~1500–2500 tokens). On-demand only.
 */
export function buildRoadmapPrompt(topSchoolId: string, prefs?: RoadmapPreferences): string {
  const contextBlock = prefs && Object.keys(prefs).length > 0
    ? `\n═══════════════════════════════════════════════════════════
USER ROADMAP PREFERENCES
═══════════════════════════════════════════════════════════

${prefs.attendance ? `Attendance plan: ${prefs.attendance === 'full_time' ? 'Full-time' : prefs.attendance === 'part_time' ? 'Part-time' : 'Not sure yet'}` : ''}
${prefs.housing_preference ? `Housing preference: ${prefs.housing_preference === 'on_campus' ? 'On campus' : prefs.housing_preference === 'off_campus' ? 'Off campus' : 'Not sure yet'}` : ''}

If part-time: adjust total_semesters_to_degree accordingly (roughly double for part-time vs full-time).
If housing preference is on-campus: use on_campus_annual in cost estimates where available.
If not sure: show both full-time and part-time semester counts in the recommended_start note.\n`
    : '';
  return `${PERSONA}

${CORE_PRINCIPLES}

═══════════════════════════════════════════════════════════
ETHICAL SAFEGUARDS (these override all other rules)
═══════════════════════════════════════════════════════════

${SAFEGUARD_3}

${SAFEGUARD_7_8}

═══════════════════════════════════════════════════════════
ARIZONA SCHOOLS DATABASE
═══════════════════════════════════════════════════════════

${JSON.stringify(schoolsData, null, 2)}

Today's date: ${new Date().toISOString().split('T')[0]}
${contextBlock}
${PLANNED_START_RULES}

CRITICAL: Use planned_start as the literal Semester 1 start date. Set recommended_start to match it exactly (e.g., "Fall 2026"). All phase dates and deadlines in the roadmap must build forward from this date. If planned_start is "not_sure", default to "Fall 2026".

═══════════════════════════════════════════════════════════
YOUR TASK
═══════════════════════════════════════════════════════════

Generate a semester-by-semester roadmap based on the user's top matched school: "${topSchoolId}".

Use the school data above to personalize contact info, program names, and specific deadlines.

═══════════════════════════════════════════════════════════
SEMESTER ROADMAP RULES
═══════════════════════════════════════════════════════════

Generate a roadmap with these phases:
1. "Pre-enrollment" — now through enrollment deadline
2. "Semester 1" — first active semester
3. "Semester 2" — second semester
4. "Semester 3+" — if university/4-year track, continue; if community college, show transfer planning

Each phase has tasks. Each task includes:
- task: specific action (imperative, plain language)
- why: 1 sentence connecting this to their funding or enrollment
- deadline: if applicable
- depends_on: list of prerequisite task names, or null
- estimated_time: how long this takes (e.g., "45 minutes", "1–2 hours")
- help_from: specific contact from matched school's support program
- category: "financial" | "academic" | "housing" | "administrative" | "support"

Order tasks: dependencies first → deadlines second → quick wins third.
Each phase should include a semester_cost_estimate and funding_applied summary.

Apply Safeguard 3 — label all cost estimates as "estimated" and include the school's housing office contact for rent ranges.

═══════════════════════════════════════════════════════════
OUTPUT JSON SCHEMA — return this exact structure
═══════════════════════════════════════════════════════════

{
  "semester_roadmap": {
    "recommended_start": <string, e.g., "Fall 2026">,
    "total_semesters_to_degree": <integer>,
    "based_on_school": <string — id of the top-matched school>,
    "phases": [
      {
        "name": <string, e.g., "Pre-enrollment: Now → August 2026">,
        "phase_type": <"preparation" | "active_semester" | "summer" | "graduation">,
        "tasks": [
          {
            "task": <string — imperative, plain language>,
            "why": <string — 1 sentence connecting to funding or enrollment>,
            "deadline": <string or null>,
            "depends_on": [<string task names>] or null,
            "estimated_time": <string>,
            "help_from": <string — specific contact at matched school>,
            "category": <"financial" | "academic" | "housing" | "administrative" | "support">
          }
        ],
        "semester_cost_estimate": <number or null>,
        "funding_applied": <string summary of aid covering this phase>
      }
    ]
  }
}

${LANGUAGE_RULES}`;
}
