import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import type {
  IntakeFormData,
  OverviewResult,
  FinancialAidResult,
  SchoolMatchResult,
  ActionPlanResult,
  RoadmapResult,
} from './lib/types';
import {
  DEMO_OVERVIEW,
  DEMO_FINANCIAL,
  DEMO_SCHOOLS,
  DEMO_ACTION_PLAN,
  DEMO_ROADMAP,
} from './lib/demo-data';
import Home from './pages/Home';
import Intake from './pages/Intake';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [intakeData, setIntakeData] = useState<IntakeFormData | null>(null);
  const [overviewResult, setOverviewResult] = useState<OverviewResult | null>(null);
  const [financialResult, setFinancialResult] = useState<FinancialAidResult | null>(null);
  const [schoolResult, setSchoolResult] = useState<SchoolMatchResult | null>(null);
  const [actionResult, setActionResult] = useState<ActionPlanResult | null>(null);
  const [roadmapResult, setRoadmapResult] = useState<RoadmapResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const handleDemo = () => {
    const demoIntake: IntakeFormData = {
      age: 20,
      state: 'Arizona',
      educationGoal: 'community_college',
      timeline: 'just_aged_out',
      planned_start: 'fall_2026',
      documents: ['state_id', 'social_security_card'],
      benefitsApplied: [],
    };
    setIntakeData(demoIntake);
    setOverviewResult(DEMO_OVERVIEW);
    setFinancialResult(DEMO_FINANCIAL);
    setSchoolResult(DEMO_SCHOOLS);
    setActionResult(DEMO_ACTION_PLAN);
    setRoadmapResult(DEMO_ROADMAP);
    setIsDemo(true);
  };

  const handleIntakeComplete = (data: IntakeFormData) => {
    setIntakeData(data);
    setOverviewResult(null);
    setFinancialResult(null);
    setSchoolResult(null);
    setActionResult(null);
    setRoadmapResult(null);
    setIsDemo(false);
  };

  const handleStartOver = () => {
    setIntakeData(null);
    setOverviewResult(null);
    setFinancialResult(null);
    setSchoolResult(null);
    setActionResult(null);
    setRoadmapResult(null);
    setIsDemo(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home onDemo={handleDemo} />} />
        <Route
          path="/intake"
          element={<Intake onComplete={handleIntakeComplete} />}
        />
        <Route
          path="/dashboard"
          element={
            intakeData ? (
              <Dashboard
                intakeData={intakeData}
                overviewResult={overviewResult}
                financialResult={financialResult}
                schoolResult={schoolResult}
                actionResult={actionResult}
                roadmapResult={roadmapResult}
                isDemo={isDemo}
                onOverviewLoaded={setOverviewResult}
                onFinancialLoaded={setFinancialResult}
                onSchoolsLoaded={setSchoolResult}
                onActionPlanLoaded={setActionResult}
                onRoadmapLoaded={setRoadmapResult}
                onStartOver={handleStartOver}
              />
            ) : (
              <Navigate to="/intake" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
