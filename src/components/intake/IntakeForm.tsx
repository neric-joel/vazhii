import { useState } from 'react';
import type { IntakeFormData } from '../../lib/types';
import { StepIndicator } from './StepIndicator';
import { AgeStateField } from './fields/AgeStateField';
import { EducationGoalField } from './fields/EducationGoalField';
import { TimelineField } from './fields/TimelineField';
import { DocumentsField } from './fields/DocumentsField';
import { BenefitsField } from './fields/BenefitsField';
import { IntakeReview } from './IntakeReview';

interface IntakeFormProps {
  onComplete: (data: IntakeFormData) => void;
}

const TOTAL_STEPS = 6; // 5 fields + 1 review
const STEP_LABELS = ['You', 'Goal', 'Timeline', 'Documents', 'Benefits', 'Review'];

const EMPTY_FORM: IntakeFormData = {
  age: 0,
  state: 'Arizona',
  educationGoal: '',
  timeline: '' as IntakeFormData['timeline'],
  planned_start: '' as IntakeFormData['planned_start'],
  documents: [],
  benefitsApplied: [],
};

function canAdvance(step: number, data: IntakeFormData): boolean {
  switch (step) {
    case 1: return data.age >= 14 && data.age <= 30 && data.state !== '';
    case 2: return data.educationGoal !== '';
    case 3: return (data.timeline as string) !== '' && (data.planned_start as string) !== '';
    case 4: return true; // documents are optional
    case 5: return true; // benefits are optional
    case 6: return true;
    default: return false;
  }
}

export function IntakeForm({ onComplete }: IntakeFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<IntakeFormData>(EMPTY_FORM);

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  // V3: no API call here — just pass data up. OverviewTab fires the first API call.
  const handleSubmit = () => {
    onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E2DED6] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#1C1C1A] font-semibold text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Vazhi <span className="text-[#0F6E56]">வழி</span>
            </span>
            <span className="text-[#6B6A65] text-xs">Step {step} of {TOTAL_STEPS}</span>
          </div>
          <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-lg mx-auto">

          {step === 1 && (
            <AgeStateField
              age={formData.age}
              state={formData.state}
              onChange={(age, state) => setFormData(d => ({ ...d, age, state }))}
            />
          )}

          {step === 2 && (
            <EducationGoalField
              value={formData.educationGoal}
              onChange={educationGoal => setFormData(d => ({ ...d, educationGoal }))}
            />
          )}

          {step === 3 && (
            <TimelineField
              timeline={formData.timeline}
              plannedStart={formData.planned_start}
              onTimelineChange={timeline => setFormData(d => ({ ...d, timeline }))}
              onPlannedStartChange={planned_start => setFormData(d => ({ ...d, planned_start }))}
            />
          )}

          {step === 4 && (
            <DocumentsField
              selected={formData.documents}
              onChange={documents => setFormData(d => ({ ...d, documents }))}
            />
          )}

          {step === 5 && (
            <BenefitsField
              selected={formData.benefitsApplied}
              onChange={benefitsApplied => setFormData(d => ({ ...d, benefitsApplied }))}
            />
          )}

          {step === 6 && (
            <IntakeReview
              data={formData}
              onEdit={targetStep => setStep(targetStep)}
            />
          )}

        </div>
      </div>

      {/* Footer nav */}
      <div className="bg-white border-t border-[#E2DED6] px-6 py-4 sticky bottom-0">
        <div className="max-w-lg mx-auto flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3.5 rounded-xl border-2 border-[#E2DED6]
                         text-[#1C1C1A] font-semibold text-sm
                         hover:border-[#0F6E56]/40 transition-colors min-h-[48px]"
            >
              ← Back
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canAdvance(step, formData)}
              className={`flex-[2] py-3.5 rounded-xl font-semibold text-sm transition-all min-h-[48px]
                ${canAdvance(step, formData)
                  ? 'bg-[#0F6E56] hover:bg-[#0a4f3e] text-white shadow-sm'
                  : 'bg-[#E2DED6] text-[#6B6A65] cursor-not-allowed'
                }`}
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-[2] py-3.5 rounded-xl bg-[#BA7517] hover:bg-[#9a6012]
                         text-white font-semibold text-sm shadow-md
                         hover:shadow-lg transition-all min-h-[48px]"
            >
              Get My Plan →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
