import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import OptionChip from './OptionChip';
import {
  getBranch, USE_CASES, VOLUMES, CHALLENGES,
  BRANCH_LABELS, BRANCH_CONTEXT,
  AUTOMATION_NEEDS, TIME_SPENT, PLATFORM_SPEND,
  type PlatformInfo, type OccupationBranch,
} from '@/app/data/surveyConfig';
import type { SurveyState, PlatformAnswers } from '@/app/hooks/useSurvey';

interface Props {
  platform: PlatformInfo;
  state: SurveyState;
  updatePlatform: (key: string, p: Partial<PlatformAnswers>) => void;
  errors: Record<string, string>;
  platformIndex: number;
  totalPlatforms: number;
}

function Err({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-destructive mt-1">{msg}</p> : null;
}

function toggleInArray(arr: string[], val: string) {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

export default function PlatformDeepDivePage({ platform, state, updatePlatform, errors, platformIndex, totalPlatforms }: Props) {
  const branch = getBranch(state.occupation);
  const ans = state.platformAnswers[platform.key] || {
    usage: [], ucVolumes: [], ucChallenges: [], otherTexts: [],
    automationNeeds: [], timeSpent: "", platformSpend: "",
  };
  const useCases = USE_CASES[branch];
  const ctx = BRANCH_CONTEXT[branch];
  const timeSpentOpts = TIME_SPENT[branch];
  const platformSpendOpts = PLATFORM_SPEND[branch];

  const toggleUC = (uc: string) => {
    updatePlatform(platform.key, { usage: toggleInArray(ans.usage, uc) });
  };

  const setVol = (i: number, v: string) => {
    const arr = [...ans.ucVolumes]; arr[i] = v;
    updatePlatform(platform.key, { ucVolumes: arr });
  };

  const toggleChal = (i: number, v: string) => {
    const arr = [...ans.ucChallenges];
    arr[i] = toggleInArray(arr[i] || [], v);
    updatePlatform(platform.key, { ucChallenges: arr });
  };

  const toggleAutomation = (i: number, v: string) => {
    const arr = [...ans.automationNeeds];
    arr[i] = toggleInArray(arr[i] || [], v);
    updatePlatform(platform.key, { automationNeeds: arr });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Platform Deep Dive — {platform.short}</h2>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary">Showing questions for: {BRANCH_LABELS[branch]}</Badge>
          <span className="text-xs text-muted-foreground">Platform {platformIndex + 1} of {totalPlatforms}</span>
        </div>
      </div>

      {/* ── Section A: Usage ── */}
      <div>
        <Label>What do you use {platform.short} for{ctx ? ` ${ctx}` : ''}? <span className="text-destructive">*</span></Label>
        <p className="text-xs text-muted-foreground mt-1 mb-2">Select all that apply — follow-up questions appear for each.</p>
        <div className="flex flex-wrap gap-2">
          {useCases.map(uc => <OptionChip key={uc} label={uc} selected={ans.usage.includes(uc)} onClick={() => toggleUC(uc)} />)}
        </div>
        <Err msg={errors.usage} />
      </div>

      {/* ── Sections B, C, F: Per use case follow-ups ── */}
      {ans.usage.map((uc, i) => {
        const vol = VOLUMES[branch]?.[uc];
        const chal = CHALLENGES[branch]?.[uc];
        const autoNeeds = AUTOMATION_NEEDS[branch]?.[uc];
        if (!vol || !chal) return null;
        const selectedChals = ans.ucChallenges[i] || [];
        const selectedAuto = ans.automationNeeds[i] || [];
        return (
          <div key={uc} className="border-l-2 border-primary pl-4 space-y-5">
            <p className="text-xs font-medium text-primary">{uc} — follow-up</p>

            {/* B: Volume */}
            <div>
              <Label>{vol.q(platform.short)} <span className="text-destructive">*</span></Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {vol.opts.map(o => <OptionChip key={o} label={o} selected={ans.ucVolumes[i] === o} onClick={() => setVol(i, o)} />)}
              </div>
              <Err msg={errors[`volume_${i}`]} />
            </div>

            {/* C: Challenges (loss aversion framing) */}
            <div>
              <Label>Which of these challenges with {uc.toLowerCase()} is currently costing you the most time or revenue? <span className="text-destructive">*</span></Label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">Select all that apply</p>
              <div className="flex flex-wrap gap-2">
                {chal.map(o => <OptionChip key={o} label={o} selected={selectedChals.includes(o)} onClick={() => toggleChal(i, o)} />)}
              </div>
              {selectedChals.includes('Other') && (
                <div className="mt-2">
                  <Input
                    placeholder="Please specify..."
                    value={ans.otherTexts[i] || ''}
                    onChange={e => {
                      const arr = [...ans.otherTexts];
                      arr[i] = e.target.value;
                      updatePlatform(platform.key, { otherTexts: arr });
                    }}
                  />
                </div>
              )}
              <Err msg={errors[`challenge_${i}`]} />
            </div>

            {/* F: Automation Needs (after challenges — research shows this order works better) */}
            {autoNeeds && (
              <div>
                <Label>What automation would help most with {uc.toLowerCase()}? <span className="text-destructive">*</span></Label>
                <p className="text-xs text-muted-foreground mt-1 mb-2">Select all that apply</p>
                <div className="flex flex-wrap gap-2">
                  {autoNeeds.map(o => <OptionChip key={o} label={o} selected={selectedAuto.includes(o)} onClick={() => toggleAutomation(i, o)} />)}
                </div>
                <Err msg={errors[`automation_${i}`]} />
              </div>
            )}
          </div>
        );
      })}

      {/* ── Section J: Time & Cost (moved up — anchors the "cost of status quo") ── */}
      <div className="border-l-2 border-muted pl-4 space-y-5">
        <p className="text-xs text-muted-foreground font-medium">Time & Cost</p>
        <div>
          <Label>{timeSpentOpts.q} <span className="text-destructive">*</span></Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {timeSpentOpts.opts.map(o => <OptionChip key={o} label={o} selected={ans.timeSpent === o} onClick={() => updatePlatform(platform.key, { timeSpent: o })} />)}
          </div>
          <Err msg={errors.timeSpent} />
        </div>
        <div>
          <Label>{platformSpendOpts.q} <span className="text-destructive">*</span></Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {platformSpendOpts.opts.map(o => <OptionChip key={o} label={o} selected={ans.platformSpend === o} onClick={() => updatePlatform(platform.key, { platformSpend: o })} />)}
          </div>
          <Err msg={errors.platformSpend} />
        </div>
      </div>

      {/* ── Progress marker ── */}
      {platformIndex < totalPlatforms - 1 ? (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">✓ {platform.short} complete! Next: {state.platformsUsed.filter(p => p !== 'None of these')[platformIndex + 1] ?? 'next platform'}</p>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">✓ All platforms complete! Now for the final questions...</p>
        </div>
      )}
    </div>
  );
}
