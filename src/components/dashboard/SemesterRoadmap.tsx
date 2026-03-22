import { useState, useEffect } from 'react';
import type { SemesterRoadmap as SemesterRoadmapType, RoadmapPhase, RoadmapTask } from '../../lib/types';

interface SemesterRoadmapProps {
  roadmap: SemesterRoadmapType;
}

const CATEGORY_COLORS: Record<RoadmapTask['category'], string> = {
  financial:      '#3B6D11',
  academic:       '#0F6E56',
  housing:        '#BA7517',
  administrative: '#6B6A65',
  support:        '#D85A30',
};

const PHASE_TYPE_STYLES: Record<RoadmapPhase['phase_type'], { pill: string; label: string }> = {
  preparation:     { pill: 'bg-[#BA7517]/10 text-[#BA7517]',     label: 'Preparation' },
  active_semester: { pill: 'bg-[#0F6E56]/10 text-[#0F6E56]',     label: 'Active Semester' },
  summer:          { pill: 'bg-sky-50 text-sky-600',              label: 'Summer' },
  graduation:      { pill: 'bg-amber-50 text-amber-700',          label: 'Graduation' },
};

const FALLBACK_PHASE_STYLE = { pill: 'bg-[#6B6A65]/10 text-[#6B6A65]', label: 'Phase' };

function fmt(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function extractFundingAmount(str: string | null | undefined): string {
  if (!str) return '—';
  const matches = str.match(/[\d,]+/g);
  if (!matches) return 'Covered';
  const total = matches
    .map((m) => parseInt(m.replace(/,/g, ''), 10))
    .reduce((a, b) => a + b, 0);
  return fmt(total);
}

function StepperBar({
  phases,
  selectedIndex,
  setSelectedIndex,
}: {
  phases: RoadmapPhase[];
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
}) {
  return (
    <div
      className="overflow-x-auto pb-2 mb-4"
      style={{ scrollbarWidth: 'none' }}
      role="group"
      aria-label="Roadmap phases"
    >
      <div className="flex items-center min-w-max px-2">
        {phases.map((phase, i) => (
          <div key={i} className="flex items-center">
            {i > 0 && (
              <div className="h-[2px] w-12 sm:w-16 bg-[#E2DED6] flex-shrink-0" aria-hidden="true" />
            )}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setSelectedIndex(i)}
                aria-label={`Phase ${i + 1}: ${phase.name}`}
                aria-current={selectedIndex === i ? 'step' : undefined}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  selectedIndex === i
                    ? 'bg-[#0F6E56] text-white shadow-md ring-4 ring-[#0F6E56]/20'
                    : 'bg-white border-2 border-[#E2DED6] text-[#5C6B63] hover:border-[#0F6E56]/40'
                }`}
              >
                {phase.phase_type === 'graduation' ? '🎓' : i + 1}
              </button>
              <span
                className="text-[10px] text-[#5C6B63] text-center"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {phase.name.length > 8 ? phase.name.slice(0, 7) + '…' : phase.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  small,
}: {
  label: string;
  value: string;
  color: string;
  small?: boolean;
}) {
  return (
    <div className="flex-1 px-4 py-3 text-center">
      <p
        className="text-[10px] uppercase tracking-wider text-[#5C6B63] mb-1"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {label}
      </p>
      {small ? (
        <p className="text-sm font-semibold" style={{ color }}>
          {value}
        </p>
      ) : (
        <p
          className="text-2xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color }}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function DetailPanel({
  phase,
  phaseIndex,
  totalPhases,
  onPrev,
  onNext,
}: {
  phase: RoadmapPhase;
  phaseIndex: number;
  totalPhases: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const typeStyle = PHASE_TYPE_STYLES[phase.phase_type] ?? FALLBACK_PHASE_STYLE;
  const tasks = phase.tasks ?? [];
  const costValue = phase.semester_cost_estimate != null ? fmt(phase.semester_cost_estimate) : '—';
  const fundingValue = extractFundingAmount(phase.funding_applied);

  return (
    <div className="bg-white border border-[#E2DED6] rounded-2xl p-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
        <div>
          <h3
            className="text-xl font-bold text-[#1A2A22]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {phase.name}
          </h3>
          <span
            className={`inline-block text-[11px] font-semibold rounded-full px-2.5 py-0.5 mt-1 ${typeStyle.pill}`}
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {typeStyle.label}
          </span>
        </div>

        {/* Prev / Next buttons */}
        <div className="flex items-center gap-3 flex-shrink-0 mt-1">
          <button
            onClick={onPrev}
            disabled={phaseIndex === 0}
            aria-label="Previous phase"
            className={`text-sm font-medium transition-colors ${
              phaseIndex === 0
                ? 'text-[#E2DED6] cursor-not-allowed'
                : 'text-[#0F6E56] hover:text-[#0a5442]'
            }`}
          >
            ← Prev
          </button>
          <span className="text-[#E2DED6]" aria-hidden="true">|</span>
          <button
            onClick={onNext}
            disabled={phaseIndex === totalPhases - 1}
            aria-label="Next phase"
            className={`text-sm font-medium transition-colors ${
              phaseIndex === totalPhases - 1
                ? 'text-[#E2DED6] cursor-not-allowed'
                : 'text-[#0F6E56] hover:text-[#0a5442]'
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Stat row */}
      <div className="flex divide-x divide-[#E2DED6] border border-[#E2DED6] rounded-xl overflow-hidden mt-4 mb-4">
        <StatCard label="Tasks" value={String(tasks.length)} color="#1A2A22" />
        <StatCard label="Est. Cost" value={costValue} color="#0F6E56" />
        <StatCard label="Funding" value={fundingValue} color="#3B6D11" small={fundingValue.length > 8} />
      </div>

      {/* Task table */}
      {tasks.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#5C6B63] uppercase tracking-wide mb-2">
            Tasks this phase
          </p>
          <div className="border border-[#E2DED6] rounded-xl overflow-hidden">
            {tasks.map((task, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-2.5 px-3 border-b border-[#E2DED6] last:border-b-0 bg-white"
              >
                {/* Category dot */}
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: CATEGORY_COLORS[task.category] ?? '#6B6A65' }}
                />
                {/* Task text */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm text-[#1A2A22]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {task.task}
                  </p>
                  {task.deadline && (
                    <p
                      className="text-[11px] text-[#BA7517] mt-0.5"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      Due: {task.deadline}
                    </p>
                  )}
                </div>
                {/* Time estimate */}
                <span
                  className="text-[11px] text-[#5C6B63] flex-shrink-0 mt-0.5"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {task.estimated_time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Funding section */}
      {phase.funding_applied && (
        <div className="mt-4 pt-4 border-t border-[#E2DED6]">
          <p className="text-xs font-semibold text-[#5C6B63] uppercase tracking-wide mb-1">
            Funding this phase
          </p>
          <p
            className="text-sm text-[#0F6E56] font-medium"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {phase.funding_applied}
          </p>
        </div>
      )}
    </div>
  );
}

export function SemesterRoadmap({ roadmap }: SemesterRoadmapProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Clamp selectedIndex when phases array shrinks (e.g. new roadmap loaded)
  useEffect(() => {
    if (roadmap?.phases && selectedIndex >= roadmap.phases.length) {
      setSelectedIndex(Math.max(0, roadmap.phases.length - 1));
    }
  }, [roadmap?.phases?.length, selectedIndex]);

  if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) return null;

  const { phases } = roadmap;
  const safeIndex = Math.min(selectedIndex, phases.length - 1);
  const selectedPhase = phases[safeIndex];

  function handlePrev() {
    setSelectedIndex((i) => Math.max(0, i - 1));
  }

  function handleNext() {
    setSelectedIndex((i) => Math.min(phases.length - 1, i + 1));
  }

  return (
    <section>
      {/* Header */}
      <div className="bg-[#0F6E56] text-white rounded-2xl px-5 py-4 mb-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p
            className="text-[11px] font-semibold text-white/70 uppercase tracking-widest mb-0.5"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Your Path to Graduation
          </p>
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {roadmap.based_on_school}
          </h2>
          <p className="text-[12px] text-white/80 mt-0.5">
            Starting {roadmap.recommended_start}
          </p>
        </div>
        <div className="bg-white/15 rounded-xl px-4 py-2.5 text-center">
          <p
            className="text-2xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {roadmap.total_semesters_to_degree}
          </p>
          <p className="text-[11px] text-white/80">semesters to degree</p>
        </div>
      </div>

      {/* Stepper bar */}
      <StepperBar
        phases={phases}
        selectedIndex={safeIndex}
        setSelectedIndex={setSelectedIndex}
      />

      {/* Detail panel */}
      <DetailPanel
        phase={selectedPhase}
        phaseIndex={safeIndex}
        totalPhases={phases.length}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
}
