import { useNavigate } from 'react-router-dom';
import type { AssessmentResult } from '../lib/types';
import { DashboardView } from '../components/dashboard/DashboardView';

interface DashboardPageProps {
  result: AssessmentResult | null;
  isDemo?: boolean;
  onStartOver?: () => void;
}

export default function Dashboard({ result, isDemo = false, onStartOver }: DashboardPageProps) {
  const navigate = useNavigate();

  const handleStartOver = () => {
    if (onStartOver) onStartOver();
    navigate('/');
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center px-6 gap-4">
        <p className="text-[#1C1C1A] text-lg font-semibold" style={{ fontFamily: "'DM Serif Display', serif" }}>
          No assessment yet
        </p>
        <p className="text-[#6B6A65] text-sm text-center max-w-xs">
          Complete the intake form to see your college readiness plan.
        </p>
        <button
          onClick={() => navigate('/intake')}
          className="bg-[#0F6E56] text-white font-semibold px-8 py-3 rounded-full
                     hover:bg-[#0a4f3e] transition-colors shadow-md min-h-[48px]"
        >
          Start My Assessment
        </button>
      </div>
    );
  }

  return (
    <DashboardView
      result={result}
      onStartOver={handleStartOver}
      isDemo={isDemo}
    />
  );
}
