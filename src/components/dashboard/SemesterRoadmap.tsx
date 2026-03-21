import type { SemesterRoadmap as SemesterRoadmapType, RoadmapPhase, RoadmapTask } from '../../lib/types';

interface SemesterRoadmapProps {
  roadmap: SemesterRoadmapType;
}

const PHASE_TYPE_CONFIG: Record<RoadmapPhase['phase_type'], { icon: string; color: string; bg: string }> = {
  preparation:    { icon: '◎', color: 'text-[#BA7517]', bg: 'bg-[#BA7517]' },
  active_semester: { icon: '●', color: 'text-[#0F6E56]', bg: 'bg-[#0F6E56]' },
  summer:         { icon: '○', color: 'text-[#6B6A65]', bg: 'bg-[#6B6A65]' },
  graduation:     { icon: '★', color: 'text-[#3B6D11]', bg: 'bg-[#3B6D11]' },
};

const CATEGORY_STYLES: Record<RoadmapTask['category'], { label: string; color: string }> = {
  financial:      { label: 'Financial',     color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  academic:       { label: 'Academic',      color: 'bg-blue-50 text-blue-700 border-blue-200' },
  housing:        { label: 'Housing',       color: 'bg-orange-50 text-orange-700 border-orange-200' },
  administrative: { label: 'Admin',         color: 'bg-purple-50 text-purple-700 border-purple-200' },
  support:        { label: 'Support',       color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function TaskRow({ task }: { task: RoadmapTask }) {
  const cat = CATEGORY_STYLES[task.category];

  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#F0EDE8] last:border-b-0">
      {/* Category dot */}
      <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-[#0F6E56] opacity-60 mt-2" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <p className="text-sm font-medium text-[#1C1C1A] leading-snug">{task.task}</p>
          <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cat.color}`}>
            {cat.label}
          </span>
        </div>
        <p className="text-xs text-[#6B6A65] mt-1 leading-relaxed">{task.why}</p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {task.deadline && (
            <span className="text-xs text-[#BA7517] font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {task.deadline}
            </span>
          )}
          <span className="text-xs text-[#6B6A65] flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {task.estimated_time}
          </span>
          <span className="text-xs text-[#6B6A65] flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {task.help_from}
          </span>
        </div>
        {task.depends_on && task.depends_on.length > 0 && (
          <p className="text-[10px] text-[#6B6A65] mt-1 italic">
            After: {task.depends_on.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}

function PhaseCard({ phase, index, isLast }: { phase: RoadmapPhase; index: number; isLast: boolean }) {
  const config = PHASE_TYPE_CONFIG[phase.phase_type];

  return (
    <div className="relative flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center shrink-0">
        {/* Dot */}
        <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center
                         shadow-sm ring-4 ring-white relative z-10`}>
          <span className="text-white text-xs font-bold">{index + 1}</span>
        </div>
        {/* Vertical line */}
        {!isLast && (
          <div className="w-px flex-1 bg-[#E2DED6] mt-1 mb-0" style={{ minHeight: '24px' }} />
        )}
      </div>

      {/* Phase content */}
      <div className="flex-1 pb-8">
        {/* Phase header */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-[#1C1C1A] leading-snug"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              {phase.name}
            </h3>
            {phase.semester_cost_estimate !== null && (
              <div className="shrink-0 bg-[#F5F3EE] border border-[#E2DED6] rounded-lg px-3 py-1 text-center">
                <p className="text-[10px] text-[#6B6A65] font-medium">Est. cost</p>
                <p className="text-sm font-bold text-[#1C1C1A]">{fmt(phase.semester_cost_estimate)}</p>
              </div>
            )}
          </div>
          {phase.funding_applied && (
            <p className="text-xs text-[#0F6E56] font-medium mt-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {phase.funding_applied}
            </p>
          )}
        </div>

        {/* Tasks */}
        {phase.tasks.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E2DED6] divide-y divide-[#F0EDE8] overflow-hidden">
            {phase.tasks.map((task, i) => (
              <TaskRow key={i} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SemesterRoadmap({ roadmap }: SemesterRoadmapProps) {
  if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) return null;

  return (
    <section>
      {/* Section header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#0F6E56] mb-1">
            Semester Roadmap
          </p>
          <h2 className="text-2xl font-bold text-[#1C1C1A]"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Your Path to Graduation
          </h2>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-[#6B6A65]">Start</p>
          <p className="text-sm font-semibold text-[#1C1C1A]">{roadmap.recommended_start}</p>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-[#6B6A65]">
          <svg className="w-4 h-4 text-[#0F6E56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          <span><strong className="text-[#1C1C1A]">{roadmap.total_semesters_to_degree}</strong> semesters to degree</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#6B6A65]">
          <svg className="w-4 h-4 text-[#0F6E56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>Based on <strong className="text-[#1C1C1A]">{roadmap.based_on_school}</strong></span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {Object.entries(PHASE_TYPE_CONFIG).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${cfg.bg}`} />
            <span className="text-xs text-[#6B6A65] capitalize">
              {type === 'active_semester' ? 'Semester' : type}
            </span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="pl-0">
        {roadmap.phases.map((phase, index) => (
          <PhaseCard
            key={index}
            phase={phase}
            index={index}
            isLast={index === roadmap.phases.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
