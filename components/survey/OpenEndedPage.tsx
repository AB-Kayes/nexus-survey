import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import type { SurveyState } from '@/app/hooks/useSurvey';

interface Props {
  state: SurveyState;
  update: (p: Partial<SurveyState>) => void;
  errors: Record<string, string>;
}

function Err({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-destructive mt-1">{msg}</p> : null;
}

export default function OpenEndedPage({ state, update, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Your Insights</h2>
        <p className="text-xs text-muted-foreground mt-1">Almost done! Your open-ended responses help us understand the nuances that structured questions can't capture.</p>
      </div>

      {/* O1: Biggest challenge — with foot-in-the-door warm-up */}
      <div>
        <Label>In just one word, what is your #1 frustration with current messaging tools?</Label>
        <Input className="mt-1" placeholder="e.g. fragmentation, manual, slow..." value={state.frustrationOneWord || ''} onChange={e => update({ frustrationOneWord: e.target.value })} />
        <div className="mt-3">
          <Label>Now, could you tell us more about that challenge? What impact does it have on your work? <span className="text-destructive">*</span></Label>
          <Textarea className="mt-1 min-h-[100px]" placeholder="Describe the biggest challenge you face when managing communication across multiple platforms..." value={state.biggestChallenge} onChange={e => update({ biggestChallenge: e.target.value })} />
          <div className="flex justify-between mt-1">
            <Err msg={errors.biggestChallenge} />
            <span className="text-xs text-muted-foreground">{state.biggestChallenge.length} chars</span>
          </div>
        </div>
      </div>

      {/* O2: What would convince to switch */}
      <div>
        <Label>If a single tool could manage ALL your communication platforms in one place, what would convince you to switch to it? <span className="text-destructive">*</span></Label>
        <Textarea className="mt-1 min-h-[100px]" placeholder="Your answer..." value={state.whatWouldConvince} onChange={e => update({ whatWouldConvince: e.target.value })} />
        <div className="flex justify-between mt-1">
          <Err msg={errors.whatWouldConvince} />
          <span className="text-xs text-muted-foreground">{state.whatWouldConvince.length} chars</span>
        </div>
      </div>

      {/* O3: Concerns */}
      <div>
        <Label>What concerns or worries would you have about using one platform to manage ALL your business communication? <span className="text-destructive">*</span></Label>
        <Textarea className="mt-1 min-h-[100px]" placeholder="Your answer..." value={state.concerns} onChange={e => update({ concerns: e.target.value })} />
        <div className="flex justify-between mt-1">
          <Err msg={errors.concerns} />
          <span className="text-xs text-muted-foreground">{state.concerns.length} chars</span>
        </div>
      </div>
    </div>
  );
}
