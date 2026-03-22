import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { IntakeFormData, OverviewResult, MatchedProgramSummary } from '../../lib/types';
import { fetchOverview } from '../../lib/claude';
import { OverviewSkeleton } from '../shared/Shimmer';

interface OverviewTabProps {
  intakeData: IntakeFormData;
  result: OverviewResult | null;
  onLoaded: (r: OverviewResult) => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const PLANNED_START_DATES: Record<string, Date | null> = {
  summer_2026: new Date('2026-06-02'),
  fall_2026: new Date('2026-08-25'),
  spring_2027: new Date('2027-01-12'),
  fall_2027: new Date('2027-08-24'),
  not_sure: null,
};

const PLANNED_START_LABELS: Record<string, string> = {
  summer_2026: 'SUMMER 2026',
  fall_2026: 'FALL 2026',
  spring_2027: 'SPRING 2027',
  fall_2027: 'FALL 2027',
  not_sure: 'START DATE',
};

function getDaysUntil(planned_start: string): number | null {
  const target = PLANNED_START_DATES[planned_start];
  if (!target) return null;
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function parseDollarAmount(str: string): number {
  const match = str.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

function sumFunding(programs: MatchedProgramSummary[]): number {
  return programs.reduce((acc, p) => acc + parseDollarAmount(p.max_amount), 0);
}


function confidenceColor(confidence: MatchedProgramSummary['confidence']): string {
  if (confidence === 'eligible') return '#0F6E56';
  if (confidence === 'likely_eligible') return '#BA7517';
  return '#D85A30';
}

// ─── Count-up hook ───────────────────────────────────────────────────────────

function useCountUp(target: number, enabled: boolean, duration = 800): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || target === 0) {
      setValue(target);
      return;
    }
    setValue(0);
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, enabled, duration]);

  return value;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  valueDisplay?: string; // override animated number (e.g. "—")
  sublabel: string;
  color: string;
  prefix?: string;
  suffix?: string;
  animate: boolean;
}

function StatCard({ label, value, valueDisplay, sublabel, color, prefix = '', suffix = '', animate }: StatCardProps) {
  const animated = useCountUp(value, animate && valueDisplay === undefined);
  const display = valueDisplay !== undefined ? valueDisplay : `${prefix}${animated.toLocaleString()}${suffix}`;

  return (
    <div className="bg-white border border-[#E2DED6] rounded-xl p-4 flex flex-col gap-1.5">
      <p
        className="text-[10px] uppercase tracking-wider text-[#5C6B63]"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {label}
      </p>
      <p
        className="leading-none font-bold text-[2.25rem]"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color, lineHeight: 1 }}
      >
        {display}
      </p>
      <p className="text-[11px] text-[#5C6B63]" style={{ fontFamily: 'Inter, sans-serif' }}>
        {sublabel}
      </p>
    </div>
  );
}

// ─── Panel wrapper ───────────────────────────────────────────────────────────

interface PanelProps {
  title: string;
  onChevronClick?: () => void;
  children: React.ReactNode;
}

function Panel({ title, onChevronClick, children }: PanelProps) {
  return (
    <div className="bg-white border border-[#E2DED6] rounded-xl p-4 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-[#1A2A22]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {title}
        </p>
        {onChevronClick && (
          <button
            onClick={onChevronClick}
            className="text-[#5C6B63] hover:text-[#0F6E56] transition-colors p-0.5 rounded"
            aria-label={`Navigate to ${title}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      <div className="flex flex-col flex-1">{children}</div>
    </div>
  );
}

// ─── Panel row ───────────────────────────────────────────────────────────────

function PanelRow({ isLast, children }: { isLast: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`flex items-center gap-2 py-2.5 ${isLast ? '' : 'border-b border-[#E2DED6]'}`}
    >
      {children}
    </div>
  );
}

// ─── Score Breakdown Panel ────────────────────────────────────────────────────

interface ScoreBreakdownPanelProps {
  academic: number;
  financial_aid: number;
  application: number;
  timeline: number;
}

const SCORE_CATEGORIES = [
  { key: 'academic', label: 'Academic', color: '#0F6E56' },
  { key: 'financial_aid', label: 'Financial Aid', color: '#3B6D11' },
  { key: 'application', label: 'Application', color: '#BA7517' },
  { key: 'timeline', label: 'Timeline', color: '#D85A30' },
] as const;

function ScoreBreakdownPanel({ academic, financial_aid, application, timeline }: ScoreBreakdownPanelProps) {
  const values: Record<string, number> = { academic, financial_aid, application, timeline };

  const sorted = [...SCORE_CATEGORIES].sort((a, b) => values[b.key] - values[a.key]);

  return (
    <>
      {sorted.map((cat, i) => (
        <PanelRow key={cat.key} isLast={i === sorted.length - 1}>
          <p className="text-sm text-[#5C6B63] w-24 flex-shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            {cat.label}
          </p>
          <div className="flex-1 h-1.5 rounded-full bg-[#E2DED6] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${values[cat.key]}%`, background: cat.color }}
            />
          </div>
          <span
            className="text-sm font-semibold w-8 text-right flex-shrink-0"
            style={{ fontFamily: 'Inter, sans-serif', color: cat.color }}
          >
            {values[cat.key]}
          </span>
        </PanelRow>
      ))}
    </>
  );
}

// ─── Matched Programs Panel ───────────────────────────────────────────────────

const CONFIDENCE_LABELS: Record<MatchedProgramSummary['confidence'], string> = {
  eligible: 'Likely eligible',
  likely_eligible: 'May be eligible — verify',
  verify: 'Eligibility unconfirmed — verify',
};

function MatchedProgramsPanel({ programs }: { programs: MatchedProgramSummary[] }) {
  const sorted = [...programs]
    .sort((a, b) => parseDollarAmount(b.max_amount) - parseDollarAmount(a.max_amount))
    .slice(0, 4);

  return (
    <>
      {sorted.map((p, i) => (
        <PanelRow key={p.id} isLast={i === sorted.length - 1}>
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: confidenceColor(p.confidence) }}
            title={CONFIDENCE_LABELS[p.confidence]}
            aria-label={CONFIDENCE_LABELS[p.confidence]}
            role="img"
          />
          <p
            className="text-sm text-[#1A2A22] flex-1 truncate"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {p.name}
          </p>
          <span
            className="text-sm font-medium text-[#1A2A22] flex-shrink-0"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {p.max_amount} max
          </span>
        </PanelRow>
      ))}
      {sorted.length > 0 && (
        <div className="flex items-center gap-3 pt-2 mt-1 border-t border-[#E2DED6]">
          <span className="text-[10px] text-[#5C6B63]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Eligibility:
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[#5C6B63]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#0F6E56' }} /> Likely eligible
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[#5C6B63]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#BA7517' }} /> May qualify
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[#5C6B63]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#D85A30' }} /> Verify first
          </span>
        </div>
      )}
    </>
  );
}

// ─── Next Actions Panel ───────────────────────────────────────────────────────

function NextActionsPanel({ programs, onNavigate }: { programs: MatchedProgramSummary[]; onNavigate: () => void }) {
  const actions = programs.slice(0, 3);

  return (
    <>
      {actions.map((p, i) => {
        const isLast = i === actions.length - 1;
        return (
          <PanelRow key={p.id} isLast={isLast}>
            <p
              className="text-sm text-[#1A2A22] flex-1 min-w-0 line-clamp-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {p.next_action}
            </p>
            <button
              onClick={onNavigate}
              className="text-[11px] text-[#0F6E56] font-medium hover:underline flex-shrink-0 ml-2"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              aria-label={`See full details for ${p.name} in Funding tab`}
            >
              Details →
            </button>
          </PanelRow>
        );
      })}
      {programs.length < 3 && (
        <PanelRow isLast={true}>
          <button
            onClick={onNavigate}
            className="text-sm text-[#0F6E56] font-medium hover:underline"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Generate action plan →
          </button>
        </PanelRow>
      )}
    </>
  );
}


// ─── Main Component ───────────────────────────────────────────────────────────

export function OverviewTab({ intakeData, result, onLoaded }: OverviewTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const hasFired = useRef(false);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (result !== null || hasFired.current) return;
    hasFired.current = true;
    setIsLoading(true);
    fetchOverview(intakeData)
      .then(r => { onLoaded(r); })
      .finally(() => { setIsLoading(false); });
  }, [intakeData, result, onLoaded]);

  // Trigger count-up animation once result arrives
  useEffect(() => {
    if (result) {
      const raf = requestAnimationFrame(() => setAnimateIn(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [result]);

  const navigateTo = useCallback(
    (tab: string) => setSearchParams({ tab }),
    [setSearchParams]
  );

  if (isLoading) return <OverviewSkeleton />;
  if (!result) return null;

  // ── Derived values ──────────────────────────────────────────────────────────
  const overallScore = result.readiness.overall;
  const programs = result.matched_programs;
  const fundingSum = sumFunding(programs);
  const programCount = programs.length;
  const daysUntil = getDaysUntil(intakeData.planned_start);
  const startLabel = PLANNED_START_LABELS[intakeData.planned_start] ?? 'START DATE';


  return (
    <div className="max-w-6xl mx-auto px-6 py-5 space-y-3">
      {/* ── TOP ROW: 4 stat cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="READINESS SCORE"
          value={overallScore}
          sublabel="AI estimate — a guide, not a grade"
          color="#0F6E56"
          suffix=""
          animate={animateIn}
        />
        <StatCard
          label="MAX POSSIBLE FUNDING"
          value={fundingSum}
          valueDisplay={fundingSum === 0 ? '—' : undefined}
          sublabel={fundingSum === 0 ? 'full tuition programs' : `up to — eligibility unconfirmed`}
          color="#3B6D11"
          animate={animateIn}
          prefix="$"
        />
        <StatCard
          label="PROGRAMS MATCHED"
          value={programCount}
          sublabel={`${programCount === 1 ? 'program' : 'programs'} found for you`}
          color="#BA7517"
          animate={animateIn}
        />
        <StatCard
          label={`DAYS UNTIL ${startLabel}`}
          value={daysUntil ?? 0}
          valueDisplay={daysUntil === null ? '—' : daysUntil < 0 ? '0' : undefined}
          sublabel={
            daysUntil === null
              ? 'select a start date'
              : daysUntil < 0
              ? 'start date passed'
              : `until ${startLabel.toLowerCase()}`
          }
          color="#1A2A22"
          animate={animateIn && daysUntil !== null && daysUntil >= 0}
        />
      </div>

      {/* ── MIDDLE ROW: 3 panels ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Panel 1: Score Breakdown */}
        <Panel title="Score breakdown">
          <ScoreBreakdownPanel
            academic={result.readiness.academic.score}
            financial_aid={result.readiness.financial_aid.score}
            application={result.readiness.application.score}
            timeline={result.readiness.timeline.score}
          />
        </Panel>

        {/* Panel 2: Matched Programs */}
        <Panel
          title="Matched programs"
          onChevronClick={() => navigateTo('financial')}
        >
          <MatchedProgramsPanel programs={programs} />
        </Panel>

        {/* Panel 3: Next Actions */}
        <Panel
          title="Next actions"
          onChevronClick={() => navigateTo('action')}
        >
          <NextActionsPanel
            programs={programs}
            onNavigate={() => navigateTo('action')}
          />
        </Panel>
      </div>

      {/* ── BOTTOM: Key Insight ───────────────────────────────────────────── */}
      <div className="bg-[#BA7517] rounded-xl p-4">
        <p
          className="text-[10px] uppercase tracking-wider text-white/70 mb-1"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          KEY INSIGHT
        </p>
        <p
          className="text-sm font-medium text-white leading-relaxed"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {result.key_insight}
        </p>
      </div>
    </div>
  );
}
