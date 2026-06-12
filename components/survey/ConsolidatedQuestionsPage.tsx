import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import OptionChip from './OptionChip';
import {
  getBranch,
  AI_NEEDS, AI_CONCERNS, AI_READINESS,
  INTEGRATION_NEEDS, FEATURE_OPTIONS, SWITCH_OPTIONS,
  SECURITY_NEEDS, ONBOARDING_NEEDS,
  SWITCH_INTENT, SWITCH_TRIGGER,
  PRICING_CONFIG, PAID_TOOL_TYPES, PRICING_MODELS,
  BRANCH_LABELS,
  type OccupationBranch,
} from '@/app/data/surveyConfig';
import type { SurveyState, ConsolidatedAnswers } from '@/app/hooks/useSurvey';

interface Props {
  state: SurveyState;
  update: (p: Partial<ConsolidatedAnswers>) => void;
  errors: Record<string, string>;
}

function Err({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-destructive mt-1">{msg}</p> : null;
}

function toggleInArray(arr: string[], val: string) {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

export default function ConsolidatedQuestionsPage({ state, update, errors }: Props) {
  const branch = getBranch(state.occupation);
  const ca = state.consolidatedAnswers || {
    aiReadiness: "", aiNeeds: [], aiConcerns: [],
    integrationNeeds: [], features: [], switchAnswers: [],
    switchIntent: "", switchTrigger: "",
    securityNeeds: [], onboardingNeeds: [],
    currentlyPays: "", paidToolTypes: [],
    willingnessToPay: "", pricingModel: "",
  };

  const aiNeedOpts = AI_NEEDS['whatsapp']?.[branch] ?? [];
  const integrationOpts = INTEGRATION_NEEDS['whatsapp']?.[branch] ?? [];
  const featureOpts = FEATURE_OPTIONS['whatsapp']?.[branch] ?? [];
  const switchOpts = SWITCH_OPTIONS['whatsapp']?.[branch] ?? [];
  const securityOpts = SECURITY_NEEDS[branch];
  const onboardingOpts = ONBOARDING_NEEDS[branch];
  const switchIntentOpts = SWITCH_INTENT[branch];
  const switchTriggerOpts = SWITCH_TRIGGER[branch];
  const pricingConfig = PRICING_CONFIG[branch];

  const isSwitchLikely = ca.switchIntent === "Very likely" || ca.switchIntent === "Somewhat likely";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Cross-Platform Requirements</h2>
        <Badge variant="secondary" className="mt-2">For {BRANCH_LABELS[branch]} — asked once for all your platforms</Badge>
        <p className="text-xs text-muted-foreground mt-2">Almost done! These questions cover your overall communication workflow across all platforms.</p>
      </div>

      {/* ── Section G: AI & Intelligence (3 sub-parts) ── */}
      <div className="border-l-2 border-muted pl-4 space-y-5">
        <p className="text-xs text-muted-foreground font-medium">AI & Intelligence</p>
        <div>
          <Label>How would you describe your experience with AI tools for business messaging? <span className="text-destructive">*</span></Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {AI_READINESS.map(o => <OptionChip key={o} label={o} selected={ca.aiReadiness === o} onClick={() => update({ aiReadiness: o })} />)}
          </div>
          <Err msg={errors.aiReadiness} />
        </div>
        {aiNeedOpts.length > 0 && (
          <div>
            <Label>Which AI features would be most valuable for your messaging workflow? <span className="text-destructive">*</span></Label>
            <p className="text-xs text-muted-foreground mt-1 mb-2">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {aiNeedOpts.map(o => <OptionChip key={o} label={o} selected={ca.aiNeeds.includes(o)} onClick={() => update({ aiNeeds: toggleInArray(ca.aiNeeds, o) })} />)}
            </div>
            <Err msg={errors.aiNeeds} />
          </div>
        )}
        <div>
          <Label>What concerns do you have about using AI for business messaging? <span className="text-destructive">*</span></Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {AI_CONCERNS.map(o => <OptionChip key={o} label={o} selected={ca.aiConcerns.includes(o)} onClick={() => update({ aiConcerns: toggleInArray(ca.aiConcerns, o) })} />)}
          </div>
          <Err msg={errors.aiConcerns} />
        </div>
      </div>

      {/* ── Section H: Integration Needs ── */}
      {integrationOpts.length > 0 && (
        <div className="border-l-2 border-muted pl-4 space-y-5">
          <p className="text-xs text-muted-foreground font-medium">Integrations</p>
          <div>
            <Label>What integrations are most important for your overall messaging workflow? <span className="text-destructive">*</span></Label>
            <p className="text-xs text-muted-foreground mt-1 mb-2">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {integrationOpts.map(o => <OptionChip key={o} label={o} selected={ca.integrationNeeds.includes(o)} onClick={() => update({ integrationNeeds: toggleInArray(ca.integrationNeeds, o) })} />)}
            </div>
            <Err msg={errors.integrationNeeds} />
          </div>
        </div>
      )}

      {/* ── Section D: Features + Switch ── */}
      <div className="border-l-2 border-muted pl-4 space-y-5">
        <p className="text-xs text-muted-foreground font-medium">Features & Switching</p>
        <div>
          <Label>Which features would save you the most time across all platforms? <span className="text-destructive">*</span></Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">Select up to 3 features</p>
          <div className="flex flex-wrap gap-2">
            {featureOpts.map(o => (
              <OptionChip key={o} label={o} selected={ca.features.includes(o)} onClick={() => {
                if (ca.features.includes(o)) {
                  update({ features: ca.features.filter(f => f !== o) });
                } else if (ca.features.length < 3) {
                  update({ features: [...ca.features, o] });
                }
              }} />
            ))}
          </div>
          {ca.features.length === 3 && <p className="text-xs text-muted-foreground mt-1">Maximum of 3 selected</p>}
          <Err msg={errors.features} />
        </div>
        <div>
          <Label>What would make you switch to a new messaging platform? <span className="text-destructive">*</span></Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {switchOpts.map(o => <OptionChip key={o} label={o} selected={ca.switchAnswers.includes(o)} onClick={() => update({ switchAnswers: toggleInArray(ca.switchAnswers, o) })} />)}
          </div>
          <Err msg={errors.switchAnswers} />
        </div>
      </div>

      {/* ── Section K: Security & Compliance ── */}
      {securityOpts && (
        <div className="border-l-2 border-muted pl-4 space-y-5">
          <p className="text-xs text-muted-foreground font-medium">Security & Compliance</p>
          <div>
            <Label>{securityOpts.q} <span className="text-destructive">*</span></Label>
            <p className="text-xs text-muted-foreground mt-1 mb-2">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {securityOpts.opts.map(o => <OptionChip key={o} label={o} selected={ca.securityNeeds.includes(o)} onClick={() => update({ securityNeeds: toggleInArray(ca.securityNeeds, o) })} />)}
            </div>
            <Err msg={errors.securityNeeds} />
          </div>
        </div>
      )}

      {/* ── Section L: Onboarding & Setup ── */}
      {onboardingOpts && (
        <div className="border-l-2 border-muted pl-4 space-y-5">
          <p className="text-xs text-muted-foreground font-medium">Onboarding & Setup</p>
          <div>
            <Label>{onboardingOpts.q} <span className="text-destructive">*</span></Label>
            <p className="text-xs text-muted-foreground mt-1 mb-2">Select up to 3 most important</p>
            <div className="flex flex-wrap gap-2">
              {onboardingOpts.opts.map(o => (
                <OptionChip key={o} label={o} selected={ca.onboardingNeeds.includes(o)} onClick={() => {
                  if (ca.onboardingNeeds.includes(o)) {
                    update({ onboardingNeeds: ca.onboardingNeeds.filter(x => x !== o) });
                  } else if (ca.onboardingNeeds.length < 3) {
                    update({ onboardingNeeds: [...ca.onboardingNeeds, o] });
                  }
                }} />
              ))}
            </div>
            {ca.onboardingNeeds.length === 3 && <p className="text-xs text-muted-foreground mt-1">Maximum of 3 selected</p>}
            <Err msg={errors.onboardingNeeds} />
          </div>
        </div>
      )}

      {/* ── Section I: Switching Intent + Timeline ── */}
      <div className="border-l-2 border-muted pl-4 space-y-5">
        <p className="text-xs text-muted-foreground font-medium">Switching Intent</p>
        <div>
          <Label>{switchIntentOpts.q} <span className="text-destructive">*</span></Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {switchIntentOpts.opts.map(o => <OptionChip key={o} label={o} selected={ca.switchIntent === o} onClick={() => update({ switchIntent: o })} />)}
          </div>
          <Err msg={errors.switchIntent} />
        </div>
        {isSwitchLikely && switchTriggerOpts && (
          <div>
            <Label>{switchTriggerOpts.q} <span className="text-destructive">*</span></Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {switchTriggerOpts.opts.map(o => <OptionChip key={o} label={o} selected={ca.switchTrigger === o} onClick={() => update({ switchTrigger: o })} />)}
            </div>
            <Err msg={errors.switchTrigger} />
          </div>
        )}
      </div>

      {/* ── Pricing ── */}
      <div className="border-l-2 border-primary pl-4 space-y-5">
        <p className="text-xs font-medium text-primary">Pricing & Value</p>
        <div>
          <Label>Do you currently pay for any messaging or communication tools? <span className="text-destructive">*</span></Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Yes', 'No', 'I use free tools only'].map(o => <OptionChip key={o} label={o} selected={ca.currentlyPays === o} onClick={() => update({ currentlyPays: o, paidToolTypes: o !== 'Yes' ? [] : ca.paidToolTypes })} />)}
          </div>
          <Err msg={errors.currentlyPays} />
        </div>
        {ca.currentlyPays === 'Yes' && (
          <div className="border-l-2 border-primary/50 pl-4">
            <Label>Which type of tools do you currently pay for? <span className="text-destructive">*</span></Label>
            <p className="text-xs text-muted-foreground mt-1 mb-2">Select all that apply.</p>
            <div className="flex flex-wrap gap-2">
              {PAID_TOOL_TYPES.map(t => <OptionChip key={t} label={t} selected={ca.paidToolTypes.includes(t)} onClick={() => update({ paidToolTypes: toggleInArray(ca.paidToolTypes, t) })} />)}
            </div>
            <Err msg={errors.paidToolTypes} />
          </div>
        )}
        <div>
          <Label>{pricingConfig.q} <span className="text-destructive">*</span></Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">{pricingConfig.helper}</p>
          <div className="flex flex-wrap gap-2">
            {pricingConfig.opts.map(o => <OptionChip key={o} label={o} selected={ca.willingnessToPay === o} onClick={() => update({ willingnessToPay: o })} />)}
          </div>
          <Err msg={errors.willingnessToPay} />
        </div>
        <div>
          <Label>Which pricing model do you prefer? <span className="text-destructive">*</span></Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {PRICING_MODELS.map(m => <OptionChip key={m} label={m} selected={ca.pricingModel === m} onClick={() => update({ pricingModel: m })} />)}
          </div>
          <Err msg={errors.pricingModel} />
        </div>
      </div>
    </div>
  );
}
