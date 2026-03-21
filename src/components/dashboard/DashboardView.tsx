import { useState, useCallback } from 'react';
import type { AssessmentResult } from '../../lib/types';
import {
  getInitialScores,
  applyAllCompletedDeltas,
  type ScoreState,
} from '../../lib/score-engine';
import { ReadinessSnapshot } from './ReadinessSnapshot';
import { FinancialAidCards } from './FinancialAidCards';
import { SchoolMatches } from './SchoolMatches';
import { ActionPlan } from './ActionPlan';
import { SemesterRoadmap } from './SemesterRoadmap';
import { exportToPDF } from '../../lib/pdf-export';

interface DashboardViewProps {
  result: AssessmentResult;
  onStartOver: () => void;
  isDemo?: boolean;
}

export function DashboardView({ result, onStartOver, isDemo = false }: DashboardViewProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const initialScores = getInitialScores(result);

  const currentScores: ScoreState = applyAllCompletedDeltas(completedSteps, result);

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

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(result, currentScores);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Header bar */}
      <div className="bg-white border-b border-[#E2DED6] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#1C1C1A] text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Vazhi <span className="text-[#0F6E56]">வழி</span>
            </p>
            <p className="text-xs text-[#6B6A65]">Your college readiness plan</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#0F6E56]
                         border border-[#0F6E56]/30 rounded-full px-3 py-1.5
                         hover:bg-[#0F6E56]/5 transition-colors disabled:opacity-60
                         min-h-[36px]"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {isExporting ? 'Exporting…' : 'Save PDF'}
            </button>
            <button
              onClick={onStartOver}
              className="text-xs text-[#6B6A65] hover:text-[#1C1C1A] transition-colors px-2 py-1.5 min-h-[36px]"
            >
              Start over
            </button>
          </div>
        </div>
      </div>

      {/* Demo Mode banner */}
      {isDemo && (
        <div className="bg-[#BA7517] text-white text-xs text-center py-2 px-4 font-medium">
          Demo Mode — This is sample data. Complete the intake form to get your real plan.
        </div>
      )}

      {/* Privacy banner */}
      <div className="bg-[#0F6E56] text-white text-xs text-center py-2 px-4">
        🔒 Your data stays in your browser. Nothing is stored or shared.
      </div>

      {/* Main content — V2 render order */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">

        {/* 1. Key Insight */}
        <div className="bg-[#BA7517] text-white rounded-2xl px-6 py-5 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Your Key Insight</p>
          <p className="text-base font-semibold leading-relaxed">{result.key_insight}</p>
        </div>

        {/* 2. Readiness Scores */}
        <ReadinessSnapshot
          readiness={result.readiness}
          scores={currentScores}
          originalScores={completedSteps.size > 0 ? initialScores : undefined}
        />

        {/* 3. Financial Aid */}
        <FinancialAidCards programs={result.matched_programs} />

        {/* 4. School Matches (V2) */}
        {result.school_matches && result.school_matches.length > 0 && (
          <SchoolMatches
            schools={result.school_matches}
            otherOptionsNote={result.other_options_note}
          />
        )}

        {/* 5. Action Plan */}
        <ActionPlan
          result={result}
          completedSteps={completedSteps}
          scores={currentScores}
          onToggleStep={handleToggleStep}
        />

        {/* 6. Semester Roadmap (V2) */}
        {result.semester_roadmap && result.semester_roadmap.phases && result.semester_roadmap.phases.length > 0 && (
          <SemesterRoadmap roadmap={result.semester_roadmap} />
        )}

        {/* 7. PDF Export */}
        <div className="bg-white border border-[#E2DED6] rounded-2xl px-6 py-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#1C1C1A] mb-1"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Download Your Plan
          </p>
          <p className="text-xs text-[#6B6A65] mb-4">
            Save a PDF to share with your caseworker, financial aid office, or campus champion.
          </p>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-[#0F6E56] hover:bg-[#0a4f3e] text-white text-sm font-semibold
                       px-8 py-3 rounded-full shadow-md hover:shadow-lg
                       transition-all duration-200 min-h-[44px] disabled:opacity-60
                       flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isExporting ? 'Exporting…' : 'Download Your Plan (PDF)'}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center py-4 space-y-2">
          <p className="text-xs text-[#6B6A65]">
            This plan is a navigation guide, not legal or financial advice.
            Always verify eligibility directly with the programs listed.
          </p>
          <p className="text-xs text-[#6B6A65]">
            Built for foster youth in Arizona · Vazhi வழி
          </p>
        </div>

      </main>
    </div>
  );
}
