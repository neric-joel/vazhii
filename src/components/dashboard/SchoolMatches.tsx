import type { SchoolMatch } from '../../lib/types';
import { SchoolMatchCard } from './SchoolMatchCard';

interface SchoolMatchesProps {
  schools: SchoolMatch[];
  otherOptionsNote: string;
}

export function SchoolMatches({ schools, otherOptionsNote }: SchoolMatchesProps) {
  if (!schools || schools.length === 0) return null;

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#0F6E56] mb-1">
            School Matches
          </p>
          <h2 className="text-2xl font-bold text-[#1C1C1A]"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Your Top Matches
          </h2>
        </div>
        <span className="text-xs text-[#6B6A65] bg-[#F5F3EE] px-3 py-1.5 rounded-full border border-[#E2DED6]">
          {schools.length} schools matched
        </span>
      </div>

      {/* Intro explainer */}
      <p className="text-sm text-[#6B6A65] mb-5 leading-relaxed max-w-2xl">
        These schools are ranked by how well they match your situation — financial access,
        foster youth support, location, and your education goal. All three have Arizona's
        Tuition Waiver available.
      </p>

      {/* School cards */}
      <div className="space-y-5">
        {schools.map((school, index) => (
          <SchoolMatchCard
            key={school.id}
            school={school}
            rank={index + 1}
          />
        ))}
      </div>

      {/* Other options note */}
      <div className="mt-5 bg-[#F5F3EE] border border-[#E2DED6] rounded-xl px-5 py-4
                      flex items-start gap-3">
        <svg className="w-5 h-5 mt-0.5 shrink-0 text-[#0F6E56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-[#4A4A45] leading-relaxed">{otherOptionsNote}</p>
      </div>
    </section>
  );
}
