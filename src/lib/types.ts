// ─── Intake ───────────────────────────────────────────────────────────────────
export interface IntakeFormData {
  age: number;
  state: string;
  educationGoal: string;
  timeline: 'still_in_care' | 'just_aged_out' | '3_12_months' | 'over_a_year';
  planned_start: 'summer_2026' | 'fall_2026' | 'spring_2027' | 'fall_2027' | 'not_sure';
  documents: string[];
  benefitsApplied: string[];
}

// ─── Readiness ────────────────────────────────────────────────────────────────
export interface ReadinessScore {
  overall: number;
  academic: { score: number; summary: string };
  financial_aid: { score: number; summary: string };
  application: { score: number; summary: string };
  timeline: { score: number; summary: string };
  overall_summary: string;
}

// ─── Financial Aid ────────────────────────────────────────────────────────────
export interface MatchedProgram {
  id: string;
  name: string;
  what_it_covers: string;
  max_amount: string;
  confidence: 'eligible' | 'likely_eligible' | 'verify';
  confidence_reason: string;
  deadline: string | null;
  days_until_deadline: number | null;
  next_action: string;
  source_url: string;
  verify_with: string;
}

// ─── School Matching (V2) ─────────────────────────────────────────────────────
export interface CostBreakdown {
  annual_tuition: number;
  pell_grant_applied: number;
  tuition_after_waiver: number;
  mandatory_fees: number;
  books_supplies: number;
  housing_estimate: number;
  transportation: number;
  personal: number;
  total_cost_of_attendance: number;
  etv_applied: number;
  other_scholarships: number;
  estimated_out_of_pocket: number;
  cost_note: string;
}

export interface FosterSupport {
  program_name: string;
  has_champion: boolean;
  contact: string;
  program_url: string;
  services: string[];
}

export interface HousingOptions {
  on_campus_available: boolean;
  on_campus_cost: number | null;
  avg_nearby_rent: number;
  housing_note: string;
}

export interface SchoolMatch {
  id: string;
  name: string;
  type: 'community_college' | 'university';
  fit_score: number;
  fit_label: 'Strong match' | 'Good match' | 'Worth exploring';
  fit_reasons: string[];
  cost_breakdown: CostBreakdown;
  foster_support: FosterSupport;
  housing_options: HousingOptions;
  why_this_school: string;
  source_urls: string[];
}

// ─── Semester Roadmap (V2) ────────────────────────────────────────────────────
export interface RoadmapTask {
  task: string;
  why: string;
  deadline: string | null;
  depends_on: string[] | null;
  estimated_time: string;
  help_from: string;
  category: 'financial' | 'academic' | 'housing' | 'administrative' | 'support';
}

export interface RoadmapPhase {
  name: string;
  phase_type: 'preparation' | 'active_semester' | 'summer' | 'graduation';
  tasks: RoadmapTask[];
  semester_cost_estimate: number | null;
  funding_applied: string;
}

export interface SemesterRoadmap {
  recommended_start: string;
  total_semesters_to_degree: number;
  based_on_school: string;
  phases: RoadmapPhase[];
}

// ─── Action Plan (V2) ─────────────────────────────────────────────────────────
export interface ActionStep {
  step_number: number;
  title: string;
  why_this_is_next: string;
  deadline: string | null;
  days_until_deadline: number | null;
  urgency_note: string | null;
  documents_needed: Array<{ name: string; status: 'have' | 'need'; how_to_get?: string }>;
  specific_action: string;
  where_to_go: string;
  what_to_bring: string;
  estimated_time: string;
  confidence: 'certain' | 'high' | 'verify';
  verify_with: string;
  source_url: string;
}

// ─── Score Deltas ─────────────────────────────────────────────────────────────
export interface ScoreDelta {
  academic: number;
  financial_aid: number;
  application: number;
  timeline: number;
  overall: number;
  unlocks: number[];
}

// ─── Full Assessment Result (V2 — kept for demo-data + pdf-export) ───────────
export interface AssessmentResult {
  readiness: ReadinessScore;
  matched_programs: MatchedProgram[];
  school_matches: SchoolMatch[];
  other_options_note: string;
  action_plan: ActionStep[];
  semester_roadmap: SemesterRoadmap;
  score_deltas: Record<number, ScoreDelta>;
  key_insight: string;
}

// ─── V3 Per-Section Result Types ──────────────────────────────────────────────

/** Slim program summary shown on the Overview tab */
export interface MatchedProgramSummary {
  id: string;
  name: string;
  max_amount: string;
  confidence: 'eligible' | 'likely_eligible' | 'verify';
  confidence_reason: string;
  next_action: string;
}

/** Tab 1 — auto-fires on intake submit */
export interface OverviewResult {
  readiness: ReadinessScore;
  matched_programs: MatchedProgramSummary[];
  key_insight: string;
}

/** Tab 2 — on-demand: full financial aid details */
export interface FinancialAidResult {
  matched_programs: MatchedProgram[];
}

/** Tab 3 — on-demand: school matches with cost breakdowns */
export interface SchoolMatchResult {
  school_matches: SchoolMatch[];
  other_options_note: string;
}

/** Tab 4 — on-demand: sequenced action plan + score deltas */
export interface ActionPlanResult {
  action_plan: ActionStep[];
  score_deltas: Record<number, ScoreDelta>;
}

/** Tab 5 — on-demand: semester roadmap (requires schoolResult first) */
export interface RoadmapResult {
  semester_roadmap: SemesterRoadmap;
}

// ─── Contextual Tab Preferences (Task 6) ─────────────────────────────────────

/** Extra context collected in the Schools tab before generating */
export interface SchoolPreferences {
  location?: string;
  priorities?: string[];
  transportation?: string;
}

/** Extra context collected in the Action Plan tab before generating */
export interface ActionPlanContext {
  has_caseworker?: string;
  housing_situation?: string; // never echoed in visible UI — Safeguard 7
  income_status?: string;     // never echoed in visible UI — Safeguard 7
}

/** Extra context collected in the Roadmap tab before generating */
export interface RoadmapPreferences {
  attendance?: 'full_time' | 'part_time' | 'not_sure';
  housing_preference?: 'on_campus' | 'off_campus' | 'not_sure';
}

// ─── Dashboard State ──────────────────────────────────────────────────────────

/** Union of all section states stored in App.tsx */
export interface DashboardState {
  intakeData: IntakeFormData;
  overviewResult: OverviewResult | null;
  financialResult: FinancialAidResult | null;
  schoolResult: SchoolMatchResult | null;
  actionResult: ActionPlanResult | null;
  roadmapResult: RoadmapResult | null;
  isDemo: boolean;
}
