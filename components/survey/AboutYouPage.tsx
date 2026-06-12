import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OptionChip from './OptionChip';
import { AGE_GROUPS, OCCUPATIONS, TEAM_SIZES } from '@/app/data/surveyConfig';
import type { SurveyState } from '@/app/hooks/useSurvey';

interface Props {
  state: SurveyState;
  update: (p: Partial<SurveyState>) => void;
  errors: Record<string, string>;
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-destructive mt-1">{msg}</p> : null;
}

export default function AboutYouPage({ state, update, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Build Your Profile</h2>
        <p className="text-xs text-muted-foreground mt-1">First, let's build your profile so we can personalize the questions for you. This helps us understand your specific needs.</p>
      </div>
      <div>
        <Label>Name <span className="text-muted-foreground text-xs">(optional)</span></Label>
        <Input className="mt-1" placeholder="Your name" value={state.name} onChange={e => update({ name: e.target.value })} />
      </div>
      <div>
        <Label>What country are you from? <span className="text-destructive">*</span></Label>
        <Input className="mt-1" placeholder="e.g. United States" value={state.country} onChange={e => update({ country: e.target.value })} />
        <FieldError msg={errors.country} />
      </div>
      <div>
        <Label>What is your age group? <span className="text-destructive">*</span></Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {AGE_GROUPS.map(g => <OptionChip key={g} label={g} selected={state.ageGroup === g} onClick={() => update({ ageGroup: g })} />)}
        </div>
        <FieldError msg={errors.ageGroup} />
      </div>
      <div>
        <Label>What is your occupation? <span className="text-destructive">*</span></Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-1">This personalizes all platform questions and your pricing question for your role.</p>
        <Select value={state.occupation} onValueChange={v => update({ occupation: v })}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Select one..." /></SelectTrigger>
          <SelectContent>{OCCUPATIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
        <FieldError msg={errors.occupation} />
      </div>
      <div>
        <Label>What is your organization / team size? <span className="text-destructive">*</span></Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {TEAM_SIZES.map(s => <OptionChip key={s} label={s} selected={state.teamSize === s} onClick={() => update({ teamSize: s })} />)}
        </div>
        <FieldError msg={errors.teamSize} />
      </div>
    </div>
  );
}
