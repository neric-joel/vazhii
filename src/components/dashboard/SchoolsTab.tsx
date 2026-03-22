import { useState } from 'react';
import type { IntakeFormData, SchoolMatchResult, SchoolPreferences } from '../../lib/types';
import { fetchSchoolMatches } from '../../lib/claude';
import { SchoolMatches } from './SchoolMatches';
import { SectionIntro } from './SectionIntro';
import { TabQuestions } from './TabQuestions';
import type { TabQuestion } from './TabQuestions';
import { SchoolsSkeleton } from '../shared/Shimmer';

interface SchoolsTabProps {
  intakeData: IntakeFormData;
  result: SchoolMatchResult | null;
  onLoaded: (r: SchoolMatchResult) => void;
}

const SCHOOL_QUESTIONS: TabQuestion[] = [
  {
    id: 'location',
    label: 'Where in Arizona are you located?',
    type: 'radio',
    options: [
      { value: 'phoenix_metro', label: 'Phoenix Metro' },
      { value: 'tucson', label: 'Tucson' },
      { value: 'flagstaff', label: 'Flagstaff' },
      { value: 'other', label: 'Other / Not sure' },
    ],
  },
  {
    id: 'priorities',
    label: 'What matters most to you in a school?',
    type: 'multiselect',
    options: [
      { value: 'low_cost', label: 'Low cost' },
      { value: 'foster_support', label: 'Foster support program' },
      { value: 'close_to_home', label: 'Close to where I live' },
      { value: 'online_options', label: 'Online options' },
      { value: 'four_year_degree', label: '4-year degree path' },
    ],
  },
  {
    id: 'transportation',
    label: 'Do you have reliable transportation?',
    type: 'radio',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'public_transit', label: 'Public transit only' },
      { value: 'no', label: 'No' },
    ],
  },
];

export function SchoolsTab({ intakeData, result, onLoaded }: SchoolsTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const handleAnswerChange = (id: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const buildPrefs = (): SchoolPreferences => ({
    location: (answers.location as string) || undefined,
    priorities: (answers.priorities as string[])?.length ? (answers.priorities as string[]) : undefined,
    transportation: (answers.transportation as string) || undefined,
  });

  const handleGenerate = () => {
    setIsLoading(true);
    setIsError(false);
    fetchSchoolMatches(intakeData, buildPrefs())
      .then(r => { onLoaded(r); })
      .catch(() => { setIsError(true); })
      .finally(() => { setIsLoading(false); });
  };

  if (isLoading) return <SchoolsSkeleton />;

  if (!result) {
    return (
      <div className="max-w-lg mx-auto mt-8 mb-4 px-4">
        <TabQuestions
          questions={SCHOOL_QUESTIONS}
          answers={answers}
          onChange={handleAnswerChange}
        />
        <SectionIntro
          icon="🏫"
          title="Your School Matches"
          description="Find the best-fit Arizona schools for your situation — with full cost breakdowns showing exactly how your grants and waivers stack."
          ctaLabel="Find My School Matches →"
          note="All questions above are optional. Skip any you'd prefer not to answer."
          isLoading={isLoading}
          isError={isError}
          onGenerate={handleGenerate}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-5">
      <SchoolMatches
        schools={result.school_matches}
        otherOptionsNote={result.other_options_note}
      />
    </div>
  );
}
