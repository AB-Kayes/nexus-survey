import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import OptionChip from './OptionChip';
import {
  getBranch,
  AI_NEEDS, AI_CONCERNS, AI_READINESS,
  INTEGRATION_NEEDS, FEATURE_OPTIONS, SWITCH_OPTIONS,
  SECURITY_NEEDS, ONBOARDING_NEEDS, TEAM_WORKFLOW,
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

function OtherInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="mt-2">
      <Input
        placeholder={placeholder || 'Please specify...'}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

export default function ConsolidatedQuestionsPage({ state, update, errors }: Props) {
  const branch = getBranch(state.occupation);
  const ca = state.consolidatedAnswers || {
    aiReadiness: "", aiNeeds: [], aiConcerns: [],
    integrationNeeds: [], features: [], switchAnswers: [],
    switchIntent: "", switchTrigger: "",
    securityNeeds: [], onboardingNeeds: [],
    teamWorkflow: "", currentlyPays: "", paidToolTypes: [],
    willingnessToPay: "", pricingModel: "", otherTexts: {},
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
  const workflowOpts = TEAM_WORKFLOW[branch];

  const isSwitchLikely = ca.switchIntent === "Very likely" || ca.switchIntent === "Somewhat likely";

  const setOther = (key: string, value: string) => {
    update({ otherTexts: { ...ca.otherTexts, [key]: value } });
  };

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
              {(aiNeedOpts.includes('Other') ? aiNeedOpts : [...aiNeedOpts, 'Other']).map(o => <OptionChip key={o} label={o} selected={ca.aiNeeds.includes(o)} onClick={() => update({ aiNeeds: toggleInArray(ca.aiNeeds, o) })} />)}
            </div>
            {ca.aiNeeds.includes('Other') && <OtherInput value={ca.otherTexts['aiNeeds'] || ''} onChange={v => setOther('aiNeeds', v)} />}
            <Err msg={errors.aiNeeds} />
          </div>
        )}
        <div>
          <Label>What concerns do you have about using AI for business messaging? <span className="text-destructive">*</span></Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {(AI_CONCERNS.includes('Other') ? AI_CONCERNS : [...AI_CONCERNS, 'Other']).map(o => <OptionChip key={o} label={o} selected={ca.aiConcerns.includes(o)} onClick={() => update({ aiConcerns: toggleInArray(ca.aiConcerns, o) })} />)}
          </div>
          {ca.aiConcerns.includes('Other') && <OtherInput value={ca.otherTexts['aiConcerns'] || ''} onChange={v => setOther('aiConcerns', v)} />}
          <Err msg={errors.aiConcerns} />
        </div>
      </div>

      {/* ── Section T: Team Workflow ── */}
      {workflowOpts && (
        <div className="border-l-2 border-muted pl-4 space-y-5">
          <p className="text-xs text-muted-foreground font-medium">Current Workflow</p>
          <div>
            <Label>{workflowOpts.q} <span className="text-destructive">*</span></Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(workflowOpts.opts.includes('Other') ? workflowOpts.opts : [...workflowOpts.opts, 'Other']).map(o => <OptionChip key={o} label={o} selected={ca.teamWorkflow === o} onClick={() => update({ teamWorkflow: o })} />)}
            </div>
            {ca.teamWorkflow === 'Other' && <OtherInput value={ca.otherTexts['teamWorkflow'] || ''} onChange={v => setOther('teamWorkflow', v)} />}
            <Err msg={errors.teamWorkflow} />
          </div>
        </div>
      )}

      {/* ── Section H: Integration Needs ── */}
      {integrationOpts.length > 0 && (
        <div className="border-l-2 border-muted pl-4 space-y-5">
          <p className="text-xs text-muted-foreground font-medium">Integrations</p>
          <div>
            <Label>What integrations are most important for your overall messaging workflow? <span className="text-destructive">*</span></Label>
            <p className="text-xs text-muted-foreground mt-1 mb-2">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {(integrationOpts.includes('Other') ? integrationOpts : [...integrationOpts, 'Other']).map(o => <OptionChip key={o} label={o} selected={ca.integrationNeeds.includes(o)} onClick={() => update({ integrationNeeds: toggleInArray(ca.integrationNeeds, o) })} />)}
            </div>
            {ca.integrationNeeds.includes('Other') && <OtherInput value={ca.otherTexts['integrationNeeds'] || ''} onChange={v => setOther('integrationNeeds', v)} />}
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
            {(featureOpts.includes('Other') ? featureOpts : [...featureOpts, 'Other']).map(o => (
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
          {ca.features.includes('Other') && <OtherInput value={ca.otherTexts['features'] || ''} onChange={v => setOther('features', v)} />}
          <Err msg={errors.features} />
        </div>
        <div>
          <Label>What would make you switch to a new messaging platform? <span className="text-destructive">*</span></Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {(switchOpts.includes('Other') ? switchOpts : [...switchOpts, 'Other']).map(o => <OptionChip key={o} label={o} selected={ca.switchAnswers.includes(o)} onClick={() => update({ switchAnswers: toggleInArray(ca.switchAnswers, o) })} />)}
          </div>
          {ca.switchAnswers.includes('Other') && <OtherInput value={ca.otherTexts['switchAnswers'] || ''} onChange={v => setOther('switchAnswers', v)} />}
          <Err msg={errors.switchAnswers} />
        </div>
      </div>

      {/* ── Section K: Security & Compliance ── */}
      {securityOpts && (
        <div className="border-l-2 border-muted pl-4 space-y-5">
          <p className="text-xs text-muted-foreground font-medium">Data Protection & Trust</p>
          <div>
            <Label>{securityOpts.q} <span className="text-destructive">*</span></Label>
            <p className="text-xs text-muted-foreground mt-1 mb-2">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {(securityOpts.opts.includes('Other') ? securityOpts.opts : [...securityOpts.opts, 'Other']).map(o => <OptionChip key={o} label={o} selected={ca.securityNeeds.includes(o)} onClick={() => update({ securityNeeds: toggleInArray(ca.securityNeeds, o) })} />)}
            </div>
            {ca.securityNeeds.includes('Other') && <OtherInput value={ca.otherTexts['securityNeeds'] || ''} onChange={v => setOther('securityNeeds', v)} />}
            <Err msg={errors.securityNeeds} />
          </div>
        </div>
      )}

      {/* ── Section L: Onboarding & Setup ── */}
      {onboardingOpts && (
        <div className="border-l-2 border-muted pl-4 space-y-5">
          <p className="text-xs text-muted-foreground font-medium">Getting Started</p>
          <div>
            <Label>{onboardingOpts.q} <span className="text-destructive">*</span></Label>
            <p className="text-xs text-muted-foreground mt-1 mb-2">Select up to 3 most important</p>
            <div className="flex flex-wrap gap-2">
              {(onboardingOpts.opts.includes('Other') ? onboardingOpts.opts : [...onboardingOpts.opts, 'Other']).map(o => (
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
            {ca.onboardingNeeds.includes('Other') && <OtherInput value={ca.otherTexts['onboardingNeeds'] || ''} onChange={v => setOther('onboardingNeeds', v)} />}
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
              {(PAID_TOOL_TYPES.includes('Other') ? PAID_TOOL_TYPES : [...PAID_TOOL_TYPES, 'Other']).map(t => <OptionChip key={t} label={t} selected={ca.paidToolTypes.includes(t)} onClick={() => update({ paidToolTypes: toggleInArray(ca.paidToolTypes, t) })} />)}
            </div>
            {ca.paidToolTypes.includes('Other') && <OtherInput value={ca.otherTexts['paidToolTypes'] || ''} onChange={v => setOther('paidToolTypes', v)} />}
            <Err msg={errors.paidToolTypes} />
          </div>
        )}
        <div>
          <Label>{pricingConfig.q} <span className="text-destructive">*</span></Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">{pricingConfig.helper}</p>
          <div className="flex flex-wrap gap-2">
            {pricingConfig.opts.map(o => <OptionChip key={o} label={o} selected={ca.willingnessToPay === o} onClick={() => update({ willingnessToPay: o })} />)}
          </div>
          {ca.willingnessToPay === 'Other' && <OtherInput value={ca.otherTexts['willingnessToPay'] || ''} onChange={v => setOther('willingnessToPay', v)} />}
          <Err msg={errors.willingnessToPay} />
        </div>
        <div>
          <Label>Which pricing model do you prefer? <span className="text-destructive">*</span></Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {(PRICING_MODELS.includes('Other') ? PRICING_MODELS : [...PRICING_MODELS, 'Other']).map(m => <OptionChip key={m} label={m} selected={ca.pricingModel === m} onClick={() => update({ pricingModel: m })} />)}
          </div>
          {ca.pricingModel === 'Other' && <OtherInput value={ca.otherTexts['pricingModel'] || ''} onChange={v => setOther('pricingModel', v)} />}
          <Err msg={errors.pricingModel} />
        </div>
      </div>
    </div>
  );
}
