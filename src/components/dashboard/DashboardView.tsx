
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type {
  IntakeFormData,
  OverviewResult,
  FinancialAidResult,
  SchoolMatchResult,
  ActionPlanResult,
  RoadmapResult,
} from '../../lib/types';
import { exportToPDF } from '../../lib/pdf-export';
import { TabBar, type TabId } from './TabBar';
import { OverviewTab } from './OverviewTab';
import { FinancialAidTab } from './FinancialAidTab';
import { SchoolsTab } from './SchoolsTab';
import { ActionPlanTab } from './ActionPlanTab';
import { RoadmapTab } from './RoadmapTab';

interface DashboardViewProps {
  intakeData: IntakeFormData;
  overviewResult: OverviewResult | null;
  financialResult: FinancialAidResult | null;
  schoolResult: SchoolMatchResult | null;
  actionResult: ActionPlanResult | null;
  roadmapResult: RoadmapResult | null;
  isDemo: boolean;
  onOverviewLoaded: (r: OverviewResult) => void;
  onFinancialLoaded: (r: FinancialAidResult) => void;
  onSchoolsLoaded: (r: SchoolMatchResult) => void;
  onActionPlanLoaded: (r: ActionPlanResult) => void;
  onRoadmapLoaded: (r: RoadmapResult) => void;
  onStartOver: () => void;
}

export function DashboardView({
  intakeData,
  overviewResult,
  financialResult,
  schoolResult,
  actionResult,
  roadmapResult,
  isDemo,
  onOverviewLoaded,
  onFinancialLoaded,
  onSchoolsLoaded,
  onActionPlanLoaded,
  onRoadmapLoaded,
  onStartOver,
}: DashboardViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);
  const activeTab = (searchParams.get('tab') as TabId) || 'overview';

  const handleTabChange = (tab: TabId) => {
    setSearchParams({ tab });
  };

  const handleExport = () => {
    setIsExporting(true);
    exportToPDF(intakeData, overviewResult, financialResult, schoolResult, actionResult, roadmapResult)
      .finally(() => setIsExporting(false));
  };

  const generated: Partial<Record<TabId, boolean>> = {
    overview: overviewResult !== null,
    financial: financialResult !== null,
    schools: schoolResult !== null,
    action: actionResult !== null,
    roadmap: roadmapResult !== null,
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2DED6] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p
              className="font-bold text-[#1A2A22] text-sm tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Path <span className="text-[#0F6E56]">Forward</span>
            </p>
            <p className="text-xs text-[#5C6B63]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>Your college readiness plan</p>
          </div>
          <button
            onClick={onStartOver}
            className="text-xs text-[#6B6A65] hover:text-[#1C1C1A] transition-colors px-2 py-1.5 min-h-[36px]"
          >
            Start over
          </button>
        </div>
      </div>

      {/* Banners */}
      {isDemo && (
        <div className="bg-[#BA7517] text-white text-xs text-center py-2 px-4 font-medium"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          You're viewing sample data — <button onClick={onStartOver} className="underline font-semibold">Get My Plan</button> for personalized results →
        </div>
      )}
      <div className="border-b border-[#E2DED6] text-[#5C6B63] text-xs text-center py-1.5 px-4"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
        Your data stays in your browser. Nothing is stored or shared.
      </div>

      {/* Tab bar */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} generated={generated} />

      {/* Tab content */}
      <main>
        {activeTab === 'overview' && (
          <OverviewTab
            intakeData={intakeData}
            result={overviewResult}
            onLoaded={onOverviewLoaded}
          />
        )}
        {activeTab === 'financial' && (
          <FinancialAidTab
            intakeData={intakeData}
            result={financialResult}
            onLoaded={onFinancialLoaded}
          />
        )}
        {activeTab === 'schools' && (
          <SchoolsTab
            intakeData={intakeData}
            result={schoolResult}
            onLoaded={onSchoolsLoaded}
          />
        )}
        {activeTab === 'action' && (
          <ActionPlanTab
            intakeData={intakeData}
            result={actionResult}
            overviewResult={overviewResult}
            onLoaded={onActionPlanLoaded}
          />
        )}
        {activeTab === 'roadmap' && (
          <RoadmapTab
            intakeData={intakeData}
            result={roadmapResult}
            schoolResult={schoolResult}
            onLoaded={onRoadmapLoaded}
          />
        )}
      </main>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-4 py-8 text-center space-y-4">
        {overviewResult && (
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-base
              transition-all shadow-md min-h-[52px]
              ${isExporting
                ? 'bg-[#E2DED6] text-[#6B6A65] cursor-not-allowed'
                : 'bg-[#BA7517] hover:bg-[#9a6113] text-white hover:shadow-lg'
              }`}
          >
            {isExporting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generating PDF…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Your Plan (PDF)
              </>
            )}
          </button>
        )}
        <div className="space-y-1">
          <p className="text-[13px] text-[#5C6B63]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            This plan is a navigation guide, not legal or financial advice.
            Always verify eligibility directly with the programs listed.
          </p>
          <p className="text-[13px] text-[#5C6B63]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>Built for foster youth in Arizona · Path Forward</p>
        </div>
      </div>
    </div>
  );
}
