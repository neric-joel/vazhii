import { useState } from 'react';
import type { IntakeFormData, FinancialAidResult } from '../../lib/types';
import { fetchFinancialAid } from '../../lib/claude';
import { FinancialAidCards } from './FinancialAidCards';
import { SectionIntro } from './SectionIntro';
import { FundingSkeleton } from '../shared/Shimmer';

interface FinancialAidTabProps {
  intakeData: IntakeFormData;
  result: FinancialAidResult | null;
  onLoaded: (r: FinancialAidResult) => void;
}

export function FinancialAidTab({ intakeData, result, onLoaded }: FinancialAidTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleGenerate = () => {
    setIsLoading(true);
    setIsError(false);
    fetchFinancialAid(intakeData)
      .then(r => { onLoaded(r); })
      .catch(() => { setIsError(true); })
      .finally(() => { setIsLoading(false); });
  };

  if (isLoading) return <FundingSkeleton />;

  if (!result) {
    return (
      <SectionIntro
        icon="💰"
        title="Your Funding Details"
        description="See the full details of every program you qualify for — exact amounts, deadlines, who to contact, and what to do first."
        ctaLabel="Show My Funding Details →"
        note="Uses AI to generate personalized results based on your intake answers."
        isLoading={isLoading}
        isError={isError}
        onGenerate={handleGenerate}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-5">
      <FinancialAidCards programs={result.matched_programs} />
    </div>
  );
}
