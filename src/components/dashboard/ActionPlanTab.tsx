import { useState, useCallback } from 'react';
import type { IntakeFormData, ActionPlanResult, OverviewResult, ActionPlanContext } from '../../lib/types';
import { fetchActionPlan } from '../../lib/claude';
import { ActionPlan } from './ActionPlan';
import { SectionIntro } from './SectionIntro';
import { TabQuestions } from './TabQuestions';
import type { TabQuestion } from './TabQuestions';
import { applyAllCompletedDeltas } from '../../lib/score-engine';
import { ActionPlanSkeleton } from '../shared/Shimmer';

interface ActionPlanTabProps {
  intakeData: IntakeFormData;
  result: ActionPlanResult | null;
  overviewResult: OverviewResult | null;
  onLoaded: (r: ActionPlanResult) => void;
}

const ACTION_PLAN_QUESTIONS: TabQuestion[] = [
  {
    id: 'has_caseworker',
    label: 'Do you have a caseworker or advocate helping you?',
    type: 'radio',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'not_sure', label: 'Not sure' },
    ],
  },
  {
    id: 'housing_situation',
    label: "What's your current housing situation?",
    type: 'radio',
    sensitive: true,
    options: [
      { value: 'family', label: 'Living with family' },
      { value: 'group_home', label: 'Group home' },
      { value: 'on_my_own', label: 'On my own' },
      { value: 'transitional', label: 'Transitional housing' },
    ],
  },
  {
    id: 'income_status',
    label: 'Do you have any income right now?',
    type: 'radio',
    sensitive: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
];

export function ActionPlanTab({ intakeData, result, overviewResult, onLoaded }: ActionPlanTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const handleAnswerChange = (id: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const buildContext = (): ActionPlanContext => ({
    has_caseworker: (answers.has_caseworker as string) || undefined,
    housing_situation: (answers.housing_situation as string) || undefined,
    income_status: (answers.income_status as string) || undefined,
  });

  const handleGenerate = () => {
    setIsLoading(true);
    setIsError(false);
    fetchActionPlan(intakeData, buildContext())
      .then(r => { onLoaded(r); })
      .catch(() => { setIsError(true); })
      .finally(() => { setIsLoading(false); });
  };

  const handleToggleStep = useCallback((stepNumber: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepNumber)) {
        next.delete(stepNumber);
      } else {
        next.add(stepNumber);
      }
      return next;
    });
  }, []);

  if (isLoading) return <ActionPlanSkeleton />;

  if (!result) {
    return (
      <div className="max-w-lg mx-auto mt-8 mb-4 px-4">
        <TabQuestions
          questions={ACTION_PLAN_QUESTIONS}
          answers={answers}
          onChange={handleAnswerChange}
        />
        <SectionIntro
          icon="📋"
          title="Your Action Plan"
          description="Get a step-by-step plan — what to do first, what documents you need, who to contact, and how each step improves your readiness score."
          ctaLabel="Build My Action Plan →"
          note="All questions above are optional. Sensitive fields are never shown in summaries."
          isLoading={isLoading}
          isError={isError}
          onGenerate={handleGenerate}
        />
      </div>
    );
  }

  // Build a synthetic result shape that ActionPlan expects.
  const baseReadiness = overviewResult?.readiness ?? {
    overall: 50,
    academic: { score: 50, summary: '' },
    financial_aid: { score: 50, summary: '' },
    application: { score: 50, summary: '' },
    timeline: { score: 50, summary: '' },
    overall_summary: '',
  };

  const syntheticResult = {
    readiness: baseReadiness,
    action_plan: result.action_plan,
    score_deltas: result.score_deltas,
    matched_programs: [],
    school_matches: [],
    other_options_note: '',
    semester_roadmap: { recommended_start: '', total_semesters_to_degree: 0, based_on_school: '', phases: [] },
    key_insight: '',
  };

  const currentScores = applyAllCompletedDeltas(completedSteps, syntheticResult);

  return (
    <div className="max-w-6xl mx-auto px-6 py-5">
      <ActionPlan
        result={syntheticResult}
        completedSteps={completedSteps}
        scores={currentScores}
        onToggleStep={handleToggleStep}
      />
    </div>
  );
}
