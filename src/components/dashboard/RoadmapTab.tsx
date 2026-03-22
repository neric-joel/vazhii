import { useState } from 'react';
import type { IntakeFormData, SchoolMatchResult, RoadmapResult, RoadmapPreferences } from '../../lib/types';
import { fetchRoadmap } from '../../lib/claude';
import { SemesterRoadmap } from './SemesterRoadmap';
import { SectionIntro } from './SectionIntro';
import { TabQuestions } from './TabQuestions';
import type { TabQuestion } from './TabQuestions';
import { RoadmapSkeleton } from '../shared/Shimmer';

interface RoadmapTabProps {
  intakeData: IntakeFormData;
  result: RoadmapResult | null;
  schoolResult: SchoolMatchResult | null;
  onLoaded: (r: RoadmapResult) => void;
}

const FIT_LABEL_STYLES: Record<string, string> = {
  'Strong match': 'bg-[#0F6E56]/10 text-[#0F6E56] border-[#0F6E56]/20',
  'Good match': 'bg-[#BA7517]/10 text-[#BA7517] border-[#BA7517]/20',
  'Worth exploring': 'bg-[#6B6A65]/10 text-[#5C6B63] border-[#6B6A65]/20',
};

const ROADMAP_QUESTIONS: TabQuestion[] = [
  {
    id: 'attendance',
    label: 'Are you planning to attend full-time or part-time?',
    type: 'radio',
    options: [
      { value: 'full_time', label: 'Full-time' },
      { value: 'part_time', label: 'Part-time' },
      { value: 'not_sure', label: 'Not sure yet' },
    ],
  },
  {
    id: 'housing_preference',
    label: 'Do you plan to live on campus or off campus?',
    type: 'radio',
    options: [
      { value: 'on_campus', label: 'On campus' },
      { value: 'off_campus', label: 'Off campus' },
      { value: 'not_sure', label: 'Not sure yet' },
    ],
  },
];

export function RoadmapTab({ intakeData, result, schoolResult, onLoaded }: RoadmapTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  // Auto-select top school when schoolResult first appears
  const effectiveSchoolId = selectedSchoolId ?? schoolResult?.school_matches?.[0]?.id ?? null;

  const handleAnswerChange = (id: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const buildPrefs = (): RoadmapPreferences => ({
    attendance: (answers.attendance as RoadmapPreferences['attendance']) || undefined,
    housing_preference: (answers.housing_preference as RoadmapPreferences['housing_preference']) || undefined,
  });

  const handleGenerate = () => {
    if (!effectiveSchoolId) return;
    setIsLoading(true);
    setIsError(false);
    fetchRoadmap(intakeData, effectiveSchoolId, buildPrefs())
      .then(r => { onLoaded(r); })
      .catch(() => { setIsError(true); })
      .finally(() => { setIsLoading(false); });
  };

  if (isLoading) return <RoadmapSkeleton />;

  // Gate: no school matches yet
  if (!schoolResult) {
    return (
      <SectionIntro
        icon="🗓️"
        title="Your Semester Roadmap"
        description="See your full path to graduation — semester by semester, with tasks, costs, and funding mapped out for each phase."
        ctaLabel="Map My Semesters →"
        isLoading={false}
        isError={false}
        onGenerate={() => {}}
        disabled
        disabledReason="Generate your School Matches first — the roadmap is built around your chosen school."
      />
    );
  }

  // Show generated roadmap
  if (result) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-5">
        <button
          onClick={() => onLoaded(null as unknown as RoadmapResult)}
          className="text-[13px] text-[#0F6E56] font-semibold hover:underline mb-6 flex items-center gap-1"
        >
          ← Try a different school
        </button>
        <SemesterRoadmap roadmap={result.semester_roadmap} />
      </div>
    );
  }

  // School picker + questions + CTA
  const selectedSchool = schoolResult.school_matches.find(s => s.id === effectiveSchoolId)
    ?? schoolResult.school_matches[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* School picker */}
      <div>
        <h2
          className="text-2xl font-bold text-[#1A2A22] mb-1"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Choose Your School
        </h2>
        <p className="text-[15px] text-[#5C6B63] mb-4">
          Select which school you'd like to build a roadmap for.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {schoolResult.school_matches.map(school => {
            const isSelected = school.id === effectiveSchoolId;
            return (
              <button
                key={school.id}
                type="button"
                onClick={() => setSelectedSchoolId(school.id)}
                className={`text-left rounded-2xl border-2 px-5 py-4 transition-all min-h-[44px]
                  ${isSelected
                    ? 'border-[#0F6E56] bg-[#0F6E56]/5 shadow-sm'
                    : 'border-[#E2DED6] bg-white hover:border-[#0F6E56]/40'
                  }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5
                    ${isSelected ? 'border-[#0F6E56] bg-[#0F6E56]' : 'border-[#E2DED6]'}`}
                  >
                    {isSelected && (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[13px] font-semibold px-2.5 py-1 rounded-full border ${FIT_LABEL_STYLES[school.fit_label] ?? ''}`}>
                    {school.fit_label}
                  </span>
                </div>
                <p className="text-[15px] font-semibold text-[#1A2A22] leading-snug">{school.name}</p>
                <p className="text-[13px] text-[#5C6B63] mt-0.5">
                  {school.type === 'community_college' ? 'Community College' : 'University'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contextual questions */}
      <TabQuestions
        questions={ROADMAP_QUESTIONS}
        answers={answers}
        onChange={handleAnswerChange}
      />

      {/* CTA */}
      <button
        onClick={handleGenerate}
        disabled={isLoading || !effectiveSchoolId}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl
          font-semibold text-base transition-all min-h-[52px] shadow-md
          ${isLoading
            ? 'bg-[#E2DED6] text-[#5C6B63] cursor-not-allowed'
            : 'bg-[#0F6E56] hover:bg-[#0a4f3e] text-white hover:shadow-lg'
          }`}
      >
        {isLoading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Building your roadmap…
          </>
        ) : (
          `Build My Roadmap for ${selectedSchool?.name ?? 'this school'} →`
        )}
      </button>

      {isError && (
        <div className="px-4 py-3 rounded-xl bg-orange-50 border border-orange-200">
          <p className="text-[13px] text-[#D85A30]">
            Something went wrong — showing demo data instead.{' '}
            <button onClick={handleGenerate} className="underline font-semibold">Try again</button>
          </p>
        </div>
      )}

      <p className="text-[13px] text-[#5C6B63] text-center">
        All questions above are optional. Skip any you'd prefer not to answer.
      </p>
    </div>
  );
}
