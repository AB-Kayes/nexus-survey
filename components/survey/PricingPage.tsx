import type { SurveyState } from '@/app/hooks/useSurvey';

interface Props {
  state: SurveyState;
  update: (p: Partial<SurveyState>) => void;
  errors: Record<string, string>;
}

// Pricing questions are now inside ConsolidatedQuestionsPage
// This component is kept for any standalone pricing page needs
export default function PricingPage({ state: _state, update: _update, errors: _errors }: Props) {
  return null;
}
