/**
 * Shimmer skeleton components for each dashboard tab.
 * Uses the `.skeleton` CSS class (shimmer animation in index.css).
 */

function Bone({ className }: { className: string }) {
  return <div className={`skeleton rounded ${className}`} />;
}

// ── Overview ─────────────────────────────────────────────────────────────────

export function OverviewSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-5 space-y-5">
      {/* Stat cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-[#E2DED6] rounded-2xl p-4 space-y-2">
            <Bone className="h-3 w-20" />
            <Bone className="h-8 w-14" />
            <Bone className="h-2 w-full" />
          </div>
        ))}
      </div>

      {/* Three data panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Score breakdown panel */}
        <div className="bg-white border border-[#E2DED6] rounded-2xl p-4 space-y-3">
          <Bone className="h-3 w-24" />
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="space-y-1">
              <Bone className="h-2.5 w-28" />
              <Bone className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>

        {/* Matched programs panel */}
        <div className="bg-white border border-[#E2DED6] rounded-2xl p-4 space-y-3">
          <Bone className="h-3 w-32" />
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-[#E2DED6] last:border-b-0">
              <div className="space-y-1 flex-1">
                <Bone className="h-2.5 w-36" />
                <Bone className="h-2 w-20" />
              </div>
              <Bone className="h-4 w-8 ml-3" />
            </div>
          ))}
        </div>

        {/* Next actions panel */}
        <div className="bg-white border border-[#E2DED6] rounded-2xl p-4 space-y-3">
          <Bone className="h-3 w-28" />
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-start gap-2 py-1 border-b border-[#E2DED6] last:border-b-0">
              <Bone className="h-4 w-4 rounded-full flex-shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <Bone className="h-2.5 w-full" />
                <Bone className="h-2 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key insight bar */}
      <div className="skeleton rounded-2xl h-14" />

      <p className="text-[13px] text-[#5C6B63] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        Analyzing your readiness — usually takes 10–15 seconds…
      </p>
    </div>
  );
}

// ── Funding ───────────────────────────────────────────────────────────────────

export function FundingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-5 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-[#E2DED6] rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 flex-1">
                <Bone className="h-3.5 w-40" />
                <Bone className="h-5 w-24" />
              </div>
              <Bone className="h-6 w-20 rounded-full" />
            </div>
            <Bone className="h-2 w-full" />
            <Bone className="h-2 w-4/5" />
            <div className="flex items-center gap-2 pt-1">
              <Bone className="h-2.5 w-28" />
              <Bone className="h-2.5 w-20" />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[13px] text-[#5C6B63] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        Building your funding details — usually takes 10–15 seconds…
      </p>
    </div>
  );
}

// ── Schools ───────────────────────────────────────────────────────────────────

export function SchoolsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-5 space-y-4">
      {[0, 1, 2].map(i => (
        <div key={i} className="bg-white border border-[#E2DED6] rounded-2xl p-5 space-y-4">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Bone className="h-5 w-56" />
              <Bone className="h-3 w-32" />
            </div>
            <Bone className="h-7 w-24 rounded-full" />
          </div>
          {/* Why text */}
          <Bone className="h-2.5 w-full" />
          <Bone className="h-2.5 w-4/5" />
          {/* Cost rows */}
          <div className="border border-[#E2DED6] rounded-xl overflow-hidden">
            {[0, 1, 2, 3, 4].map(j => (
              <div key={j} className="flex justify-between px-4 py-2 border-b border-[#E2DED6] last:border-b-0">
                <Bone className="h-2.5 w-28" />
                <Bone className="h-2.5 w-16" />
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-[13px] text-[#5C6B63] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        Finding your school matches — usually takes 15–20 seconds…
      </p>
    </div>
  );
}

// ── Action Plan ───────────────────────────────────────────────────────────────

export function ActionPlanSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-5 space-y-3">
      {/* Progress bar */}
      <Bone className="h-2 w-full rounded-full" />

      {/* Score callout */}
      <div className="bg-white border border-[#E2DED6] rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <Bone className="h-12 w-12 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Bone className="h-3 w-40" />
            <Bone className="h-2.5 w-60" />
          </div>
        </div>
      </div>

      {/* Step cards */}
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white border border-[#E2DED6] rounded-2xl overflow-hidden">
          {/* Step header */}
          <div className="bg-[#E2DED6]/40 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bone className="h-8 w-8 rounded-full flex-shrink-0" />
              <Bone className="h-3.5 w-48" />
            </div>
            <Bone className="h-5 w-16 rounded-full" />
          </div>
          {/* Step body */}
          <div className="px-4 py-3 space-y-2">
            <Bone className="h-2.5 w-full" />
            <Bone className="h-2.5 w-4/5" />
            <div className="flex gap-3 pt-1">
              <Bone className="h-2 w-24" />
              <Bone className="h-2 w-20" />
            </div>
          </div>
        </div>
      ))}

      <p className="text-[13px] text-[#5C6B63] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        Building your action plan — usually takes 15–20 seconds…
      </p>
    </div>
  );
}

// ── Roadmap ───────────────────────────────────────────────────────────────────

export function RoadmapSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-5 space-y-4">
      {/* Header banner */}
      <div className="skeleton rounded-2xl h-[80px]" />

      {/* Stepper bar */}
      <div className="flex items-center gap-0 px-2 pb-2">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center">
            {i > 0 && <div className="skeleton h-[2px] w-8 sm:w-10" />}
            <div className="flex flex-col items-center gap-1.5 w-[80px] sm:w-[100px]">
              <Bone className="h-10 w-10 rounded-full" />
              <Bone className="h-2 w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div className="bg-white border border-[#E2DED6] rounded-2xl p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Bone className="h-5 w-48" />
            <Bone className="h-4 w-24 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <Bone className="h-4 w-12" />
            <Bone className="h-4 w-12" />
          </div>
        </div>

        {/* Stat row */}
        <div className="flex divide-x divide-[#E2DED6] border border-[#E2DED6] rounded-xl overflow-hidden">
          {[0, 1, 2].map(j => (
            <div key={j} className="flex-1 px-4 py-3 text-center space-y-2">
              <Bone className="h-2.5 w-14 mx-auto" />
              <Bone className="h-8 w-10 mx-auto" />
            </div>
          ))}
        </div>

        {/* Task rows */}
        <div className="border border-[#E2DED6] rounded-xl overflow-hidden">
          {[0, 1, 2, 3].map(j => (
            <div key={j} className="flex items-center gap-3 py-2.5 px-3 border-b border-[#E2DED6] last:border-b-0">
              <Bone className="h-2 w-2 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <Bone className="h-2.5 w-full" />
                <Bone className="h-2 w-24" />
              </div>
              <Bone className="h-2.5 w-12 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <p className="text-[13px] text-[#5C6B63] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        Mapping your semester roadmap — usually takes 20–30 seconds…
      </p>
    </div>
  );
}
