import type { IntakeFormData } from '../../../lib/types';

interface TimelineFieldProps {
  timeline: IntakeFormData['timeline'] | '';
  plannedStart: IntakeFormData['planned_start'] | '';
  onTimelineChange: (value: IntakeFormData['timeline']) => void;
  onPlannedStartChange: (value: IntakeFormData['planned_start']) => void;
}

const TIMELINE_OPTIONS: Array<{
  id: IntakeFormData['timeline'];
  label: string;
  sub: string;
  urgency: 'high' | 'medium' | 'low';
}> = [
  { id: 'still_in_care',  label: 'Still in foster care',       sub: "I'm currently in the system",     urgency: 'high' },
  { id: 'just_aged_out',  label: 'Just aged out (0–3 months)', sub: "I recently left care",             urgency: 'high' },
  { id: '3_12_months',    label: '3–12 months ago',            sub: "It's been a few months",           urgency: 'medium' },
  { id: 'over_a_year',    label: 'Over a year ago',            sub: "I've been out of care for a while", urgency: 'low' },
];

const URGENCY_STYLES = {
  high:   { label: 'Best timing', color: 'text-[#3B6D11] bg-green-50 border-green-200' },
  medium: { label: 'Good window', color: 'text-[#BA7517] bg-amber-50 border-amber-200' },
  low:    { label: 'Act now',     color: 'text-[#D85A30] bg-orange-50 border-orange-200' },
};

// Today: 2026-03-21 — compute months away for each semester
const START_OPTIONS: Array<{
  id: IntakeFormData['planned_start'];
  label: string;
  detail: string;
  monthsAway: string | null;
}> = [
  { id: 'summer_2026',  label: 'Summer 2026',  detail: 'May – July 2026',    monthsAway: '~2 months away' },
  { id: 'fall_2026',    label: 'Fall 2026',    detail: 'Aug – Dec 2026',     monthsAway: '~5 months away' },
  { id: 'spring_2027',  label: 'Spring 2027',  detail: 'Jan – May 2027',     monthsAway: '~10 months away' },
  { id: 'fall_2027',    label: 'Fall 2027',    detail: 'Aug – Dec 2027',     monthsAway: '~17 months away' },
  { id: 'not_sure',     label: "Not sure yet", detail: "AI picks the next best semester", monthsAway: null },
];

function CardButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 min-h-[64px]
        ${selected
          ? 'border-[#0F6E56] bg-[#0F6E56]/5 shadow-sm'
          : 'border-[#E2DED6] bg-white hover:border-[#0F6E56]/40'
        }`}
    >
      {children}
    </button>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all
      ${selected ? 'border-[#0F6E56] bg-[#0F6E56]' : 'border-[#E2DED6]'}`}>
      {selected && (
        <div className="w-full h-full rounded-full flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
      )}
    </div>
  );
}

export function TimelineField({
  timeline,
  plannedStart,
  onTimelineChange,
  onPlannedStartChange,
}: TimelineFieldProps) {
  return (
    <div className="space-y-8">

      {/* Question 1 — Where are you in the process? */}
      <div>
        <h2 className="text-2xl font-bold text-[#1C1C1A] mb-2"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          Where are you in the process?
        </h2>
        <p className="text-[#6B6A65] text-[15px]">
          This affects which deadlines you can still hit and which programs are most urgent.
        </p>
      </div>

      <div className="space-y-3">
        {TIMELINE_OPTIONS.map(opt => {
          const urgency = URGENCY_STYLES[opt.urgency];
          const selected = timeline === opt.id;
          return (
            <CardButton key={opt.id} selected={selected} onClick={() => onTimelineChange(opt.id)}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <RadioDot selected={selected} />
                  <div>
                    <p className="font-semibold text-[#1C1C1A] text-[15px]">{opt.label}</p>
                    <p className="text-[#6B6A65] text-[13px]">{opt.sub}</p>
                  </div>
                </div>
                <span className={`text-[13px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${urgency.color}`}>
                  {urgency.label}
                </span>
              </div>
            </CardButton>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-[#E2DED6]" />

      {/* Question 2 — When are you planning to start? */}
      <div>
        <h2 className="text-2xl font-bold text-[#1C1C1A] mb-2"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          When are you planning to start college?
        </h2>
        <p className="text-[#6B6A65] text-[15px]">
          This helps us calculate your deadlines and build your timeline.
        </p>
      </div>

      <div className="space-y-3">
        {START_OPTIONS.map(opt => {
          const selected = plannedStart === opt.id;
          return (
            <CardButton key={opt.id} selected={selected} onClick={() => onPlannedStartChange(opt.id)}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <RadioDot selected={selected} />
                  <div>
                    <p className="font-semibold text-[#1C1C1A] text-[15px]">{opt.label}</p>
                    <p className="text-[#6B6A65] text-[13px]">{opt.detail}</p>
                  </div>
                </div>
                {opt.monthsAway && (
                  <span className="text-[13px] font-medium px-2.5 py-0.5 rounded-full border
                    text-[#0F6E56] bg-[#0F6E56]/5 border-[#0F6E56]/20 flex-shrink-0">
                    {opt.monthsAway}
                  </span>
                )}
              </div>
            </CardButton>
          );
        })}
      </div>

    </div>
  );
}
