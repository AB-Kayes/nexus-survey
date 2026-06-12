import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import OptionChip from './OptionChip';
import { Gift } from 'lucide-react';
import type { SurveyState } from '@/app/hooks/useSurvey';

interface Props {
  state: SurveyState;
  update: (p: Partial<SurveyState>) => void;
  errors: Record<string, string>;
}

function Err({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-destructive mt-1">{msg}</p> : null;
}

const NOTIFY_OPTIONS = ['Yes, notify me!', 'No thanks'];

export default function ThankYouPage({ state, update, errors }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Secure Your Early-Access Seat 🎁</h2>
        <p className="text-muted-foreground mt-2">You've completed the research! Now claim your reward.</p>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
          <Gift className="h-4 w-4" />
          Your Reward for Completing This Survey
        </div>
        <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
          <li>Early access to Project Nexus before public launch</li>
          <li>Special launch pricing (exclusive to survey respondents)</li>
          <li>Direct input on the product roadmap</li>
        </ul>
      </div>

      <div>
        <Label>Would you like to be notified when we launch and receive your special early-user offer? <span className="text-destructive">*</span></Label>
        <div className="flex gap-3 mt-2">
          {NOTIFY_OPTIONS.map(o => <OptionChip key={o} label={o} selected={state.wantsNotification === o} onClick={() => update({ wantsNotification: o })} />)}
        </div>
        <Err msg={errors.wantsNotification} />
      </div>

      {state.wantsNotification === 'Yes, notify me!' && (
        <div>
          <Label>Please enter your email address <span className="text-destructive">*</span></Label>
          <Input className="mt-1" type="email" placeholder="you@example.com" value={state.notificationEmail} onChange={e => update({ notificationEmail: e.target.value })} />
          <Err msg={errors.notificationEmail} />
        </div>
      )}
    </div>
  );
}
