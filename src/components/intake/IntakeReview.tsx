import type { IntakeFormData } from '../../lib/types';

interface IntakeReviewProps {
  data: IntakeFormData;
  onEdit: (step: number) => void;
}

const GOAL_LABELS: Record<string, string> = {
  community_college: 'Community College (2-year)',
  university: 'University (4-year)',
  trade_school: 'Trade / Vocational School',
  online: 'Online College',
  undecided: 'Not sure yet',
};

const TIMELINE_LABELS: Record<string, string> = {
  still_in_care: 'Still in foster care',
  just_aged_out: 'Just aged out (0–3 months)',
  '3_12_months': '3–12 months ago',
  over_a_year: 'Over a year ago',
};

const PLANNED_START_LABELS: Record<string, string> = {
  summer_2026: 'Summer 2026',
  fall_2026: 'Fall 2026',
  spring_2027: 'Spring 2027',
  fall_2027: 'Fall 2027',
  not_sure: 'Not sure yet',
};

const DOC_LABELS: Record<string, string> = {
  state_id: 'State ID / License',
  social_security_card: 'Social Security Card',
  birth_certificate: 'Birth Certificate',
  high_school_diploma_or_ged: 'HS Diploma / GED',
  school_transcripts: 'School Transcripts',
  proof_of_foster_care: 'Proof of Foster Care',
};

const BENEFIT_LABELS: Record<string, string> = {
  fafsa_complete: 'FAFSA Completed',
  etv_applied: 'Applied for AZ ETV',
  tuition_waiver_applied: 'Applied for Tuition Waiver',
  ahcccs_enrolled: 'Enrolled in AHCCCS',
  none_applied: 'None yet',
};

function ReviewRow({ label, value, onEdit, step }: { label: string; value: string; onEdit: (s: number) => void; step: number }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#E2DED6] last:border-0">
      <div>
        <p className="text-xs text-[#6B6A65] font-medium uppercase tracking-wide">{label}</p>
        <p className="text-[#1C1C1A] text-sm font-medium mt-0.5">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => onEdit(step)}
        className="text-[#0F6E56] text-xs font-semibold hover:underline flex-shrink-0 ml-4"
      >
        Edit
      </button>
    </div>
  );
}

export function IntakeReview({ data, onEdit }: IntakeReviewProps) {
  const docsList = data.documents.length > 0
    ? data.documents.map(d => DOC_LABELS[d] ?? d).join(', ')
    : 'None selected';

  const benefitsList = data.benefitsApplied.length > 0
    ? data.benefitsApplied.map(b => BENEFIT_LABELS[b] ?? b).join(', ')
    : 'None yet';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1C1C1A] mb-2"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          Look good?
        </h2>
        <p className="text-[#6B6A65] text-sm">
          Review your answers below. We'll use this to find your funding and build your plan.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2DED6] px-5 py-1 shadow-sm">
        <ReviewRow label="Age & State" value={`${data.age} years old · ${data.state}`} onEdit={onEdit} step={1} />
        <ReviewRow label="Education Goal" value={GOAL_LABELS[data.educationGoal] ?? data.educationGoal} onEdit={onEdit} step={2} />
        <ReviewRow label="Left care" value={TIMELINE_LABELS[data.timeline] ?? data.timeline} onEdit={onEdit} step={3} />
        <ReviewRow label="Planned start" value={PLANNED_START_LABELS[data.planned_start] ?? data.planned_start} onEdit={onEdit} step={3} />
        <ReviewRow label="Documents I have" value={docsList} onEdit={onEdit} step={4} />
        <ReviewRow label="Already applied for" value={benefitsList} onEdit={onEdit} step={5} />
      </div>

      <div className="bg-[#0F6E56]/5 border border-[#0F6E56]/20 rounded-xl px-4 py-3">
        <p className="text-xs text-[#0F6E56] font-medium">
          🔒 Your answers stay in your browser. Nothing is sent to any server except the AI assessment request.
        </p>
      </div>
    </div>
  );
}
